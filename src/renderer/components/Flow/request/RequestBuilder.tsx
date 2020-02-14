import React from 'react';
import EndpointInput from './EndpointInput';
import { Tabs, Button } from 'antd';
import HeaderView from '../shared/HeaderView';
import BodyInput from './BodyInput';
import styled from 'styled-components';

const { TabPane } = Tabs;

const BuilderWrapper = styled('div')`
  padding: 16px;
  background-color: white;
  border-radius: 5px;
`;

const TopBarWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const LeftMarginButton = styled(Button)`
  margin-left: 8px;
`;

const PaddedTabPane = styled(TabPane)`
  padding: 4px;
`;

const RequestBuilder: React.FunctionComponent<{}> = ({}) => {
  return (
    <BuilderWrapper>
      <TopBarWrapper>
        <EndpointInput />
        <LeftMarginButton>Send</LeftMarginButton>
      </TopBarWrapper>
      <Tabs defaultActiveKey="header" animated={false}>
        <PaddedTabPane tab="Headers" key="header">
          <HeaderView editable />
        </PaddedTabPane>
        <PaddedTabPane tab="Body" key="body">
          <BodyInput />
        </PaddedTabPane>
      </Tabs>
    </BuilderWrapper>
  );
};

export default RequestBuilder;
