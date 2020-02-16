import React from 'react';
import { Row, Col, Input, Button, Icon } from 'antd';
import { useDispatch } from 'react-redux';
import { deleteHeader, createHeader, changeHeaderName, changeHeaderValue } from './HeaderViewActions';

type Props = {
  editable?: boolean;
  headers: ReadonlyArray<[string, string]>;
};

const HeaderView: React.FunctionComponent<Props> = ({ editable, headers }) => {
  const dispatch = useDispatch();

  function handleDelete(idx: number): void {
    dispatch(deleteHeader(idx));
  }

  function handleCreate(): void {
    dispatch(createHeader());
  }

  function handleNameChange(idx: number, name: string): void {
    dispatch(changeHeaderName(idx, name));
  }

  function handleValueChange(idx: number, value: string): void {
    dispatch(changeHeaderValue(idx, value));
  }

  return (
    <div>
      {headers.map(([name, value], idx) => (
        <SingleHeaderView
          key={idx}
          editable={editable}
          name={name}
          value={value}
          onNameChange={(name): void => handleNameChange(idx, name)}
          onValueChange={(value): void => handleValueChange(idx, value)}
          onDelete={(): void => handleDelete(idx)}
        />
      ))}
      <Button shape="circle" size="small" ghost type="primary" onClick={handleCreate} disabled={!editable}>
        <Icon type="plus" />
      </Button>
    </div>
  );
};

type SingleProps = {
  editable?: boolean;
  name: string;
  value: string;
  onDelete: () => void;
  onNameChange: (name: string) => void;
  onValueChange: (value: string) => void;
};

const SingleHeaderView: React.FunctionComponent<SingleProps> = ({
  editable,
  name,
  value,
  onDelete,
  onNameChange,
  onValueChange,
}) => {
  return (
    <Row gutter={8} type="flex" style={{ alignItems: 'center', marginBottom: 8 }}>
      <Col span={6}>
        <Input
          placeholder="name"
          readOnly={!editable}
          value={name}
          onChange={(e): void => onNameChange(e.target.value)}
        />
      </Col>
      <Col span={16}>
        <Input
          placeholder="value"
          readOnly={!editable}
          value={value}
          onChange={(e): void => onValueChange(e.target.value)}
        />
      </Col>
      <Col span={2}>
        <Button shape="circle" size="small" ghost type="danger" onClick={onDelete} disabled={!editable}>
          <Icon type="delete" />
        </Button>
      </Col>
    </Row>
  );
};

export default HeaderView;
