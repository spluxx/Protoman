import React, { ChangeEvent, FunctionComponent, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { BodyType, RequestBody } from '../../../models/request_builder';
import { MessageValue, ProtobufType, ProtobufValue, ProtoCtx } from '../../../../core/protobuf/protobuf';
import { AnyAction, Dispatch } from 'redux';
import { allChanged } from './MessageValueViewActions';
import AceEditor from 'react-ace';
import { createMessageRecurse } from '../../../../core/protobuf/serializer';
import { createMessageValue } from '../../../../core/protobuf/deserializer';
import brace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/mode/javascript';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/solarized_light';

import 'brace/ext/language_tools';
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

type EventHandlers = {
  allChanged: AllChangedHandler;
};
export const MESSAGE_NAME_WIDTH = 500;
type JSEProps = {
  editable?: boolean;
  minWidth?: number;
  value: MessageValue;
  handlers: EventHandlers;
};

const JSONEditor: FunctionComponent<JSEProps> = ({ editable, value, handlers }) => {
  const { type } = value;
  const json = JSON.stringify(createMessageRecurse(value as ProtobufValue), null, '\t');
  const handleChange = (value: string, event: ChangeEvent<HTMLTextAreaElement>) => {
    //  return useInterval(() => {
    handlers.allChanged(type, value);
    //   }, 3000);
  };
  const handleBlur = (event: ChangeEvent<HTMLTextAreaElement>) => {
    //   return useInterval(() => {
    handlers.allChanged(type, event.target.value);
    //   }, 3000);
  };
  return (
    <AceEditor
      wrapEnabled
      debounceChangePeriod={500}
      showGutter={true}
      mode="json"
      height="500px"
      width="600px"
      value={json}
      onChange={handleChange}
      onBlur={handleBlur}
      setOptions={{
        wrapEnabled: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showPrintMargin: false,
        showLineNumbers: true,
        maxLines: 200,
        tabSize: 2,
      }}
    />
  );
};

export default JSONEditor;