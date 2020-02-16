import React, { FunctionComponent } from 'react';
import { MessageValue, ProtoCtx } from '../../../models/http/body/protobuf';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import MessageValueView, { dispatchingHandler } from '../body/MessageValueView';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

type Props = {
  body: MessageValue | undefined;
  protoCtx: ProtoCtx;
};

const BodyWrapper = styled('div')`
  display: block;
  margin-top: 8px;
`;

const BodyInput: FunctionComponent<Props> = ({ body, protoCtx }) => {
  const [radioValue, setRadioValue] = React.useState('none');
  const dispatch = useDispatch();

  function onRadioChange(e: RadioChangeEvent): void {
    setRadioValue(e.target.value);
  }

  const handlers = dispatchingHandler(dispatch, protoCtx);

  return (
    <div>
      <Radio.Group defaultValue="none" value={radioValue} onChange={onRadioChange}>
        <Radio value="none">None</Radio>
        <Radio value="protobuf">Protobuf</Radio>
      </Radio.Group>
      <BodyWrapper hidden={radioValue !== 'protobuf'}>
        {body ? <MessageValueView value={body} handlers={handlers} editable /> : undefined}
      </BodyWrapper>
    </div>
  );
};

export default BodyInput;
