import React, { FunctionComponent } from 'react';
import MessageValueView from '../body/MessageValueView';
import { ResponseBody } from '../../../models/http/response';
import { MessageValue } from '../../../models/http/body/protobuf';

type Props = {
  body: ResponseBody;
};

const UnknownBody: FunctionComponent<{}> = () => {
  return <div>The given content-type is unsupported.</div>;
};

const EmptyBody: FunctionComponent<{}> = () => {
  return <div>The response has an empty body.</div>;
};

const StringBody: FunctionComponent<{ value: string }> = ({ value }) => {
  return <div>{value}</div>;
};

const NO_OP = (): void => {
  // no_op
};

const ResponseBodyView: FunctionComponent<Props> = ({ body }) => {
  const { type, value } = body;
  switch (type) {
    case 'empty':
      return <EmptyBody />;
    case 'protobuf':
      return <MessageValueView level={0} value={value as MessageValue} onFieldChange={NO_OP} onValueChange={NO_OP} />;
      return null;
    case 'string':
      return <StringBody value={value as string} />;
    case 'unknown':
      return <UnknownBody />;
  }
};

export default ResponseBodyView;
