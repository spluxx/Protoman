import React from 'react';
import styled from 'styled-components';
import CollectionSider from './Collection/CollectionSider';
import { Layout } from 'antd';
import FlowView from './Flow/FlowView/FlowView';
import ToolBar from './toolbar/ToolBar';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../models/AppState';
import { buildProtofiles } from './Collection/protofile/ProtofileManagerActions';
import { openFM } from './Collection/CollectionActions';

const TopLayout = styled(Layout)`
  width: 100%;
  height: 100%;
`;

const ContentLayout = styled(Layout)`
  height: 100%;
  padding: 16px;
`;

const App: React.FunctionComponent<{}> = ({}) => {
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
