import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import CollectionCell from './CollectionCell';
import { useSelector } from 'react-redux';
import { AppState } from '../../models/AppState';

const Sider = styled(Layout.Sider)`
  background: #fff;
  box-shadow: 3px 0 5px -0px #aaa;
`;

const Table = styled('table')`
  width: 100%;
  margin: 0;
`;

const TableHeader = styled('th')`
  text-align: center;
`;

const Title = styled('h1')`
  margin: 16px 0px;
  user-select: none;
`;

const CollectionSider: React.FunctionComponent<{}> = ({}) => {
  const collections = useSelector((s: AppState) => Object.entries(s.collections));

  return (
    <Sider width={250}>
      <Table>
        <thead>
          <tr>
            <TableHeader>
              <Title>Collections</Title>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {collections.map(([name, col], idx) => (
            <tr key={idx}>
              <CollectionCell name={name} collection={col} />
            </tr>
          ))}
        </tbody>
      </Table>
    </Sider>
  );
};

export default CollectionSider;
