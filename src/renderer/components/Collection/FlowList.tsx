import React from 'react';
import { List, Typography, Button, message, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { prevent, getByKey } from '../../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../models/AppState';
import { selectFlow, deleteFlow, reorderFlow } from './CollectionActions';
import { DragDropContext, DropResult, Draggable, Droppable } from 'react-beautiful-dnd';

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
  onSelectFlow: Function;
};

const FlowList: React.FunctionComponent<Props> = ({ collectionName, onSelectFlow }) => {
  const dispatch = useDispatch();

  const collections = useSelector((s: AppState) => s.collections);
  const flowNames = useSelector((s: AppState) => getByKey(s.collections, collectionName)?.flows?.map(([n]) => n));
  const isCurrentCollection = useSelector((s: AppState) => s.currentCollection === collectionName);
  const currentFlow = useSelector((s: AppState) => s.currentFlow);

  function handleSelection(flowName: string): void {
    onSelectFlow();
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
};

const FlowCell: React.FC<CellProps> = ({ flowName, emphasize, handleSelection, handleDelete, idx }) => {
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
        <DeleteOutlined />
        Delete Request
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
