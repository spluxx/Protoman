import React, { FunctionComponent } from 'react';
import { MessageValue, ProtoCtx } from '../../../../models/http/body/protobuf';
import { Radio, Select } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import MessageValueView, { dispatchingHandler } from '../../body/MessageValueView';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../models/AppState';
import { selectMessageName } from './BodyInputActions';

type Props = {
  body: MessageValue | undefined;
  protoCtx: ProtoCtx;
  messageNames: ReadonlyArray<string>;
};

const BodyWrapper = styled('div')`
  display: block;
  margin-top: 8px;
`;

const BodyInput: FunctionComponent<Props> = ({ body, protoCtx, messageNames }) => {
  const [radioValue, setRadioValue] = React.useState('none');

  const dispatch = useDispatch();

  function onRadioChange(e: RadioChangeEvent): void {
    setRadioValue(e.target.value);
  }

  function onSelectChange(msgName: string): void {
    dispatch(selectMessageName(msgName));
  }

  const handlers = dispatchingHandler(dispatch, protoCtx);

  return (
    <div>
      <Radio.Group defaultValue="none" value={radioValue} onChange={onRadioChange}>
        <Radio value="none">None</Radio>
        <Radio value="protobuf">Protobuf</Radio>
      </Radio.Group>
      <BodyWrapper hidden={radioValue === 'none'}>
        <div>
          <span>Message: </span>
          <Select value={body && body.type.name} onSelect={onSelectChange} size="small" style={{ width: 200 }}>
            {messageNames.map(messageName => (
              <Select.Option key={messageName}>{messageName}</Select.Option>
            ))}
          </Select>
        </div>
        {body ? <MessageValueView value={body} handlers={handlers} editable /> : undefined}
      </BodyWrapper>
    </div>
  );
};

export default BodyInput;
