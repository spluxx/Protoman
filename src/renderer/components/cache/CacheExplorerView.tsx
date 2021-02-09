import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { FieldBase, Type } from 'protobufjs';
import { Alert, Button, Select, Spin, Tabs } from 'antd';
import { MESSAGE_NAME_WIDTH } from '../Flow/request/BodyInput/BodyInput';
import { useDispatch, useSelector } from 'react-redux';
import { selectQueryMessageName } from '../cache/CacheAction';
import AceEditor from 'react-ace-builds';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/webpack-resolver';
import { selectCurrentCache, selectCurrentCacheCtx } from '../../redux/store';
import { queryCacheAction } from './CacheAction';
import { CacheRequestBuilder } from '../../../core/cache';
import { MessageType, ProtobufType, ProtoCtx, typeNameToType } from '../../../core/protobuf/protobuf';
import ReactAce from 'react-ace';
import { Ace } from 'ace-builds';
import EditSession = Ace.EditSession;
import Editor = Ace.Editor;
import Point = Ace.Point;
import Completer = Ace.Completer;

const LABEL_STYLE = { display: 'inline-block', width: 150 };
const { TabPane } = Tabs;
const printMarginColumn = false;
const Wrapper = styled('div')`
  padding: 0px;
`;

const BuilderWrapper = styled('div')`
  padding: 16px;
  background-color: white;
  border-radius: 5px;
`;

const TopBarWrapper = styled('div')`
  width: 600px;
  display: flex;
  justify-content: space-between;
`;

const LeftMarginButton = styled(Button)`
  margin-left: 8px;
`;

const PaddedTabPane = styled(TabPane)`
  padding: 4px;
`;
const Spacing = styled('div')`
  height: 16px;
`;
type Props = {
  // messageNames: ReadonlyArray<string>;
  // expectedProtobufMsg: string | undefined;
};

function nextOpeningBracket(str: string, pos: number): number {
  const opening = str.lastIndexOf('{', pos);
  const closing = str.lastIndexOf('}', pos);
  if (closing > opening) {
    return nextOpeningBracket(str.slice(0, opening), opening - 1);
  }
  return opening;
}

function getParents(str: string, pos: number) {
  const nextPos = nextOpeningBracket(str, pos);
  const nameEnd: number = str.lastIndexOf('"', nextPos);
  if (nameEnd > 0) {
    const nameStart: number = str.lastIndexOf('"', nameEnd - 1);
    const name: string = _.trim(str.slice(nameStart, nameEnd), '"');
    const result: string[] = getParents(str, nameStart);
    result.push(name);
    return result;
  }
  return [];
}

function getSiblings(str: string, pos: number, prefix = '') {
  const beginInner = str.slice(nextOpeningBracket(str, pos), pos - prefix.length);
  const endInner = str.slice(pos, str.indexOf('}', pos) + 1);
  const cleanBegin = _.chain(beginInner)
    .trimEnd()
    .trimEnd(',')
    .value();
  const innerObj = `${cleanBegin}${endInner}`;
  try {
    return _.keys(JSON.parse(`${innerObj}`));
  } catch {
    return [];
  }
}

function getSuggestions(ctx: ProtoCtx, type: ProtobufType, childs: string[], ignore: string[] = []): any {
  if (_.has(type, 'repeatedFields')) {
    const fields = _.union((type as MessageType).singleFields, (type as MessageType).repeatedFields);
    if (!_.isEmpty(childs)) {
      const child = childs.pop();
      const field = _.find(fields, { 0: child }) as [string, string];
      if (field) {
        const childType = typeNameToType(field[1], ctx);
        return getSuggestions(ctx, childType, childs, ignore);
      }
    }
    return _.reject(fields, ([name]) => _.includes(ignore, name));
  }
  return [];
}
const CacheExplorerView: React.FunctionComponent<Props> = ({}) => {
  const dispatch = useDispatch();
  const cache = useSelector(selectCurrentCache);
  const { currentCacheName, requestBuilder, requestError, response, requestStatus } = cache || {};

  function onSelectResponseMsg(msgName: string): void {
    dispatch(selectQueryMessageName(msgName));
  }

  const search = requestBuilder?.search ? JSON.stringify(requestBuilder?.search, null, '\t') : '';
  const data = response?.data ? JSON.stringify(response?.data, null, '\t') : '';

  const currentCtx = useSelector(selectCurrentCacheCtx);
  const messageNames = currentCtx ? _.map(currentCtx.types, 'name') : [];
  const queryEditor: React.RefObject<AceEditor> = useRef<AceEditor>(null);

  useEffect(() => {
    if (queryEditor.current) {
      if (currentCtx && requestBuilder?.expectedMessage) {
        const currentType: MessageType = typeNameToType(requestBuilder?.expectedMessage, currentCtx) as MessageType;
        const fields = _.union(currentType.singleFields, currentType.repeatedFields);
        const typeComplete: Completer = {
          getCompletions: function(
            editor: Editor,
            session: EditSession,
            pos: Point,
            prefix: string,
            callback: Function,
          ) {
            const currentText = session.getValue();
            const currentIndex = session.getDocument().positionToIndex(pos);
            const parents = getParents(currentText, currentIndex);
            const siblings = getSiblings(currentText, currentIndex, prefix);
            const suggestions = getSuggestions(currentCtx, currentType, parents, siblings);
            callback(
              null,
              suggestions.map(function(field: any = []) {
                const [name, typeName] = field;
                const isObject = _.startsWith(typeName, '.');
                return {
                  caption: name,
                  //value: !isObject ? `"${name}":` : `"${name}": {`,
                  value: `"${name}": `,
                  meta: typeName,
                  // completer: {
                  //   insertMatch: function(editor: Editor, data: any) {
                  //     if (prefix) {
                  //       const ranges = editor.selection.getAllRanges();
                  //       for (let i = 0, range; (range = ranges[i]); i++) {
                  //         range.start.column -= prefix.length;
                  //         editor.session.remove(range);
                  //       }
                  //     }
                  //     editor.execCommand('insertstring', data.value || data);
                  //     const pos = editor.selection.getCursor(); //Take the latest position on the editor
                  //     // if (isObject) {
                  //     //   editor.gotoLine(pos.row, pos.column + 4, true); //This will set your cursor in between the brackets
                  //     // }
                  //   },
                  // },
                };
              }),
            );
          },
        };
        const reactAceEditor: ReactAce = queryEditor.current as ReactAce;
        reactAceEditor.editor.completers = [typeComplete];
      }
    }
  });
  function queryCache(): void {
    const reactAceEditor: ReactAce = queryEditor.current as ReactAce;
    const value = reactAceEditor ? reactAceEditor.editor.getValue() : '{}';
    const expectedMessage = requestBuilder?.expectedMessage;
    if (expectedMessage && currentCacheName) {
      const query = JSON.parse(value);
      const request: CacheRequestBuilder = {
        expectedMessage,
        search: query,
        limit: 100,
      };
      dispatch(queryCacheAction(currentCacheName, request));
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  return (
    <Wrapper>
      {requestStatus === 'failure' ? (
        <Alert message={requestError?.message || ' '} type="error" closeText="Close" />
      ) : null}
      <Spacing />
      <BuilderWrapper>
        <TopBarWrapper>
          <span style={LABEL_STYLE}>Expected Message:</span>
          <Select
            value={requestBuilder?.expectedMessage}
            onChange={onSelectResponseMsg}
            size="small"
            style={{ width: MESSAGE_NAME_WIDTH }}
            allowClear
            showSearch
            filterOption={(input, option): boolean => {
              return option && option.value.toString().includes(input.toString());
            }}
          >
            {messageNames.map((messageName, idx) => (
              <Select.Option key={idx} value={messageName}>
                {messageName}
              </Select.Option>
            ))}
          </Select>
          <LeftMarginButton onClick={queryCache}>Send</LeftMarginButton>
        </TopBarWrapper>
        <Spacing />
        <AceEditor
          ref={queryEditor}
          showGutter={true}
          value={search}
          mode="json"
          height="500px"
          width="700px"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            debounceChangePeriod: 500,
            highlightActiveLine: false,
            enableSnippets: true,
            printMargin: true,
            printMarginColumn,
            showLineNumbers: true,
            minLines: 10,
            maxLines: 30,
            tabSize: 2,
          }}
        />
      </BuilderWrapper>
      <Spacing />
      {requestStatus === 'sending' ? <Spin size="large" tip="Sending request..." /> : null}
      {response && requestStatus === 'success' ? (
        <div>
          <AceEditor
            theme={'solarized-light'}
            showGutter={true}
            mode="json"
            height="500px"
            width="700px"
            value={data}
            setOptions={{
              readOnly: true,
              theme: 'solarized-light',
              showPrintMargin: true,
              printMargin: true,
              printMarginColumn,
              showLineNumbers: true,
              minLines: 200,
              tabSize: 2,
            }}
          />
        </div>
      ) : null}
    </Wrapper>
  );
};
export default CacheExplorerView;
