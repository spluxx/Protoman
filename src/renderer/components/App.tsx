import React from 'react';
import styled from 'styled-components';
import 'antd/dist/antd.css';
import CollectionSider from './collection/CollectionSider';
import { Layout } from 'antd';
import FlowView from './flow/FlowView/FlowView';
import ToolBar from './toolbar/ToolBar';

const TopLayout = styled(Layout)`
  width: 100%;
  height: 100%;
`;

const ContentLayout = styled(Layout)`
  height: 100%;
  padding: 16px;
`;

const App: React.FunctionComponent<{}> = ({}) => {
  return (
    <TopLayout>
      <CollectionSider />
      <ContentLayout>
        <ToolBar />
        <FlowView />
      </ContentLayout>
    </TopLayout>
  );
};

export default App;
