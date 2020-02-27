import React, { FunctionComponent } from 'react';
import { MessageValue, ProtoCtx } from '../../../../models/http/body/protobuf';
import { Radio, Select } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import MessageValueView, { dispatchingHandler } from '../../body/MessageValueView';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { selectRequestMessageName, selectResponseMessageName, selectBodyType } from './BodyInputActions';
import { RequestBody, BodyType } from '../../../../models/http/request_builder';

type Props = {
  bodyType: BodyType;
  bodies: RequestBody;
  protoCtx: ProtoCtx;
  messageNames: ReadonlyArray<string>;
  responseMessageName: string | undefined;
};

const BodyWrapper = styled('div')`
  display: block;
  margin-top: 8px;
`;

const BodyInput: FunctionComponent<Props> = ({ bodyType, bodies, protoCtx, messageNames, responseMessageName }) => {
  const dispatch = useDispatch();

  function onRadioChange(e: RadioChangeEvent): void {
    dispatch(selectBodyType(e.target.value));
  }

  function onSelectRequestMsg(msgName: string): void {
    dispatch(selectRequestMessageName(msgName));
  }

  function onSelectResponseMsg(msgName: string): void {
    dispatch(selectResponseMessageName(msgName));
  }

  const handlers = dispatchingHandler(dispatch, protoCtx);

  function renderBody(): React.ReactNode {
    return bodyType === 'none' ? (
      <div />
    ) : bodyType === 'protobuf' ? (
      <>
        <div style={{ marginBottom: 8 }}>
          <span>Request Message: </span>
          <Select
            value={bodies.protobuf && bodies.protobuf.type.name}
            onChange={onSelectRequestMsg}
            size="small"
            style={{ width: 230 }}
          >
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
        {bodies.protobuf ? <MessageValueView value={bodies.protobuf} handlers={handlers} editable /> : null}
      </>
    ) : null;
  }

  return (
    <div>
      <Radio.Group defaultValue="none" value={bodyType} onChange={onRadioChange}>
        <Radio value="none">None</Radio>
        <Radio value="protobuf">Protobuf</Radio>
      </Radio.Group>
      <BodyWrapper>{renderBody()}</BodyWrapper>
    </div>
  );
};

export default BodyInput;
