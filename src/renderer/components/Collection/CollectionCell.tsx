import React from 'react';
import styled from 'styled-components';
import { validateCollectionName } from '../../models/Collection';
import { Input, Form, Button, message } from 'antd';
import { FilePptOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { prevent, getByKey } from '../../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../models/AppState';
import { selectColNames } from '../../redux/store';
import { deleteCollection, changeCollectionName, openFM } from './CollectionActions';

export const TableData = styled('div')`
  padding: 4px 8px;
`;

const Title = styled('span')`
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 10pt;
  user-select: none;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled('p')`
  display: block;
  font-size: 8pt;
  color: #777;
  margin-up: 4px;
  margin-bottom: 4px;
  user-select: none;
`;

const TitleInput = styled(Input)`
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 10pt;
  user-select: none;
`;

type Props = {
  collectionName: string;
};

const CollectionCell: React.FunctionComponent<Props> = ({ collectionName }) => {
  const dispatch = useDispatch();

  const collection = useSelector((s: AppState) => getByKey(s.collections, collectionName));
  const collectionNames = useSelector(selectColNames);

  const [isEditingName, setIsEditingName] = React.useState(false);
  const startEditing = (): void => setIsEditingName(true);
  const stopEditing = (): void => setIsEditingName(false);
  const [isInvalidName, setIsInvalidName] = React.useState(false);
  const [draftName, setDraftName] = React.useState(collectionName);

  React.useEffect(() => {
    setDraftName(collectionName);
  }, [collectionName]);

  const collectionSize = Object.keys(collection?.flows || {}).length;

  function handleDelete(): void {
    if (collectionNames.length > 1) {
      dispatch(deleteCollection(collectionName));
    } else {
      message.error("Can't delete the last collection");
    }
  }

  function checkName(newName: string): boolean {
    return validateCollectionName(newName, collectionName, collectionNames);
  }

  function handleNameChange(newName: string): void {
    if (checkName(newName)) {
      dispatch(changeCollectionName(collectionName, newName));
    }
  }

  function handleOpenFM(): void {
    dispatch(openFM(collectionName));
  }

  return (
    <TableData>
      {isEditingName ? (
        <Form.Item
          validateStatus={isInvalidName ? 'error' : ''}
          style={{ margin: 0 }}
          help={isInvalidName ? 'Invalid Name' : ''}
        >
          <TitleInput
            value={draftName}
            onChange={(e): void => {
              setIsInvalidName(!checkName(e.target.value));
              setDraftName(e.target.value);
            }}
            onKeyDown={(e): void => {
              switch (e.keyCode) {
                case 27: // esc
                  setDraftName(collectionName);
                  stopEditing();
                  break;
                case 13: // enter
                  if (!isInvalidName) {
                    handleNameChange(draftName);
                    stopEditing();
                  }
              }
            }}
            onClick={prevent(e => e)}
          />
        </Form.Item>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Title>{draftName}</Title>
          <div>
            <Button shape="circle" size="small" onClick={prevent(handleOpenFM)} style={{ marginLeft: 4 }}>
              <FilePptOutlined />
            </Button>
            <Button shape="circle" size="small" onClick={prevent(startEditing)} style={{ marginLeft: 4 }}>
              <EditOutlined />
            </Button>
            <Button
              ghost
              shape="circle"
              type="danger"
              size="small"
              onClick={prevent(handleDelete)}
              style={{ marginLeft: 4 }}
            >
              <DeleteOutlined />
            </Button>
          </div>
        </div>
      )}
      <Description>
        {collectionSize} {collectionSize === 1 ? 'entry' : 'entries'}
      </Description>
    </TableData>
  );
};

export default CollectionCell;
