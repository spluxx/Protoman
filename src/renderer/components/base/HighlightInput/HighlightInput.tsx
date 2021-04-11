import React from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { useSelector } from 'react-redux';
import { selectCurrentEnv } from '../../../redux/store';
import styled from 'styled-components';
import { colorIntervals, materializeSpans } from './HighlightInputHelpers';
import produce from 'immer';
import { toVarMap } from '../../../models/Env';

const Wrapper = styled('div')`
  display: inline-flex;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const InputWrapper = styled('div')`
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const FakeInputWrapper = styled('div')`
  position: absolute;
`;

const FakeInput = styled('div')`
  overflow: scroll;
  white-space: nowrap;
  border: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ModInput = styled(Input)`
  background: transparent;
  -webkit-text-fill-color: transparent;
  > span {
    -webkit-text-fill-color: gray;
  }
  ::selection {
    background: rgba(24, 144, 255, 0.2);
  }
`;

const small = {
  padding: '1px 8px',
  top: 0,
};

const medium = {
  padding: '1px 12px',
  top: 4,
};

// at the moment, only for medium
const AddonBeforeWrapper = styled('div')`
  margin-right: 4px;
`;

// at the moment, only for small, with span inside.
const AddonAfterWrapper = styled('div')`
  display: inline-block;
  margin-left: 4px;
  padding: 1px 4px;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 4px;
`;

const INSERTION_POINT_CHANGING_EVENTS = [
  'input',
  'keydown',
  'keyup',
  'focus',
  'blur',
  'click',
  'change',
  'paste',
  'cut',
  'scroll',
  'wheel',
  'dragover',
];

const ColoringInput: React.FunctionComponent<InputProps> = props => {
  const env = useSelector(selectCurrentEnv);
  const varMap = React.useMemo(() => {
    return env ? toVarMap(env) : {};
  }, [env]);

  const { value, placeholder, addonBefore, addonAfter, size } = props;
  const newProps = produce(props, draft => {
    delete draft.addonBefore;
    delete draft.addonAfter;
    delete draft.placeholder;
    if (draft.style) {
      delete draft.style.width;
    }
  });
  const width = props.style?.width;
  const offsets = size === 'small' ? small : medium;

  const ph = <span style={{ color: '#a9a9a9' }}>{placeholder}</span>;

  const [clientWidth, setClientWidth] = React.useState(0);
  const inputRef = React.useRef<Input>(null);
  const fakeInputRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (inputRef.current && fakeInputRef.current) {
      const input = inputRef.current.input;
      const fakeInput = fakeInputRef.current;

      setClientWidth(input.clientWidth);

      const syncScroll = (): void => {
        fakeInput.scrollTo(input.scrollLeft, 0);
      };

      INSERTION_POINT_CHANGING_EVENTS.forEach(type => {
        input.addEventListener(type, syncScroll);
      });

      return (): void => {
        INSERTION_POINT_CHANGING_EVENTS.forEach(type => {
          inputRef.current?.input?.removeEventListener(type, syncScroll);
        });
      };
    }
  }, [inputRef.current, fakeInputRef.current]);

  const str = (value || '').toString();
  const coloredInputStr = materializeSpans(str, colorIntervals(str, varMap));

  return (
    <Wrapper style={{ width }}>
      {addonBefore ? <AddonBeforeWrapper>{addonBefore}</AddonBeforeWrapper> : null}
      <InputWrapper>
        <FakeInputWrapper style={{ ...offsets, width: '100%' }}>
          <FakeInput ref={fakeInputRef}>{value ? coloredInputStr : ph}</FakeInput>
        </FakeInputWrapper>
        <ModInput ref={inputRef} {...newProps} />
      </InputWrapper>
      {addonAfter ? <AddonAfterWrapper>{addonAfter}</AddonAfterWrapper> : null}
    </Wrapper>
  );
};

type Props = InputProps & { colored?: boolean };

const HighlightInput: React.FunctionComponent<Props> = props => {
  const p = { ...props, colored: undefined };
  return props.colored ? <ColoringInput {...p} /> : <Input {...p} />;
};

export default HighlightInput;
