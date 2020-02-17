import React from 'react';
import { Button, Icon } from 'antd';
import styled from 'styled-components';

const TableData = styled('div')`
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  onCreate: () => void;
};

const NewCollectionCell: React.FunctionComponent<Props> = ({ onCreate }) => {
  return (
    <TableData>
      <Button type="primary" ghost onClick={onCreate}>
        <Icon type="plus" />
        New Collection
      </Button>
    </TableData>
  );
};

export default NewCollectionCell;
