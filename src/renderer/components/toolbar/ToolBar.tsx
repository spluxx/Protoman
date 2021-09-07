import React from 'react';
import { Row, Col } from 'antd';
import EnvPicker from './Env/EnvPicker';
import styled from 'styled-components';
import FlowNameView from './FlowName/FlowNameView';

const PaddedRow = styled(Row)`
  padding: 8px 0px;
`;

const ToolBar: React.FunctionComponent<unknown> = ({}) => {
  return (
    <PaddedRow>
      <Col span={8} style={{ display: 'flex' }}>
        <FlowNameView />
      </Col>
      <Col span={8} />
      <Col span={8} style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <EnvPicker />
      </Col>
    </PaddedRow>
  );
};

export default ToolBar;
