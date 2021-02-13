// import React, { useEffect, useRef } from 'react';
// import _ from 'lodash';
// import styled from 'styled-components';
// import { Alert, Button, Col, Row, Select, Spin, Tabs } from 'antd';
// import { MESSAGE_NAME_WIDTH } from '../Flow/request/BodyInput/BodyInput';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectQueryMessageName } from '../cache/CacheAction';
// import AceEditor from 'react-ace-builds';
// import 'ace-builds/src-noconflict/theme-solarized_light';
// import 'ace-builds/webpack-resolver';
// import { selectCurrentCache, selectCurrentCacheCtx } from '../../redux/store';
// import { queryCacheAction } from './CacheAction';
// import { CacheRequestBuilder } from '../../../core/cache';
// import { MessageType, ProtobufType, ProtoCtx, typeNameToType } from '../../../core/protobuf/protobuf';
// import ReactAce from 'react-ace';
// import { Ace } from 'ace-builds';
// import { AppState } from '../../models/AppState';
// import EditSession = Ace.EditSession;
// import Editor = Ace.Editor;
// import Point = Ace.Point;
// import Completer = Ace.Completer;
// import CacheResponseView from './CacheResponseView';
//
// const LABEL_STYLE = { display: 'inline-block', width: 150 };
// const { TabPane } = Tabs;
// const printMarginColumn = false;
// const Wrapper = styled('div')`
//   padding: 0px;
// `;
//
// const BuilderWrapper = styled('div')`
//   padding: 16px;
//   background-color: white;
//   border-radius: 5px;
// `;
//
// const TopBarWrapper = styled('div')`
//   width: 600px;
//   display: flex;
//   justify-content: space-between;
// `;
//
// const TitleWrapper = styled(Row)`
//   width: 100%;
// `;
//
// const LeftyCol = styled(Col)`
//   text-align: left;
//   font-size: 12pt;
// `;
// const LeftMarginButton = styled(Button)`
//   margin-left: 8px;
// `;
//
// const Spacing = styled('div')`
//   height: 16px;
// `;
//
// const queryFunctions = [
//   ['$eq', 'comparison between two values'],
//   ['$gt', 'value is greater than other'],
//   ['$gt', 'value is greater than or equal to other'],
//   ['$lt', 'value is less than other'],
//   ['$lte', 'value is less than or equal to other'],
//   ['$size', 'gets the size of collection'],
//   ['$startWith', 'value starts with the given string'],
//   ['$endWith', 'value ends with the given string'],
//   ['$includes', 'value is in given collection'],
//   ['$some', 'checks if predicate returns truthy for any element of collection'],
//   ['$every', 'checks if predicate returns truthy for all elements of collection'],
// ];
// type Props = {};
//
// function nextOpeningBracket(str: string, pos: number): number {
//   const opening = str.lastIndexOf('{', pos);
//   const closing = str.lastIndexOf('}', pos);
//   if (closing > opening) {
//     return nextOpeningBracket(str.slice(0, opening), opening - 1);
//   }
//   return opening;
// }
//
// function getParents(str: string, pos: number) {
//   const nextPos = nextOpeningBracket(str, pos);
//   const nameEnd: number = str.lastIndexOf('"', nextPos);
//   if (nameEnd > 0) {
//     const nameStart: number = str.lastIndexOf('"', nameEnd - 1);
//     const name: string = _.trim(str.slice(nameStart, nameEnd), '"');
//     const result: string[] = getParents(str, nameStart);
//     result.push(name);
//     return result;
//   }
//   return [];
// }
//
// function getSiblings(str: string, pos: number, prefix = '') {
//   const beginInner = str.slice(nextOpeningBracket(str, pos), pos - prefix.length);
//   const endInner = str.slice(pos, str.indexOf('}', pos) + 1);
//   const cleanBegin = _.chain(beginInner)
//     .trimEnd()
//     .trimEnd(',')
//     .value();
//   const innerObj = `${cleanBegin}${endInner}`;
//   try {
//     return _.keys(JSON.parse(`${innerObj}`));
//   } catch {
//     return [];
//   }
// }
//
// function getSuggestions(ctx: ProtoCtx, type: ProtobufType, childs: string[], ignore: string[] = []): any {
//   // const defaultSuggestions = _.map(queryFunctions, ([caption, meta]) => {
//   //   return { caption, value: `"${caption}":`, meta };
//   // });
//   if (_.has(type, 'repeatedFields')) {
//     const fields = _.union((type as MessageType).singleFields, (type as MessageType).repeatedFields);
//     if (!_.isEmpty(childs)) {
//       const child = childs.pop();
//       const field = _.find(fields, { 0: child }) as [string, string];
//       if (field) {
//         const childType = typeNameToType(field[1], ctx);
//         return getSuggestions(ctx, childType, childs, ignore);
//       }
//     }
//     return _.union(
//       _.reject(queryFunctions, ([name]) => _.includes(ignore, name)),
//       _.reject(fields, ([name]) => _.includes(ignore, name)),
//     );
//   }
//   return queryFunctions;
// }
//
// const CacheExplorerView: React.FunctionComponent<Props> = ({}) => {
//   const dispatch = useDispatch();
//   const cache = useSelector(selectCurrentCache);
//   const currentNodeEnv = useSelector((s: AppState) => s.currentNodeEnv);
//   const { currentCacheName, requestBuilder, requestError, responseDescriptor, requestStatus } = cache || {};
//
//   function onSelectResponseMsg(msgName: string): void {
//     dispatch(selectQueryMessageName(msgName));
//   }
//
//   const search = requestBuilder?.search ? JSON.stringify(requestBuilder?.search, null, '\t') : '';
//   const currentCtx = useSelector(selectCurrentCacheCtx);
//   const messageNames = currentCtx ? _.map(currentCtx.types, 'name') : [];
//   const queryEditor: React.RefObject<AceEditor> = useRef<AceEditor>(null);
//
//   useEffect(() => {
//     if (queryEditor.current) {
//       if (currentCtx && requestBuilder?.expectedMessage) {
//         const currentType: MessageType = typeNameToType(requestBuilder?.expectedMessage, currentCtx) as MessageType;
//         const typeComplete: Completer = {
//           getCompletions: function(
//             editor: Editor,
//             session: EditSession,
//             pos: Point,
//             prefix: string,
//             callback: Function,
//           ) {
//             const currentText = session.getValue();
//             const currentIndex = session.getDocument().positionToIndex(pos);
//             const parents = getParents(currentText, currentIndex);
//             const siblings = getSiblings(currentText, currentIndex, prefix);
//             const suggestions = getSuggestions(currentCtx, currentType, parents, siblings);
//             const hasApostrophes = currentText.charAt(currentIndex - 1) === '"';
//             callback(
//               null,
//               suggestions.map(function(field: any = []) {
//                 const [name, typeName] = field;
//                 return {
//                   caption: name,
//                   //value: !isObject ? `"${name}":` : `"${name}": {`,
//                   value: !hasApostrophes ? `"${name}": ` : name,
//                   meta: typeName,
//                   // completer: {
//                   //   insertMatch: function(editor: Editor, data: any) {
//                   //     if (prefix) {
//                   //       const ranges = editor.selection.getAllRanges();
//                   //       for (let i = 0, range; (range = ranges[i]); i++) {
//                   //         range.start.column -= prefix.length;
//                   //         editor.session.remove(range);
//                   //       }
//                   //     }
//                   //     editor.execCommand('insertstring', data.value || data);
//                   //     const pos = editor.selection.getCursor(); //Take the latest position on the editor
//                   //     // if (isObject) {
//                   //     //   editor.gotoLine(pos.row, pos.column + 4, true); //This will set your cursor in between the brackets
//                   //     // }
//                   //   },
//                   // },
//                 };
//               }),
//             );
//           },
//         };
//         const reactAceEditor: ReactAce = queryEditor.current as ReactAce;
//         reactAceEditor.editor.completers = [typeComplete];
//       }
//     }
//   });
//   function queryCache(): void {
//     const reactAceEditor: ReactAce = queryEditor.current as ReactAce;
//     const value = reactAceEditor ? reactAceEditor.editor.getValue() : '{}';
//     const expectedMessage = requestBuilder?.expectedMessage;
//     if (expectedMessage && currentCacheName) {
//       const query = JSON.parse(value);
//       const request: CacheRequestBuilder = {
//         expectedMessage,
//         search: query,
//         limit: 100,
//       };
//       dispatch(queryCacheAction(currentNodeEnv, currentCacheName, request));
//     }
//   }
//   return (
//     <Wrapper>
//       {requestStatus === 'failure' ? (
//         <Alert message={requestError?.message || ' '} type="error" closeText="Close" />
//       ) : null}
//       <Spacing />
//       <BuilderWrapper>
//         <TopBarWrapper>
//           <TitleWrapper align="bottom">
//             <LeftyCol span={6}>Response</LeftyCol>
//           </TitleWrapper>
//         </TopBarWrapper>
//           <span style={LABEL_STYLE}>Expected Message:</span>
//           <Select
//             value={requestBuilder?.expectedMessage}
//             onChange={onSelectResponseMsg}
//             size="small"
//             style={{ width: MESSAGE_NAME_WIDTH }}
//             allowClear
//             showSearch
//             filterOption={(input, option): boolean => {
//               return option && option.value.toString().includes(input.toString());
//             }}
//           >
//             {messageNames.map((messageName, idx) => (
//               <Select.Option key={idx} value={messageName}>
//                 {messageName}
//               </Select.Option>
//             ))}
//           </Select>
//           <LeftMarginButton onClick={queryCache}>Send</LeftMarginButton>
//         </TopBarWrapper>
//         <Spacing />
//         <AceEditor
//           ref={queryEditor}
//           showGutter={true}
//           theme={'solarized-light'}
//           value={search}
//           mode="json"
//           height="500px"
//           width="700px"
//           setOptions={{
//             theme: 'solarized-light',
//             enableBasicAutocompletion: true,
//             enableLiveAutocompletion: true,
//             debounceChangePeriod: 500,
//             highlightActiveLine: false,
//             enableSnippets: true,
//             printMargin: true,
//             printMarginColumn,
//             showLineNumbers: true,
//             minLines: 10,
//             maxLines: 30,
//             tabSize: 2,
//           }}
//         />
//       </BuilderWrapper>
//       <Spacing />
//       {requestStatus === 'sending' ? <Spin size="large" tip="Sending request..." /> : null}
//       {responseDescriptor && requestStatus === 'success' ? (
//         <CacheResponseView responseDescriptor={responseDescriptor} />
//       ) : null}
//     </Wrapper>
//   );
// };
// export default CacheExplorerView;
