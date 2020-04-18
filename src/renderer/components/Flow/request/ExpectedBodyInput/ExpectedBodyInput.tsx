import React from 'react';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { selectResponseMessageName } from './ExpectedBodyInputActions';
import { MESSAGE_NAME_WIDTH } from '../BodyInput/BodyInput';

type Props = {
  messageNames: ReadonlyArray<string>;
  expectedProtobufMsg: string | undefined;
};

const ExpectedBodyInput: React.FunctionComponent<Props> = ({ messageNames, expectedProtobufMsg }) => {
  const dispatch = useDispatch();

  function onSelectResponseMsg(msgName: string): void {
    dispatch(selectResponseMessageName(msgName));
  }

  return (
    <div>
      <span style={{ marginRight: 4 }}>Expected protobuf message: </span>
      <Select
        value={expectedProtobufMsg}
        onChange={onSelectResponseMsg}
        size="small"
        style={{ width: MESSAGE_NAME_WIDTH }}
        allowClear
        showSearch
        filterOption={(input, option): boolean => {
          return option && option.children.toString().includes(input.toString());
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
