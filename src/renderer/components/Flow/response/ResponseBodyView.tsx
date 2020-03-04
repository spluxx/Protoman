import React, { FunctionComponent } from 'react';
import MessageValueView from '../body/MessageValueView';
import styled from 'styled-components';
import TextArea from 'antd/lib/input/TextArea';
import { ResponseBody } from '../../../../core/http_client/response';
import { MessageValue } from '../../../../core/protobuf/protobuf';

const TextView = styled(TextArea)`
  width: 100%;
  resize: none;
  overflow: hidden;
`;

const UnknownBody: FunctionComponent<{}> = () => {
  return <div>The given content-type is unsupported.</div>;
};

const EmptyBody: FunctionComponent<{}> = () => {
  return <div>The response has an empty body.</div>;
};

const StringBody: FunctionComponent<{ s: string }> = ({ s }) => {
  return <TextView readOnly value={s} autoSize />;
};

const NO_OP = (): void => {
  // no_op
};

type Props = {
  body: ResponseBody;
};

const ResponseBodyView: FunctionComponent<Props> = ({ body }) => {
  const { type, value } = body;

  const handlers = {
    valueChange: NO_OP,
    fieldChange: NO_OP,
    entryAdd: NO_OP,
    entryRemove: NO_OP,
  };

  switch (type) {
    case 'empty':
      return <EmptyBody />;
    case 'unknown':
      return <UnknownBody />;
    case 'protobuf':
      return <MessageValueView value={value as MessageValue} handlers={handlers} />;
    case 'json':
    case 'html':
      return <StringBody s={value as string} />;
    default:
      return null;
  }
};

export default ResponseBodyView;
