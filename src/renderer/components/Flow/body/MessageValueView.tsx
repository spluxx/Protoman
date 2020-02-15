import React, { FunctionComponent } from 'react';
import { MessageValue, PrimitiveValue, EnumValue, ProtobufValue } from '../../../models/http/body/protobuf';
import styled from 'styled-components';
import { Input, Select, Button, Icon } from 'antd';

type ValueChangeHandler = (path: string, v: string) => void;
type FieldChangeHandler = (path: string, t: string) => void; // for oneof

function prefix(prefix: string, ch: ValueChangeHandler): ValueChangeHandler {
  return (p, t): void => ch(`${prefix}/${p}`, t);
}

const KEY_INPUT_WIDTH = 150;
const VALUE_INPUT_WIDTH = 300;

const IndentationBlock = styled('div')`
  display: block;
  margin-left: 6px;
  margin: 2px 2px 2px 10px;
  padding: 2px;
`;

const Block = styled('div')`
  display: block;
  margin: 4px 0;
  padding: 2px;
`;

const LightText = styled('span')`
  color: gray;
`;

const FieldName = styled('span')`
  width: 50px;
`;

type MVVProps = {
  editable?: boolean;
  level: number;
  value: MessageValue;
  onValueChange: ValueChangeHandler;
  onFieldChange: FieldChangeHandler;
};

function bgColorForLevel(level: number): string {
  return level % 2 === 0 ? '#ffffff' : '#ffffff';
}

const MessageValueView: FunctionComponent<MVVProps> = ({ editable, level, value, onValueChange, onFieldChange }) => {
  const { type, fields, repeatedFields, oneOfFields, mapFields } = value;

  return (
    <>
      <LightText>{type.name + ' {'}</LightText>
      <IndentationBlock>
        {fields.map(([fieldName, value]) => (
          <SingleFieldView
            key={fieldName}
            editable={editable}
            level={level + 1}
            fieldName={fieldName}
            value={value}
            onFieldChange={prefix(fieldName, onFieldChange)}
            onValueChange={prefix(fieldName, onValueChange)}
          />
        ))}
        {repeatedFields.map(([fieldName, values]) => (
          <RepeatedFieldView
            key={fieldName}
            editable={editable}
            level={level + 1}
            fieldName={fieldName}
            values={values}
            onFieldChange={prefix(fieldName, onFieldChange)}
            onValueChange={prefix(fieldName, onValueChange)}
          />
        ))}
        {oneOfFields.map(([fieldName, selectedField]) => {
          const options: ReadonlyArray<string> | undefined = type.oneOfFields
            .find(([fn]) => fn === fieldName)?.[1]
            ?.map(([name]) => name);

          return (
            <OneOfFieldView
              key={fieldName}
              editable={editable}
              level={level + 1}
              fieldOptions={options || []}
              fieldName={fieldName}
              selectedField={selectedField}
              onFieldChange={prefix(fieldName, onFieldChange)}
              onValueChange={prefix(fieldName, onValueChange)}
            />
          );
        })}
        {mapFields.map(([fieldName, entries]) => (
          <MapFieldView
            key={fieldName}
            editable={editable}
            level={level + 1}
            fieldName={fieldName}
            kvPairs={entries}
            onFieldChange={prefix(fieldName, onFieldChange)}
            onValueChange={prefix(fieldName, onValueChange)}
          />
        ))}
      </IndentationBlock>
      <LightText>{'}'}</LightText>
    </>
  );
};

type PVVProps = {
  editable?: boolean;
  value: PrimitiveValue;
  onValueChange: ValueChangeHandler;
};

const PrimitiveValueView: FunctionComponent<PVVProps> = ({ editable, value, onValueChange }) => {
  const { type, value: v } = value;

  return (
    <Input
      size="small"
      addonAfter={<LightText>{type.name}</LightText>}
      readOnly={!editable}
      value={v}
      style={{ width: VALUE_INPUT_WIDTH }}
    />
  );
};

type EVVProps = {
  editable?: boolean;
  value: EnumValue;
  onValueChange: ValueChangeHandler;
};

const EnumValueView: FunctionComponent<EVVProps> = ({ editable, value, onValueChange }) => {
  const { type, selected } = value;
  const { options } = type;

  const style = {
    width: VALUE_INPUT_WIDTH,
  };

  return editable ? (
    <Select value={selected} style={style} size="small">
      {options.map((option, idx) => (
        <Select.Option key={idx} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  ) : (
    <Select value={selected} open={false} style={style} size="small">
      {options.map((option, idx) => (
        <Select.Option key={idx} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  );
};

type PBVVProps = {
  editable?: boolean;
  level: number;
  value: ProtobufValue;
  onValueChange: ValueChangeHandler;
  onFieldChange: FieldChangeHandler;
};

const ProtobufValueView: FunctionComponent<PBVVProps> = ({ editable, level, value, onValueChange, onFieldChange }) => {
  switch (value.type.tag) {
    case 'message':
      return (
        <MessageValueView
          editable={editable}
          level={level}
          value={value as MessageValue}
          onValueChange={onValueChange}
          onFieldChange={onFieldChange}
        />
      );
    case 'primitive':
      return <PrimitiveValueView editable={editable} value={value as PrimitiveValue} onValueChange={onValueChange} />;
    case 'enum':
      return <EnumValueView editable={editable} value={value as EnumValue} onValueChange={onValueChange} />;
  }
};

type SFVProps = {
  editable?: boolean;
  level: number;
  fieldName: string;
  value: ProtobufValue;
  onValueChange: ValueChangeHandler;
  onFieldChange: FieldChangeHandler;
};

const SingleFieldView: FunctionComponent<SFVProps> = ({
  editable,
  level,
  fieldName,
  value,
  onValueChange,
  onFieldChange,
}) => {
  const backgroundColor = bgColorForLevel(level);
  return (
    <Block style={{ backgroundColor }}>
      <FieldName>{fieldName}</FieldName>
      <span>: </span>
      <ProtobufValueView
        editable={editable}
        level={level}
        value={value}
        onValueChange={onValueChange}
        onFieldChange={onFieldChange}
      />
    </Block>
  );
};

type RFVProps = {
  editable?: boolean;
  level: number;
  fieldName: string;
  values: ReadonlyArray<ProtobufValue>;
  onValueChange: ValueChangeHandler;
  onFieldChange: FieldChangeHandler;
};

const RepeatedFieldView: FunctionComponent<RFVProps> = ({
  editable,
  level,
  fieldName,
  values,
  onValueChange,
  onFieldChange,
}) => {
  const backgroundColor = bgColorForLevel(level);
  return (
    <Block style={{ backgroundColor }}>
      <FieldName>{fieldName}</FieldName>
      <span>: </span>
      {values.map((v, idx) => (
        <IndentationBlock key={idx}>
          <ProtobufValueView
            editable={editable}
            level={level}
            value={v}
            onValueChange={onValueChange}
            onFieldChange={onFieldChange}
          />
          <Button shape="circle" size="small" style={{ marginLeft: 4 }}>
            <Icon type="delete" />
          </Button>
        </IndentationBlock>
      ))}
      <IndentationBlock>
        <Button shape="circle" size="small">
          <Icon type="plus" />
        </Button>
      </IndentationBlock>
    </Block>
  );
};

type OFVProps = {
  editable?: boolean;
  level: number;
  fieldOptions: ReadonlyArray<string>;
  fieldName: string;
  selectedField: [string, ProtobufValue];
  onValueChange: ValueChangeHandler;
  onFieldChange: FieldChangeHandler;
};

const OneOfFieldView: FunctionComponent<OFVProps> = ({
  editable,
  level,
  fieldOptions,
  fieldName,
  selectedField,
  onValueChange,
  onFieldChange,
}) => {
  const [name, value] = selectedField;
  const backgroundColor = bgColorForLevel(level);
  return (
    <Block style={{ backgroundColor }}>
      <FieldName>{fieldName}</FieldName>
      <span>: </span>
      <Select value={name} size="small">
        {fieldOptions.map((option, idx) => (
          <Select.Option key={idx} value={option}>
            {option}
          </Select.Option>
        ))}
      </Select>
      <IndentationBlock>
        <SingleFieldView
          editable={editable}
          level={level}
          fieldName={name}
          value={value}
          onFieldChange={prefix(name, onFieldChange)}
          onValueChange={prefix(name, onValueChange)}
        />
      </IndentationBlock>
    </Block>
  );
};

type MFVProps = {
  editable?: boolean;
  level: number;
  fieldName: string;
  kvPairs: ReadonlyArray<[string, ProtobufValue]>;
  onValueChange: ValueChangeHandler;
  onFieldChange: FieldChangeHandler;
};

const MapFieldView: FunctionComponent<MFVProps> = ({
  editable,
  level,
  fieldName,
  kvPairs,
  onValueChange,
  onFieldChange,
}) => {
  const backgroundColor = bgColorForLevel(level);

  return (
    <Block style={{ backgroundColor }}>
      <FieldName>{fieldName}</FieldName>
      <span>: </span>
      {kvPairs.map(([k, v], idx) => (
        <IndentationBlock key={idx}>
          <Input value={k} style={{ width: KEY_INPUT_WIDTH, marginRight: 4 }} size="small" />
          <ProtobufValueView
            editable={editable}
            level={level}
            value={v}
            onValueChange={onValueChange}
            onFieldChange={onFieldChange}
          />
          <Button shape="circle" size="small" style={{ marginLeft: 4 }}>
            <Icon type="delete" />
          </Button>
        </IndentationBlock>
      ))}
      <IndentationBlock>
        <Button shape="circle" size="small">
          <Icon type="plus" />
        </Button>
      </IndentationBlock>
    </Block>
  );
};

export default MessageValueView;
