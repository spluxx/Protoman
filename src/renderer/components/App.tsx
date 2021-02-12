import React, { useState } from 'react';
import styled from 'styled-components';
import CollectionSider from './Collection/CollectionSider';
import { Layout, Tabs } from 'antd';
import FlowView from './Flow/FlowView/FlowView';
import ToolBar from './toolbar/ToolBar';
import CacheToolBar from './cache/ToolBar';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../models/AppState';
import { buildProtofiles } from './Collection/protofile/ProtofileManagerActions';
import { openFM } from './Collection/CollectionActions';
import CacheExplorerView from './cache/CacheExplorerView';
import CacheSider from './cache/CacheSider';
import { TabsProps } from 'antd/lib/tabs';
import NodeEnvPicker from './toolbar/NODE_ENV/NodeEnvPicker';

const { TabPane } = Tabs;

const TopLayout = styled(Layout)`
  width: 100%;
  height: 100%;
`;

const ContentLayout = styled(Layout)`
  height: 100%;
  padding: 16px;
  width: 80vw;
`;

const tabHeader = {
  backgroundColor: '#fff',
  color: 'rgba(0, 0, 0, 0.85)',
  fontWeight: 500,
  fontSize: 14,
  userSelect: 'none',
  margin: 0,
  boxShadow: '1px 0 3px -0px #aaa',
  textAlign: 'center',
  width: '100%',
  flex: '0 0 auto',
  padding: '16px 8px 8px 8px',
};

const App: React.FunctionComponent<{}> = ({}) => {
  const [activeTab, setActiveTab] = useState('request');
  const dispatch = useDispatch();
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
          <div key={node.key}>
            {React.cloneElement(node, {
              style: node.props.style ? { ...node.props.style, ...tabHeader } : tabHeader,
            })}
            <CollectionSider />
          </div>
        ) : node.key === 'cache' ? (
          <div key={node.key}>
            {React.cloneElement(node, {
              style: node.props.style ? { ...node.props.style, ...tabHeader } : tabHeader,
            })}
            <CacheSider onClickOnTab={() => selectTab('cache')} />
          </div>
        ) : null
      }
    </TabBar>
  );
  return (
    <TopLayout>
      <Tabs defaultActiveKey="request" tabPosition={'left'} renderTabBar={renderTabBar} activeKey={activeTab}>
        <TabPane tab="Requests" key="request">
          <ContentLayout>
            <ToolBar />
            <FlowView />
          </ContentLayout>
        </TabPane>
        <TabPane tab="Caches" key="cache">
          <ContentLayout>
            <CacheToolBar />
            <CacheExplorerView />
          </ContentLayout>
        </TabPane>
      </Tabs>
    </TopLayout>
  );
};

export default App;
