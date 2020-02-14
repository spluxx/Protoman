import React, { FunctionComponent } from 'react';
import { MessageValue } from '../../../models/http/body/protobuf';

type Props = {
  editable?: boolean;
  body: MessageValue;
};

const MessageView: FunctionComponent<Props> = ({ editable, body }) => {
  return <div>MessageView</div>;
};

export default MessageView;
