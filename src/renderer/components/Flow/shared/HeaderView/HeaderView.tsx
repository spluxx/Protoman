import React from 'react';
import { Row, Col, Button, AutoComplete } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteHeader, createHeader, changeHeaderName, changeHeaderValue } from './HeaderViewActions';
import { COMMON_HEADER_NAMES } from './HeaderNames';
import HighlightInput from '../../../base/HighlightInput/HighlightInput';

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
      {editable ? (
        <Button shape="circle" size="small" ghost type="primary" onClick={handleCreate} disabled={!editable}>
          <PlusOutlined />
        </Button>
      ) : null}
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
  const nameOptions = COMMON_HEADER_NAMES;

  return (
    <Row gutter={8} align="middle" style={{ marginBottom: 8 }}>
      <Col span={6}>
        <AutoComplete
          style={{ width: '100%' }}
          placeholder="name"
          value={name}
          {...(editable ? {} : { open: false })}
          onChange={(s): void => {
            if (editable) {
              onNameChange(s.toString());
            }
          }}
          filterOption={(input, option): boolean => {
            return (option?.value?.toString() || '').includes(input.toString());
          }}
        >
          {nameOptions.map(option => (
            <AutoComplete.Option key={option} value={option}>
              {option}
            </AutoComplete.Option>
          ))}
        </AutoComplete>
      </Col>
      <Col span={editable ? 16 : 18}>
        <HighlightInput
          placeholder="value"
          value={value}
          colored={editable}
          onChange={(e): void => {
            if (editable) {
              onValueChange(e.target.value);
            }
          }}
        />
      </Col>
      {editable ? (
        <Col span={2}>
          <Button shape="circle" size="small" danger onClick={onDelete} disabled={!editable}>
            <DeleteOutlined />
          </Button>
        </Col>
      ) : null}
    </Row>
  );
};

export default HeaderView;
