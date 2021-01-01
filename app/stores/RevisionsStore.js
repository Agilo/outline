// @flow
import { action, runInAction } from 'mobx';
import { filter } from 'lodash';
import invariant from 'invariant';
import { client } from 'utils/ApiClient';
import BaseStore from 'stores/BaseStore';
import RootStore from 'stores/RootStore';
import Revision from 'models/Revision';
import type { FetchOptions, PaginationParams } from 'types';

export default class RevisionsStore extends BaseStore<Revision> {
  actions = ['list'];

  constructor(rootStore: RootStore) {
    super(rootStore, Revision);
  }

  getDocumentRevisions(documentId: string): Revision[] {
    let revisions = filter(this.orderedData, { documentId });
    const latestRevision = revisions[0];
    const document = this.rootStore.documents.get(documentId);

    // There is no guarantee that we have a revision that represents the latest
    // state of the document. This pushes a fake revision in at the top if there
    // isn't one
    if (
      latestRevision &&
      document &&
      latestRevision.createdAt !== document.updatedAt
    ) {
      revisions.unshift(
        new Revision({
          id: "latest",
          documentId: document.id,
          title: document.title,
          text: document.text,
          createdAt: document.updatedAt,
          createdBy: document.createdBy,
        })
      );
    }

    return revisions;
  }

  @action
  fetch = async (
    documentId: string,
    options?: FetchOptions
  ): Promise<?Revision> => {
    this.isFetching = true;
    const id = options && options.revisionId;
    if (!id) throw new Error('revisionId is required');

    try {
      const rev = this.data.get(id);
      if (rev) return rev;

      const res = await client.post('/documents.revision', {
        id: documentId,
        revisionId: id,
      });
      invariant(res && res.data, 'Revision not available');
      this.add(res.data);

      runInAction('RevisionsStore#fetch', () => {
        this.isLoaded = true;
      });

      return this.data.get(res.data.id);
    } finally {
      this.isFetching = false;
    }
  };

  @action
  fetchPage = async (options: ?PaginationParams): Promise<*> => {
    this.isFetching = true;

    try {
      const res = await client.post('/documents.revisions', options);
      invariant(res && res.data, 'Document revisions not available');
      runInAction('RevisionsStore#fetchPage', () => {
        res.data.forEach(revision => this.add(revision));
        this.isLoaded = true;
      });
      return res.data;
    } finally {
      this.isFetching = false;
    }
  };
}
