import React from 'react';
import styled from 'styled-components';
import { Collection } from '../../models/Collection';

type Props = {
  name: string;
  collection: Collection;
};

const TableData = styled('td')`
  border-top: 0.25px solid #eee;
  border-bottom: 0.25px solid #eee;
  padding: 4px 8px;

  &:hover {
    cursor: pointer;
    background-color: #f7fcff;
  }
`;

const Title = styled('p')`
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 10pt;
  user-select: none;
`;

const Description = styled('p')`
  font-size: 8pt;
  color: #777;
  margin-up: 4px;
  margin-bottom: 4px;
  user-select: none;
`;

const CollectionCell: React.FunctionComponent<Props> = ({ name, collection }: Props) => {
  return (
    <TableData>
      <Title>{name}</Title>
      <Description>{Object.keys(collection.flows).length} entries</Description>
    </TableData>
  );
};

export default CollectionCell;
