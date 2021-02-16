import React, { CSSProperties } from 'react';
import { Layout, Collapse, Modal, Button } from 'antd';
import styled from 'styled-components';
import CollectionCell from './CollectionCell';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../models/AppState';
import NewCollectionCell from './NewCollectionCell';
import { toggleCollections } from './CollectionActions';
import GhostCollectionCell from './GhostCollectionCell';
import FlowList from './FlowList';
import ProtofileManager from './protofile/ProtofileManager';
import { importCollection } from '../../bulk/trigger';

const { Panel } = Collapse;

const Sider = styled(Layout.Sider)`
  background: #fff;
  box-shadow: 1px 0 3px -0px #aaa;
  display: flex;
  flex-direction: column;
  height: 96vh;
`;

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
`;

const Header = styled('div')`
  text-align: center;
  width: 100%;
  flex: 0 0 auto;
  padding: 16px 8px 8px 8px;
`;

const Title = styled('h1')`
  user-select: none;
  margin: 0;
`;

const LeanCollapse = styled(Collapse)`
  flex: 1 1 auto;
  overflow: auto;
  height: 90%;
  border-radius: 0;
`;

const LinkButton = styled(Button)`
  padding: 0;
`;

export const COLLECTION_SIDER_WIDTH = 210;
type Props = {
  onClickOnTab: Function;
  style?: CSSProperties;
};

const CollectionSider: React.FunctionComponent<Props> = ({ onClickOnTab, style }) => {
  const dispatch = useDispatch();

  const collections = useSelector((s: AppState) => s.collections);
  const openCollections = useSelector((s: AppState) => s.openCollections);
  const fmOpenCollection = useSelector((s: AppState) => s.fmOpenCollection);

  const [isCreatingCol, setIsCreatingCol] = React.useState(false);
  const showGhostCol = (): void => setIsCreatingCol(true);
  const hideGhostCol = (): void => setIsCreatingCol(false);

  function handleToggleOpen(openCollections: string[]): void {
    dispatch(toggleCollections(openCollections));
  }

  function handleImport(): void {
    importCollection();
  }

  return (
    <Sider style={style}>
      <Wrapper>
        <Header>
          <Title>Collections</Title>
          <LinkButton type="link" onClick={handleImport}>
            Import
          </LinkButton>
        </Header>
        <LeanCollapse
          activeKey={[...openCollections]}
          expandIconPosition={'right'}
          onChange={(k): void => {
            if (typeof k === 'string') {
              handleToggleOpen([k]);
            } else {
              // array of keys
              handleToggleOpen(k);
            }
          }}
        >
          {collections.map(([name]) => {
            const header = <CollectionCell collectionName={name} />;
            return (
              <Panel key={name} header={header}>
                <FlowList onSelectFlow={onClickOnTab} collectionName={name} />
              </Panel>
            );
          })}
          {isCreatingCol ? <GhostCollectionCell onCancel={hideGhostCol} /> : null}
          <NewCollectionCell onCreate={showGhostCol} />
        </LeanCollapse>
      </Wrapper>

      <Modal visible={!!fmOpenCollection} footer={null} closable={false} destroyOnClose>
        {fmOpenCollection ? <ProtofileManager collectionName={fmOpenCollection} /> : null}
      </Modal>
    </Sider>
  );
};

export default CollectionSider;
