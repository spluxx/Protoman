import React from 'react';
import { Input, Select } from 'antd';
import { HTTP_METHODS, HttpMethod } from '../../../models/http/request_builder';

type Props = {
  method: HttpMethod;
  url: string;
};

const EndpointInput: React.FunctionComponent<Props> = ({ method, url }) => {
  const HttpMethodPicker = (
    <Select value={method} style={{ width: 100 }}>
      {HTTP_METHODS.map(methodName => (
        <Select.Option key={methodName}>{methodName}</Select.Option>
      ))}
    </Select>
  );

  return <Input addonBefore={HttpMethodPicker} value={url} placeholder="http://localhost:8000/api/hello" />;
};

export default EndpointInput;
