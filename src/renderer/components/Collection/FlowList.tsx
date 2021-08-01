import React from 'react';
import { List, Typography, Button, message, Popover } from 'antd';
import { DeleteOutlined, SubnodeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { prevent, getByKey } from '../../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../models/AppState';
import { selectFlow, deleteFlow, reorderFlow, cloneFlow } from './CollectionActions';
import { DragDropContext, DropResult, Draggable, Droppable } from 'react-beautiful-dnd';
import { Separator } from './CollectionCell';

const ClickableItem = styled(List.Item)`
  display: flex;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
    background-color: #f7fcff;
  }
  padding: 0;
`;

type Props = {
  collectionName: string;
};

const FlowList: React.FunctionComponent<Props> = ({ collectionName }) => {
  const dispatch = useDispatch();

  const collection = useSelector((s: AppState) => getByKey(s.collections, collectionName));
  const flowNames = useSelector((s: AppState) => collection?.flows?.map(([n]) => n));
  const isCurrentCollection = useSelector((s: AppState) => s.currentCollection === collectionName);
  const currentFlow = useSelector((s: AppState) => s.currentFlow);

  function handleSelection(flowName: string): void {
    dispatch(selectFlow(collectionName, flowName));
  }

  function validateFlowName(flowName: string): boolean {
    return !collection?.flows?.map(([n]) => n)?.includes(flowName);
  }

  function handleDelete(flowName: string): void {
    const flowCount = collection?.flows?.length || 0;
    if (flowCount > 1) {
      dispatch(deleteFlow(collectionName, flowName));
    } else {
      message.error("Can't delete the last request");
    }
  }

  function handleClone(originalFlowName: string): void {
    //check if this clone already exists
    let tmpName = originalFlowName.concat("_clone");
    let tmpNameIdx = 1;
    while (!validateFlowName(`${tmpName}${tmpNameIdx}`)) tmpNameIdx++;
    dispatch(cloneFlow(collectionName, originalFlowName, `${tmpName}${tmpNameIdx}`));
  }

  function handleDragEnd(result: DropResult): void {
    console.log(result);
    if (!result.destination || result.source.droppableId != result.destination.droppableId) return;

    const src = result.source.index;
    const dst = result.destination.index;

    dispatch(reorderFlow(collectionName, src, dst));
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={collectionName}>
        {(provided): React.ReactElement => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <List
              dataSource={flowNames}
              rowKey={(name): string => name}
              renderItem={(flowName, idx): React.ReactNode => (
                <FlowCell
                  idx={idx}
                  flowName={flowName}
                  emphasize={isCurrentCollection && currentFlow === flowName}
                  handleSelection={handleSelection}
                  handleDelete={handleDelete}
                  handleClone={handleClone}
                />
              )}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

type CellProps = {
  flowName: string;
  emphasize: boolean;
  idx: number;
  handleSelection: (name: string) => void;
  handleDelete: (name: string) => void;
  handleClone: (name: string) => void;
};

const FlowCell: React.FC<CellProps> = ({ flowName, emphasize, handleSelection, handleDelete, handleClone, idx }) => {
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

  function cloneFlow(): void {
    handleClone(flowName);
    hideMenu();
  }

  const menu = (
    <>
      <Button type="link" danger onClick={prevent(deleteFlow)}>
        <DeleteOutlined />
        Delete Request
      </Button>
      <Separator />
      <Button type="link" onClick={prevent(cloneFlow)}>
        <SubnodeOutlined />
        Clone Request
      </Button>
    </>
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
        <Draggable draggableId={flowName} index={idx}>
          {(provided): React.ReactElement => {
            const style: React.CSSProperties = {
              width: '100%',
              height: '100%',
              padding: 8,
              boxSizing: 'border-box',
            };

            const { style: draggableStyle, ...draggableRest } = provided.draggableProps;

            return (
              <div
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                {...draggableRest}
                style={{ ...style, ...draggableStyle }}
              >
                <Typography.Text
                  strong={emphasize}
                  style={{ userSelect: 'none', color: emphasize ? 'rgb(47, 93, 232)' : undefined }}
                >
                  {flowName}
                </Typography.Text>
              </div>
            );
          }}
        </Draggable>
      </ClickableItem>
    </Popover>
  );
};

export default FlowList;
