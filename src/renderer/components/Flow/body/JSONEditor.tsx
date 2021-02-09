import React, { ChangeEvent, FunctionComponent } from 'react';
import styled from 'styled-components';
import { BodyType, RequestBody } from '../../../models/request_builder';
import { MessageType, ProtobufType, ProtoCtx } from '../../../../core/protobuf/protobuf';
import { AnyAction, Dispatch } from 'redux';
import { allChanged } from './MessageValueViewActions';
import AceEditor from 'react-ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ext-language_tools';
import { createMessageValue } from '../../../../core/protobuf/deserializer';

type Props = {
  bodyType: BodyType;
  bodies: RequestBody;
  protoCtx: ProtoCtx;
  messageNames: ReadonlyArray<string>;
};

const BodyWrapper = styled('div')`
  display: block;
  margin-top: 8px;
`;

export function dispatchingJsonHandler(dispatch: Dispatch, ctx: ProtoCtx): EventHandlers {
  function fireAndForget<T extends AnyAction>(action: T): void {
    console.log('change');
    dispatch(action);
  }
  return {
    allChanged: (type, v): void => {
      try {
        const value = createMessageValue(type, JSON.parse(v), ctx);
        fireAndForget(allChanged(value, ctx));
      } catch (err) {}
    },
  };
}
type AllChangedHandler = (type: ProtobufType, v: string) => void;

export type EventHandlers = {
  allChanged: AllChangedHandler;
};
export const MESSAGE_NAME_WIDTH = 500;
type JSEProps = {
  editable?: boolean;
  minWidth?: number;
  value: { [key: string]: any } | undefined;
  type: MessageType | undefined;
  handlers: EventHandlers;
};

const JSONEditor: FunctionComponent<JSEProps> = ({ editable, value, type, handlers }) => {
  const handleChange = (value: string, event: ChangeEvent<HTMLTextAreaElement>) => {
    //  return useInterval(() => {
    type ? handlers.allChanged(type, value) : null;
    //   }, 3000);
  };
  const handleBlur = (event: ChangeEvent<HTMLTextAreaElement>) => {
    //   return useInterval(() => {
    type ? handlers.allChanged(type, event.target.value) : null;
    //   }, 3000);
  };
  const json = JSON.stringify(value, null, '\t');
  return (
    <AceEditor
      wrapEnabled
      showGutter={true}
      mode="json"
      height="500px"
      width="600px"
      value={json}
      onChange={handleChange}
      onBlur={handleBlur}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        highlightActiveLine: false,
        minLines: 100,
        showPrintMargin: false,
        showLineNumbers: true,
        debounceChangePeriod: 500,
        tabSize: 2,
      }}
    />
  );
};

export default JSONEditor;
