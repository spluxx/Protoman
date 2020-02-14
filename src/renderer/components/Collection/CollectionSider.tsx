import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import CollectionCell from './CollectionCell';
import { useSelector } from 'react-redux';
import { AppState } from '../../models/AppState';

const Sider = styled(Layout.Sider)`
  background: #fff;
  box-shadow: 3px 0 3px -0px #aaa;
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

  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Sider width={200} collapsible collapsed={collapsed} onCollapse={setCollapsed} collapsedWidth={30} theme="light">
      <Table hidden={collapsed}>
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
