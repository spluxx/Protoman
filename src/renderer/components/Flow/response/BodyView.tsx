import React, { FunctionComponent } from 'react';
import JsonView from '../body/JsonView';
import MessageView from '../body/MessageView';

type Props = {
  contentType: string;
};

const BodyView: FunctionComponent<Props> = ({ contentType }) => {
  switch (contentType) {
    case 'application/json':
      return <JsonView />;
    case 'protobuf':
      return <MessageView />;
    default:
      return <UnknownBodyView />;
  }
};

const UnknownBodyView: FunctionComponent<{}> = () => {
  return <div>The given content-type is unsupported.</div>;
};

export default BodyView;
