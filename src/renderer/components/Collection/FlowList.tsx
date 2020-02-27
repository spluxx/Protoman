import React from 'react';
import { List, Typography, Button, Icon, message } from 'antd';
import styled from 'styled-components';
import { prevent, getByKey } from '../../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../models/AppState';
import { selectFlow, createFlow, deleteFlow } from './CollectionActions';

const ClickableItem = styled(List.Item)`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  &:hover {
    cursor: pointer;
    background-color: #f7fcff;
  }
`;

const Footer = styled('div')`
  width: 100%;
  display: flex;
  justify-content: center;
`;

type Props = {
  collectionName: string;
};

const FlowList: React.FunctionComponent<Props> = ({ collectionName }) => {
  const dispatch = useDispatch();

  const collections = useSelector((s: AppState) => s.collections);
  const flowNames = useSelector((s: AppState) => getByKey(s.collections, collectionName)?.flows?.map(([n]) => n));
  const isCurrentCollection = useSelector((s: AppState) => s.currentCollection === collectionName);
  const currentFlow = useSelector((s: AppState) => s.currentFlow);

  function validateFlowName(flowName: string): boolean {
    return !getByKey(collections, collectionName)
      ?.flows?.map(([n]) => n)
      ?.includes(flowName);
  }

  function handleSelection(flowName: string): void {
    dispatch(selectFlow(collectionName, flowName));
  }

  function handleCreate(): void {
    const tmpName = 'flow';
    let tmpNameIdx = 1;
    while (!validateFlowName(`${tmpName}${tmpNameIdx}`)) tmpNameIdx++;
    dispatch(createFlow(collectionName, `${tmpName}${tmpNameIdx}`));
  }

  function handleDelete(flowName: string): void {
    const flowCount = getByKey(collections, collectionName)?.flows?.length || 0;
    if (flowCount > 1) {
      dispatch(deleteFlow(collectionName, flowName));
    } else {
      message.error("Can't delete the last flow");
    }
  }

  const footer = (
    <Footer>
      <Button type="primary" ghost onClick={handleCreate}>
        <Icon type="plus" />
        New Flow
      </Button>
    </Footer>
  );

  return (
    <List
      footer={footer}
      dataSource={flowNames}
      renderItem={(flowName): React.ReactNode => (
        <ClickableItem onClick={(): void => handleSelection(flowName)}>
          <Typography.Text strong={isCurrentCollection && currentFlow === flowName}>{flowName}</Typography.Text>
          <div>
            <Button
              ghost
              shape="circle"
              type="danger"
              size="small"
              onClick={prevent((): void => handleDelete(flowName))}
              style={{ marginLeft: 4 }}
            >
              <Icon type="delete" />
            </Button>
          </div>
        </ClickableItem>
      )}
    />
  );
};

export default FlowList;
