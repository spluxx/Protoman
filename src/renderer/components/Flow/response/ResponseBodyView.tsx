import React, { FunctionComponent } from 'react';
import MessageValueView from '../body/MessageValueView';
import { ResponseBody } from '../../../models/http/response';
import { MessageValue } from '../../../models/http/body/protobuf';
import styled from 'styled-components';
import TextArea from 'antd/lib/input/TextArea';

const TextView = styled(TextArea)`
  width: 100%;
  resize: none;
  overflow: hidden;
`;

type Props = {
  body: ResponseBody;
};

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
    case 'protobuf':
      return <MessageValueView value={value as MessageValue} handlers={handlers} />;
    case 'string':
      return <StringBody s={value as string} />;
    case 'unknown':
      return <UnknownBody />;
  }
};

export default ResponseBodyView;
