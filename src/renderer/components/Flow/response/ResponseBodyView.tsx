import React, { FunctionComponent } from 'react';
import MessageValueView from '../body/MessageValueView';
import styled from 'styled-components';
import TextArea from 'antd/lib/input/TextArea';
import { ResponseBody } from '../../../../core/http_client/response';
import { MessageValue, ProtobufValue } from '../../../../core/protobuf/protobuf';
import { Alert } from 'antd';
import JSONEditor from '../body/JSONEditor';
import { createMessageRecurse } from '../../../../core/protobuf/serializer';
import AceEditor from 'react-ace-builds';

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
  warning: string;
};

const ResponseBodyView: FunctionComponent<Props> = ({ body, warning }) => {
  const { type, value } = body;

  const handlers = {
    valueChange: NO_OP,
    fieldChange: NO_OP,
    entryAdd: NO_OP,
    entryRemove: NO_OP,
  };
  const json =
    value && type === 'protobuf' ? JSON.stringify(createMessageRecurse(value as ProtobufValue), null, '\t') : '{}';
  return (
    <div>
      {warning.length > 0 && <Alert type="warning" style={{ whiteSpace: 'pre' }} message={warning}></Alert>}
      <div style={{ height: 8 }} />
      {type === 'empty' ? (
        <EmptyBody />
      ) : type === 'unknown' ? (
        <UnknownBody />
      ) : type === 'protobuf' ? (
        <AceEditor
          theme={'solarized-light'}
          showGutter={true}
          mode="json"
          height="500px"
          width="700px"
          value={json}
          setOptions={{
            readOnly: true,
            theme: 'solarized-light',
            showPrintMargin: true,
            highlightActiveLine: false,
            printMargin: true,
            showLineNumbers: true,
            minLines: 200,
            tabSize: 2,
          }}
        />
      ) : type === 'json' || type === 'html' ? (
        <StringBody s={value as string} />
      ) : null}
    </div>
  );
};

export default ResponseBodyView;
