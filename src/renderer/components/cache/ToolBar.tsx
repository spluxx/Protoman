import React from 'react';
import { Row, Col, Select } from 'antd';
import EnvPicker from '../toolbar/Env/EnvPicker';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import NodeEnvPicker from '../toolbar/NodeEnv/NodeEnvPicker';
import { AppState } from '../../models/AppState';

const PaddedRow = styled(Row)`
  padding: 8px 0px;
`;

const Title = styled('span')`
  font-size: 16pt;
  margin: 0;
`;
const CacheToolBar: React.FunctionComponent<{}> = ({}) => {
  const currentCacheName = useSelector((s: AppState) => s.currentCacheName);
  return (
    <PaddedRow>
      <Col span={8} style={{ display: 'flex' }}>
        <Title>{currentCacheName}</Title>
      </Col>
      <Col span={8} />
      <Col span={8} style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <EnvPicker />
        <NodeEnvPicker />
      </Col>
    </PaddedRow>
  );
};

export default CacheToolBar;
