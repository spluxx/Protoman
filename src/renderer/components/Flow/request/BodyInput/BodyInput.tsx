import React, { ChangeEvent, FunctionComponent } from 'react';
import { Radio, Select } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { createMessageRecurse } from '../../../../../core/protobuf/serializer';
import MessageValueView, { dispatchingHandler } from '../../body/MessageValueView';
import JSONEditor, { dispatchingJsonHandler } from '../../body/JSONEditor';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { selectRequestMessageName, selectBodyType } from './BodyInputActions';
import { BodyType, RequestBody } from '../../../../models/request_builder';
import { ProtobufValue, ProtoCtx } from '../../../../../core/protobuf/protobuf';
import { converter } from 'protobufjs';
import toObject = converter.toObject;

type Props = {
  bodyType: BodyType;
  bodies: RequestBody;
  protoCtx: ProtoCtx;
  messageNames: ReadonlyArray<string>;
};

const BodyWrapper = styled('div')`
  display: block;
  margin-top: 8px;
`;

export const MESSAGE_NAME_WIDTH = 500;

const BodyInput: FunctionComponent<Props> = ({ bodyType, bodies: { protobuf }, protoCtx, messageNames }) => {
  const dispatch = useDispatch();

  function onRadioChange(e: RadioChangeEvent): void {
    dispatch(selectBodyType(e.target.value));
  }

  function onSelectRequestMsg(msgName: string): void {
    dispatch(selectRequestMessageName(msgName));
  }

  function handleJSONChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    dispatch(selectRequestMessageName(e.target.value));
  }

  const handlers = dispatchingHandler(dispatch, protoCtx);
  const jsonHandlers = dispatchingJsonHandler(dispatch, protoCtx);
  const json = protobuf ? JSON.parse(JSON.stringify(createMessageRecurse(protobuf as ProtobufValue))) : {};
  function renderBody(): React.ReactNode {
    return bodyType === 'none' ? (
      <div />
    ) : bodyType === 'protobuf' ? (
      <>
        <div style={{ marginBottom: 8 }}>
          <span>Request Message: </span>
          <Select
            value={protobuf && protobuf.type.name}
            onChange={onSelectRequestMsg}
            size="small"
            style={{ width: MESSAGE_NAME_WIDTH }}
            showSearch
            filterOption={(input, option): boolean => {
              return option && option.value.toString().includes(input.toString());
            }}
          >
            {messageNames.map((messageName, idx) => (
              <Select.Option key={idx} value={messageName}>
                {messageName}
              </Select.Option>
            ))}
          </Select>
        </div>
        {protobuf ? <JSONEditor value={json} type={protobuf.type} handlers={jsonHandlers} editable /> : null}
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
