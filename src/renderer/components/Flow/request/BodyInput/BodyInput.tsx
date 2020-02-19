import React, { FunctionComponent } from 'react';
import { MessageValue, ProtoCtx } from '../../../../models/http/body/protobuf';
import { Radio, Select } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import MessageValueView, { dispatchingHandler } from '../../body/MessageValueView';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { selectRequestMessageName, selectResponseMessageName } from './BodyInputActions';

type Props = {
  body: MessageValue | undefined;
  protoCtx: ProtoCtx;
  messageNames: ReadonlyArray<string>;
  responseMessageName: string | undefined;
};

const BodyWrapper = styled('div')`
  display: block;
  margin-top: 8px;
`;

const BodyInput: FunctionComponent<Props> = ({ body, protoCtx, messageNames, responseMessageName }) => {
  const [radioValue, setRadioValue] = React.useState(body ? 'protobuf' : 'none');
  React.useEffect(() => {
    setRadioValue(body ? 'protobuf' : 'none');
  }, [body]);

  const dispatch = useDispatch();

  function onRadioChange(e: RadioChangeEvent): void {
    setRadioValue(e.target.value);
  }

  function onSelectRequestMsg(msgName: string): void {
    dispatch(selectRequestMessageName(msgName));
  }

  function onSelectResponseMsg(msgName: string): void {
    dispatch(selectResponseMessageName(msgName));
  }

  const handlers = dispatchingHandler(dispatch, protoCtx);

  return (
    <div>
      <Radio.Group defaultValue="none" value={radioValue} onChange={onRadioChange}>
        <Radio value="none">None</Radio>
        <Radio value="protobuf">Protobuf</Radio>
      </Radio.Group>
      <BodyWrapper hidden={radioValue === 'none'}>
        <div style={{ marginBottom: 8 }}>
          <span>Request Message: </span>
          <Select value={body && body.type.name} onChange={onSelectRequestMsg} size="small" style={{ width: 230 }}>
            {messageNames.map(messageName => (
              <Select.Option key={messageName}>{messageName}</Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: 8 }}>
          <span>Response Message: </span>
          <Select
            value={responseMessageName}
            onChange={onSelectResponseMsg}
            size="small"
            style={{ width: 230 }}
            allowClear
          >
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
