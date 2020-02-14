import React from 'react';
import { Tabs, Row, Col } from 'antd';
import styled from 'styled-components';
import BodyView from './BodyView';
import HeaderView from '../shared/HeaderView';

const { TabPane } = Tabs;

const ResponseWrapper = styled('div')`
  padding: 16px;
  background-color: white;
  border-radius: 5px;
`;

const TitleWrapper = styled(Row)`
  width: 100%;
`;

const LeftyCol = styled(Col)`
  text-align: left;
  font-size: 12pt;
`;

const RightyCol = styled(Col)`
  text-align: right;
  font-size: 10pt;
`;

const PaddedTabPane = styled(TabPane)`
  padding: 4px;
`;

const StatusText: React.FunctionComponent<{}> = ({}) => {
  return (
    <span>
      Status: <span style={{ color: 'green' }}>200 OK</span>
    </span>
  );
};

const ResponseView: React.FunctionComponent<{}> = ({}) => {
  return (
    <ResponseWrapper>
      <TitleWrapper type="flex" align="bottom">
        <LeftyCol span={6}>Response</LeftyCol>
        <RightyCol span={18}>
          <StatusText />
        </RightyCol>
      </TitleWrapper>
      <Tabs defaultActiveKey="header" animated={false}>
        <PaddedTabPane tab="Headers" key="header">
          <HeaderView />
        </PaddedTabPane>
        <PaddedTabPane tab="Body" key="body">
          <BodyView contentType="" />
        </PaddedTabPane>
      </Tabs>
    </ResponseWrapper>
  );
};

export default ResponseView;
