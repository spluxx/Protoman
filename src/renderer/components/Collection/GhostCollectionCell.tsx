import React from 'react';
import styled from 'styled-components';
import { Input, Form } from 'antd';

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
  onCreate: (name: string) => void;
  onCancel: () => void;
  checkName: (name: string) => boolean;
};

const GhostCollectionCell: React.FunctionComponent<Props> = ({ onCreate, onCancel, checkName }) => {
  const [v, setV] = React.useState('');
  const [isInvalidName, setIsInvalidName] = React.useState(false);

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
                  onCreate(v);
                }
            }
          }}
        />
      </Form.Item>
    </TableData>
  );
};

export default GhostCollectionCell;
