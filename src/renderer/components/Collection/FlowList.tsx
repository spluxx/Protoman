import React from 'react';
import { List, Typography, Button, message, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { prevent, getByKey } from '../../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../models/AppState';
import { selectFlow, deleteFlow } from './CollectionActions';

const ClickableItem = styled(List.Item)`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  &:hover {
    cursor: pointer;
    background-color: #f7fcff;
  }
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

  function handleSelection(flowName: string): void {
    dispatch(selectFlow(collectionName, flowName));
  }

  function handleDelete(flowName: string): void {
    const flowCount = getByKey(collections, collectionName)?.flows?.length || 0;
    if (flowCount > 1) {
      dispatch(deleteFlow(collectionName, flowName));
    } else {
      message.error("Can't delete the last request");
    }
  }

  return (
    <List
      dataSource={flowNames}
      renderItem={(flowName): React.ReactNode => (
        <FlowCell
          flowName={flowName}
          emphasize={isCurrentCollection && currentFlow === flowName}
          handleSelection={handleSelection}
          handleDelete={handleDelete}
        />
      )}
    />
  );
};

type CellProps = {
  flowName: string;
  emphasize: boolean;
  handleSelection: (name: string) => void;
  handleDelete: (name: string) => void;
};

const FlowCell: React.FC<CellProps> = ({ flowName, emphasize, handleSelection, handleDelete }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  function showMenu(): void {
    setMenuVisible(true);
  }

  function hideMenu(): void {
    setMenuVisible(false);
  }

  function deleteFlow(): void {
    handleDelete(flowName);
    hideMenu();
  }

  const menu = (
    <div>
      <Button type="link" danger onClick={prevent(deleteFlow)}>
        Delete Request
        <DeleteOutlined />
      </Button>
    </div>
  );

  return (
    <Popover
      placement="rightTop"
      content={menu}
      visible={menuVisible}
      trigger="contextMenu"
      onVisibleChange={setMenuVisible}
    >
      <ClickableItem onClick={(): void => handleSelection(flowName)} onContextMenu={prevent(showMenu)}>
        <Typography.Text
          strong={emphasize}
          style={{ userSelect: 'none', color: emphasize ? 'rgb(47, 93, 232)' : undefined }}
        >
          {flowName}
        </Typography.Text>
      </ClickableItem>
    </Popover>
  );
};

export default FlowList;
