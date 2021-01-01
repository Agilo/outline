// @flow
import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import styled from 'styled-components';
import VisuallyHidden from 'components/VisuallyHidden';
import Flex from 'shared/components/Flex';

const RealTextarea = styled.textarea`
  border: 0;
  flex: 1;
  padding: 8px 12px 8px ${props => (props.hasIcon ? '8px' : '12px')};
  outline: none;
  background: none;
  color: ${props => props.theme.text};

  &:disabled,
  &::placeholder {
    color: ${props => props.theme.placeholder};
  }
`;

const RealInput = styled.input`
  border: 0;
  flex: 1;
  padding: 8px 12px 8px ${props => (props.hasIcon ? '8px' : '12px')};
  outline: none;
  background: none;
  color: ${props => props.theme.text};
  height: 30px;

  &:disabled,
  &::placeholder {
    color: ${props => props.theme.placeholder};
  }
`;

const Wrapper = styled.div`
  flex: ${props => (props.flex ? '1' : '0')};
  max-width: ${props => (props.short ? '350px' : '100%')};
  min-height: ${({ minHeight }) => (minHeight ? `${minHeight}px` : '0')};
  max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : 'initial')};
`;

const IconWrapper = styled.span`
  position: relative;
  left: 4px;
  width: 24px;
  height: 24px;
`;

export const Outline = styled(Flex)`
  display: flex;
  flex: 1;
  margin: ${props => (props.margin !== undefined ? props.margin : '0 0 16px')};
  color: inherit;
  border-width: 1px;
  border-style: solid;
  border-color: ${props =>
    props.hasError
      ? 'red'
      : props.focused
        ? props.theme.inputBorderFocused
        : props.theme.inputBorder};
  border-radius: 4px;
  font-weight: normal;
  align-items: center;
  overflow: hidden;
`;

export const LabelText = styled.div`
  font-weight: 500;
  padding-bottom: 4px;
`;

export type Props = {
  type?: string,
  value?: string,
  label?: string,
  className?: string,
  labelHidden?: boolean,
  flex?: boolean,
  short?: boolean,
  margin?: string | number,
  icon?: React.Node,
  onFocus?: (ev: SyntheticEvent<>) => void,
  onBlur?: (ev: SyntheticEvent<>) => void,
};

@observer
class Input extends React.Component<Props> {
  input: ?HTMLInputElement;
  @observable focused: boolean = false;

  handleBlur = (ev: SyntheticEvent<>) => {
    this.focused = false;
    if (this.props.onBlur) {
      this.props.onBlur(ev);
    }
  };

  handleFocus = (ev: SyntheticEvent<>) => {
    this.focused = true;
    if (this.props.onFocus) {
      this.props.onFocus(ev);
    }
  };

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const {
      type = 'text',
      icon,
      label,
      margin,
      className,
      short,
      flex,
      labelHidden,
      onFocus,
      onBlur,
      ...rest
    } = this.props;

    const InputComponent = type === 'textarea' ? RealTextarea : RealInput;
    const wrappedLabel = <LabelText>{label}</LabelText>;

    return (
      <Wrapper className={className} short={short} flex={flex}>
        <label>
          {label &&
            (labelHidden ? (
              <VisuallyHidden>{wrappedLabel}</VisuallyHidden>
            ) : (
              wrappedLabel
            ))}
          <Outline focused={this.focused} margin={margin}>
            {icon && <IconWrapper>{icon}</IconWrapper>}
            <InputComponent
              ref={ref => (this.input = ref)}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              type={type === 'textarea' ? undefined : type}
              hasIcon={!!icon}
              {...rest}
            />
          </Outline>
        </label>
      </Wrapper>
    );
  }
}

export default Input;
