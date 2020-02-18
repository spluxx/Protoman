import React from 'react';
import { Layout, message, Collapse } from 'antd';
import styled from 'styled-components';
import CollectionCell from './CollectionCell';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../models/AppState';
import NewCollectionCell from './NewCollectionCell';
import {
  createCollection,
  deleteCollection,
  changeCollectionName,
  toggleCollections,
  selectFlow,
  deleteFlow,
  createFlow,
} from './CollectionActions';
import GhostCollectionCell from './GhostCollectionCell';
import FlowList from './FlowList';
import { getByKey } from '../../utils/utils';

const { Panel } = Collapse;

const Sider = styled(Layout.Sider)`
  background: #fff;
  box-shadow: 1px 0 3px -0px #aaa;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
`;

const Header = styled('div')`
  text-align: center;
  width: 100%;
  flex: 0 0 auto;
  padding: 16px 0px;
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

export const COLLECTION_SIDER_WIDTH = 200;

const MAX_NAME_LENGTH = 36;

const CollectionSider: React.FunctionComponent<{}> = ({}) => {
  const dispatch = useDispatch();

  const collections = useSelector((s: AppState) => s.collections);
  const openCollections = useSelector((s: AppState) => s.openCollections);
  const currentCollection = useSelector((s: AppState) => s.currentCollection);
  const currentFlow = useSelector((s: AppState) => s.currentFlow);

  const [collapsed, setCollapsed] = React.useState(false);

  const [isCreatingCol, setIsCreatingCol] = React.useState(false);
  const showGhostCol = (): void => setIsCreatingCol(true);
  const hideGhostCol = (): void => setIsCreatingCol(false);

  function validateNewName(name: string): boolean {
    return MAX_NAME_LENGTH > name.length && name.length > 0 && !collections.map(([n]) => n).includes(name);
  }

  function validateName(newName: string, currentName: string): boolean {
    return currentName === newName || validateNewName(newName);
  }

  function validateFlowName(collectionName: string, flowName: string): boolean {
    return !getByKey(collections, collectionName)
      ?.flows?.map(([n]) => n)
      ?.includes(flowName);
  }

  function handleCreate(name: string): void {
    if (validateNewName(name)) {
      dispatch(createCollection(name));
      hideGhostCol();
    }
  }

  function handleDelete(name: string): void {
    if (collections.length > 1) {
      dispatch(deleteCollection(name));
    } else {
      message.error("Can't delete the last collection");
    }
  }

  function handleNameChange(newName: string, name: string): void {
    if (validateName(newName, name)) {
      dispatch(changeCollectionName(name, newName));
    }
  }

  function handleToggleOpen(openCollections: string[]): void {
    dispatch(toggleCollections(openCollections));
  }

  function handleSelection(collectionName: string, flowName: string): void {
    dispatch(selectFlow(collectionName, flowName));
  }

  function handleCreateFlow(collectionName: string): void {
    const tmpName = 'flow';
    let tmpNameIdx = 1;
    while (!validateFlowName(collectionName, `${tmpName}${tmpNameIdx}`)) tmpNameIdx++;
    dispatch(createFlow(collectionName, `${tmpName}${tmpNameIdx}`));
  }

  function handleDeleteFlow(collectionName: string, flowName: string): void {
    const flowCount = getByKey(collections, collectionName)?.flows?.length || 0;
    if (flowCount > 1) {
      dispatch(deleteFlow(collectionName, flowName));
    } else {
      message.error("Can't delete the last flow");
    }
  }

  return (
    <Sider
      width={COLLECTION_SIDER_WIDTH}
      // collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      collapsedWidth={30}
      theme="light"
    >
      <Wrapper hidden={collapsed}>
        <Header>
          <Title>Collections</Title>
        </Header>
        <LeanCollapse
          activeKey={[...openCollections]}
          expandIcon={(): React.ReactNode => <span />}
          onChange={(k): void => {
            if (typeof k === 'string') {
              handleToggleOpen([k]);
            } else {
              // array of keys
              handleToggleOpen(k);
            }
          }}
        >
          {collections.map(([name, col]) => {
            const header = (
              <CollectionCell
                name={name}
                collection={col}
                checkName={(newName): boolean => validateName(newName, name)}
                onChangeColName={(newName): void => handleNameChange(newName, name)}
                onDeleteCollection={(): void => handleDelete(name)}
              />
            );
            return (
              <Panel key={name} header={header}>
                <FlowList
                  isCurrentCollection={name === currentCollection}
                  currentFlow={currentFlow}
                  flowNames={col.flows.map(([n]) => n)}
                  onSelection={(flowName): void => handleSelection(name, flowName)}
                  onDelete={(flowName): void => handleDeleteFlow(name, flowName)}
                  onCreate={(): void => handleCreateFlow(name)}
                />
              </Panel>
            );
          })}
          {isCreatingCol ? (
            <GhostCollectionCell onCreate={handleCreate} onCancel={hideGhostCol} checkName={validateNewName} />
          ) : null}
          <NewCollectionCell onCreate={showGhostCol} />
        </LeanCollapse>
      </Wrapper>
    </Sider>
  );
};

export default CollectionSider;
