import React from 'react';
import styled from 'styled-components';
import CollectionSider from './Collection/CollectionSider';
import { Layout, Tabs } from 'antd';
const { TabPane } = Tabs;
import FlowView from './Flow/FlowView/FlowView';
import ToolBar from './toolbar/ToolBar';
import CacheToolBar from './cache/ToolBar';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../models/AppState';
import { buildProtofiles } from './Collection/protofile/ProtofileManagerActions';
import { openFM } from './Collection/CollectionActions';
import CacheExplorerView from './cache/CacheExplorerView';
import { registerCacheAction } from './cache/CacheAction';
import CacheSider from './cache/CacheSider';
import { TabsProps } from 'antd/lib/tabs';

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
  const dispatch = useDispatch();
  const collections = useSelector(
    (s: AppState) => s.collections,
    () => true, // it's only used for initial rebuild
  );

  React.useEffect(() => {
    collections.forEach(([name, col]) => {
      dispatch(buildProtofiles(name, col.protoFilepaths as string[], col.protoRootPath, () => dispatch(openFM(name))));
      dispatch(registerCacheAction('Common'));
      dispatch(registerCacheAction('Supply'));
      dispatch(registerCacheAction('Demand'));
    });
  }, []);

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
            <CacheSider />
          </div>
        ) : null
      }
    </TabBar>
  );
  return (
    <TopLayout>
      <Tabs defaultActiveKey="request" tabPosition={'left'} renderTabBar={renderTabBar}>
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
