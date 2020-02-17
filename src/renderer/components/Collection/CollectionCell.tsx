import React from 'react';
import styled from 'styled-components';
import { Collection } from '../../models/Collection';
import { Input, Form, Button, Icon } from 'antd';
import { prevent } from '../../utils/utils';

export const TableData = styled('div')`
  padding: 4px 8px;
`;

const Title = styled('span')`
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 10pt;
  user-select: none;
  width: 120px;
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
  name: string;
  collection: Collection;
  checkName: (name: string) => boolean;
  onChangeColName: (name: string) => void;
  onDeleteCollection: (name: string) => void;
};

const CollectionCell: React.FunctionComponent<Props> = ({
  name,
  collection,
  checkName,
  onDeleteCollection,
  onChangeColName,
}) => {
  const collectionSize = Object.keys(collection.flows).length;

  const [isEditingName, setIsEditingName] = React.useState(false);
  const startEditing = (): void => setIsEditingName(true);
  const stopEditing = (): void => setIsEditingName(false);

  const [isInvalidName, setIsInvalidName] = React.useState(false);

  const [draftName, setDraftName] = React.useState(name);
  React.useEffect(() => {
    setDraftName(name);
  }, [name]);

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
                  setDraftName(name);
                  stopEditing();
                  break;
                case 13: // enter
                  if (!isInvalidName) {
                    onChangeColName(draftName);
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
            <Button shape="circle" size="small" onClick={prevent(startEditing)} style={{ marginLeft: 4 }}>
              <Icon type="edit" />
            </Button>
            <Button
              ghost
              shape="circle"
              type="danger"
              size="small"
              onClick={prevent((): void => onDeleteCollection(name))}
              style={{ marginLeft: 4 }}
            >
              <Icon type="delete" />
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
