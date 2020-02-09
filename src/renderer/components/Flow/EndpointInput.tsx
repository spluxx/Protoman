import React from 'react';
import { Input, Select } from 'antd';
import { HTTP_METHODS } from '../../models/http/request_builder';
import styled from 'styled-components';

const HttpMethodPicker = (
  <Select defaultValue={HTTP_METHODS[0]} style={{ width: 100 }}>
    {HTTP_METHODS.map(methodName => (
      <Select.Option key={methodName}>{methodName}</Select.Option>
    ))}
  </Select>
);

const EndpointInput: React.FunctionComponent<{}> = ({}) => {
  return <Input size="large" addonBefore={HttpMethodPicker} />;
};

export default EndpointInput;
