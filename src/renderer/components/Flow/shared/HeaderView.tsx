import React from 'react';
import { Row, Col, Input } from 'antd';

type Props = {
  editable?: boolean;
  headers: ReadonlyArray<[string, string]>;
};

const HeaderView: React.FunctionComponent<Props> = ({ editable, headers }) => {
  return (
    <div>
      {headers.map(([name, value], idx) => (
        <SingleHeaderView key={idx} editable={editable} name={name} value={value} />
      ))}
    </div>
  );
};

type SingleProps = {
  editable?: boolean;
  name: string;
  value: string;
};

const SingleHeaderView: React.FunctionComponent<SingleProps> = ({ editable, name, value }) => {
  return (
    <Row gutter={8}>
      <Col span={6}>
        <Input placeholder="name" readOnly={!editable} value={name} />
      </Col>
      <Col span={18}>
        <Input placeholder="value" readOnly={!editable} value={value} />
      </Col>
    </Row>
  );
};

export default HeaderView;
