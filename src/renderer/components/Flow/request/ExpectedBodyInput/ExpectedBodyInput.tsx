import React from 'react';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { selectResponseMessageName, selectResponseMessageOnErrorName } from './ExpectedBodyInputActions';
import { MESSAGE_NAME_WIDTH } from '../BodyInput/BodyInput';

type Props = {
  messageNames: ReadonlyArray<string>;
  expectedProtobufMsg: string | undefined;
  expectedProtobufMsgOnError: string | undefined;
};

const LABEL_STYLE = { display: 'inline-block', width: 100 };

const ExpectedBodyInput: React.FunctionComponent<Props> = ({
  messageNames,
  expectedProtobufMsg,
  expectedProtobufMsgOnError,
}) => {
  const dispatch = useDispatch();

  function onSelectResponseMsg(msgName: string): void {
    dispatch(selectResponseMessageName(msgName));
  }

  function onSelectResponseMsgOnError(msgName: string): void {
    dispatch(selectResponseMessageOnErrorName(msgName));
  }

  return (
    <div>
      <span style={LABEL_STYLE}>On [200, 300):</span>
      <Select
        value={expectedProtobufMsg}
        onChange={onSelectResponseMsg}
        size="small"
        style={{ width: MESSAGE_NAME_WIDTH }}
        allowClear
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

      <div style={{ height: 8 }} />

      <span style={LABEL_STYLE}>On [300, ∞):</span>
      <Select
        value={expectedProtobufMsgOnError}
        onChange={onSelectResponseMsgOnError}
        size="small"
        style={{ width: MESSAGE_NAME_WIDTH }}
        allowClear
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
  );
};

export default ExpectedBodyInput;
