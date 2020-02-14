import React from 'react';
import { Row, Col, Input } from 'antd';

type Props = {
  editable?: boolean;
};

const HeaderView: React.FunctionComponent<Props> = ({ editable }) => {
  return (
    <div>
      <SingleHeaderView editable={editable} />
    </div>
  );
};

type SingleProps = {
  editable?: boolean;
};

const SingleHeaderView: React.FunctionComponent<SingleProps> = ({ editable }) => {
  return (
    <Row gutter={8}>
      <Col span={6}>
        <Input placeholder="name" readOnly={!editable} />
      </Col>
      <Col span={18}>
        <Input placeholder="value" readOnly={!editable} />
      </Col>
    </Row>
  );
};

export default HeaderView;
