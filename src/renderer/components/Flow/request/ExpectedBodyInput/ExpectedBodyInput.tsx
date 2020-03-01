import React from 'react';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { selectResponseMessageName } from './ExpectedBodyInputActions';
import { MESSAGE_NAME_WIDTH } from '../BodyInput/BodyInput';

type Props = {
  messageNames: ReadonlyArray<string>;
  responseMessageName: string | undefined;
};

const ExpectedBodyInput: React.FunctionComponent<Props> = ({ messageNames, responseMessageName }) => {
  const dispatch = useDispatch();

  function onSelectResponseMsg(msgName: string): void {
    dispatch(selectResponseMessageName(msgName));
  }

  return (
    <div>
      <span style={{ marginRight: 4 }}>Expected protobuf message: </span>
      <Select
        value={responseMessageName}
        onChange={onSelectResponseMsg}
        size="small"
        style={{ width: MESSAGE_NAME_WIDTH }}
        allowClear
        showSearch
        filterOption={(input, option): boolean => {
          return (option.props.children as string).includes(input);
        }}
      >
        {messageNames.map(messageName => (
          <Select.Option key={messageName}>{messageName}</Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default ExpectedBodyInput;
