import React, { useState } from 'react';
import styled from 'styled-components';
import CollectionSider from './Collection/CollectionSider';
import { Layout, Tabs } from 'antd';
import FlowView from './Flow/FlowView/FlowView';
import ToolBar from './toolbar/ToolBar';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../models/AppState';
import { buildProtofiles } from './Collection/protofile/ProtofileManagerActions';
import { openFM } from './Collection/CollectionActions';
import CacheSider from './cache/CacheSider';
import { TabsProps } from 'antd/lib/tabs';
import CacheToolBar from './cache/ToolBar';
import CacheView from './cache/CacheView';

const { TabPane } = Tabs;
const Sider = styled(Layout.Sider)`
  background: #fff;
  box-shadow: 1px 0 3px -0px #aaa;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const TopLayout = styled(Layout)`
  width: 100%;
  height: 100%;
`;
const tabHeader = {
  backgroundColor: '#fff',
  color: 'rgba(0, 0, 0, 0.85)',
  fontWeight: 500,
  fontSize: 14,
  margin: 0,
  boxShadow: '1px 0 3px -0px #aaa',
  width: '100%',
  flex: '0 0 auto',
  padding: '16px 8px 8px 8px',
};
const ContentLayout = styled(Layout)`
  height: 100%;
  padding: 16px;
`;
const tabListStyle = {
  height: '100vh',
  backgroundColor: '#fff',
};
const App: React.FunctionComponent<{}> = ({}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('request');
  const collections = useSelector(
    (s: AppState) => s.collections,
    () => true, // it's only used for initial rebuild
  );

  React.useEffect(() => {
    collections.forEach(([name, col]) => {
      dispatch(buildProtofiles(name, col.protoFilepaths as string[], col.protoRootPath, () => dispatch(openFM(name))));
    });
  }, []);
  function selectTab(selected: string) {
    setActiveTab(selected);
  }
  const renderTabBar = (props: TabsProps, TabBar: React.ComponentClass<any>) => (
    <TabBar {...props}>
      {(node: JSX.Element) =>
        node.key === 'request' ? (
          <CollectionSider key={node.key} style={tabHeader} onClickOnTab={() => selectTab('request')} />
        ) : node.key === 'cache' ? (
          <CacheSider key={node.key} style={tabHeader} onClickOnTab={() => selectTab('cache')} />
        ) : null
      }
    </TabBar>
  );
  return (
    <TopLayout>
      <Tabs
        defaultActiveKey="request"
        tabPosition={'left'}
        renderTabBar={renderTabBar}
        activeKey={activeTab}
        style={tabListStyle}
      >
        <TabPane tab="Requests" key="request">
          <ContentLayout>
            <ToolBar />
            <FlowView />
          </ContentLayout>
        </TabPane>
        <TabPane tab="Caches" key="cache">
          <ContentLayout>
            <CacheToolBar />
            <CacheView />
          </ContentLayout>
        </TabPane>
      </Tabs>
    </TopLayout>
  );
};

export default App;
