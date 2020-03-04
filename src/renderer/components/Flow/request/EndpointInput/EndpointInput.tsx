import React from 'react';
import { Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { changeURL, changeMethod } from './EndpointInputActions';
import { HTTP_METHODS, HttpMethod } from '../../../../../core/http_client/request';

type Props = {
  method: HttpMethod;
  url: string;
  onSend: () => void;
};

const EndpointInput: React.FunctionComponent<Props> = ({ method, url, onSend }) => {
  const dispatch = useDispatch();

  function handleURLChange(url: string): void {
    dispatch(changeURL(url));
  }

  function handleMethodChange(method: HttpMethod): void {
    dispatch(changeMethod(method));
  }

  const HttpMethodPicker = (
    <Select value={method} style={{ width: 100 }} onChange={handleMethodChange}>
      {HTTP_METHODS.map(methodName => (
        <Select.Option key={methodName}>{methodName}</Select.Option>
      ))}
    </Select>
  );

  return (
    <Input
      addonBefore={HttpMethodPicker}
      value={url}
      placeholder="http://localhost:8000/api/hello"
      onChange={(e): void => handleURLChange(e.target.value)}
      onPressEnter={onSend}
    />
  );
};

export default EndpointInput;
