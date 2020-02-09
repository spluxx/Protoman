import React from 'react';
import styled from 'styled-components';
import 'antd/dist/antd.css';
import CollectionSider from './Collection/CollectionSider';
import { Layout } from 'antd';
import FlowView from './Flow/FlowView';

const TopLayout = styled(Layout)`
  width: 100%;
  height: 100%;
`;

const ContentLayout = styled(Layout)`
  padding: 0 24px 24px;
  height: 100%;
`;

const App: React.FunctionComponent<{}> = ({}) => {
  return (
    <TopLayout>
      <CollectionSider />
      <ContentLayout>
        <Layout.Content>
          <FlowView />
        </Layout.Content>
      </ContentLayout>
    </TopLayout>
  );
};

export default App;
