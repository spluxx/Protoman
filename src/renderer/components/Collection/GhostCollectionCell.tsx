import React from 'react';
import styled from 'styled-components';
import { Input, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { selectColNames } from '../../redux/store';
import { validateNewCollectionName } from '../../models/Collection';
import { createCollection } from './CollectionActions';

const TableData = styled('div')`
  padding: 4px 8px;
`;

const TitleInput = styled(Input)`
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 10pt;
  user-select: none;
`;

type Props = {
  onCancel: () => void;
};

const GhostCollectionCell: React.FunctionComponent<Props> = ({ onCancel }) => {
  const dispatch = useDispatch();

  const colNames = useSelector(selectColNames);

  const [v, setV] = React.useState('');
  const [isInvalidName, setIsInvalidName] = React.useState(false);

  function checkName(name: string): boolean {
    return validateNewCollectionName(name, colNames);
  }

  function handleCreate(name: string): void {
    if (checkName(name)) {
      dispatch(createCollection(name));
      onCancel();
    }
  }

  return (
    <TableData>
      <Form.Item
        validateStatus={isInvalidName ? 'error' : ''}
        style={{ margin: 0 }}
        help={isInvalidName ? 'Invalid Name' : ''}
      >
        <TitleInput
          value={v}
          onChange={(e): void => {
            setIsInvalidName(!checkName(e.target.value));
            setV(e.target.value);
          }}
          placeholder="New Collection Name"
          onBlur={onCancel}
          onKeyDown={(e): void => {
            switch (e.keyCode) {
              case 27: // esc
                onCancel();
                break;
              case 13: // enter
                if (!isInvalidName) {
                  handleCreate(v);
                }
            }
          }}
        />
      </Form.Item>
    </TableData>
  );
};

export default GhostCollectionCell;
