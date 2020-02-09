import React from 'react';
import EndpointInput from './EndpointInput';
import { Tabs, Row, Col, Button, Icon } from 'antd';
import HeaderInput from './HeaderInput';
import BodyInput from './BodyInput';
import styled from 'styled-components';

const { TabPane } = Tabs;

const BuilderWrapper = styled('div')`
  padding: 16px;
  background-color: white;
`;

const TopBarWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const LeftMarginButton = styled(Button)`
  margin-left: 8px;
`;

const RequestBuilder: React.FunctionComponent<{}> = ({}) => {
  return (
    <BuilderWrapper>
      <TopBarWrapper>
        <EndpointInput />
        <LeftMarginButton size="large">Send</LeftMarginButton>
      </TopBarWrapper>
      <Tabs defaultActiveKey="header" animated={false}>
        <TabPane tab="Headers" key="header">
          <HeaderInput />
        </TabPane>
        <TabPane tab="Body" key="body">
          <BodyInput />
        </TabPane>
      </Tabs>
    </BuilderWrapper>
  );
};

export default RequestBuilder;
