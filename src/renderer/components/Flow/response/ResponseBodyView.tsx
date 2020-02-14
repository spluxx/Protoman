import React, { FunctionComponent } from 'react';
import MessageView from '../body/MessageView';
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

const ResponseBodyView: FunctionComponent<Props> = ({ body }) => {
  const { type, value } = body;
  switch (type) {
    case 'empty':
      return <EmptyBody />;
    case 'protobuf':
      return <MessageView body={value as MessageValue} />;
    case 'string':
      return <StringBody value={value as string} />;
    case 'unknown':
      return <UnknownBody />;
  }
};

export default ResponseBodyView;
