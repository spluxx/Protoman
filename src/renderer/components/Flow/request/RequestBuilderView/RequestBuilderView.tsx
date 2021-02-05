import React from 'react';
import EndpointInput from '../EndpointInput/EndpointInput';
import { Tabs, Button } from 'antd';
import HeaderView from '../../shared/HeaderView/HeaderView';
import BodyInput from '../BodyInput/BodyInput';
import styled from 'styled-components';
import ExpectedBodyInput from '../ExpectedBodyInput/ExpectedBodyInput';
import { RequestBuilder } from '../../../../models/request_builder';
import { ProtoCtx, CacheResult, ProtobufValue, CacheData } from '../../../../../core/protobuf/protobuf';
import JSONEditor, { dispatchingJsonHandler, EventHandlers } from '../../body/JSONEditor';
import { AnyAction, Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

const { TabPane } = Tabs;

const BuilderWrapper = styled('div')`
  padding: 16px;
  background-color: white;
  border-radius: 5px;
`;

const TopBarWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const LeftMarginButton = styled(Button)`
  margin-left: 8px;
`;

const PaddedTabPane = styled(TabPane)`
  padding: 4px;
`;

export function dispatchingCacheHandlers(dispatch: Dispatch, ctx: ProtoCtx): EventHandlers {
  return {
    allChanged: (type, v): void => {
      return;
    },
  };
}

type Props = {
  requestBuilder: RequestBuilder;
  protoCtx: ProtoCtx;
  cache: CacheData | undefined;
  messageNames: ReadonlyArray<string>;
  onSend: () => void;
};

const RequestBuilderView: React.FunctionComponent<Props> = ({
  cache,
  requestBuilder,
  protoCtx,
  messageNames,
  onSend,
}) => {
  const { method, url, headers, bodyType, bodies, expectedProtobufMsg, expectedProtobufMsgOnError } = requestBuilder;

  const dispatch = useDispatch();
  const cacheHandlers = dispatchingCacheHandlers(dispatch, protoCtx);
  return (
    <BuilderWrapper>
      <TopBarWrapper>
        <EndpointInput method={method} url={url} onSend={onSend} />
        <LeftMarginButton onClick={onSend}>Send</LeftMarginButton>
      </TopBarWrapper>
      <Tabs defaultActiveKey="header" animated={false}>
        <PaddedTabPane tab="Headers" key="header">
          <HeaderView editable headers={headers} />
        </PaddedTabPane>
        <PaddedTabPane tab="Body" key="body">
          <BodyInput bodyType={bodyType} bodies={bodies} protoCtx={protoCtx} messageNames={messageNames} />
        </PaddedTabPane>
        <PaddedTabPane tab="Expected Message" key="expectedMessage">
          <ExpectedBodyInput
            messageNames={messageNames}
            expectedProtobufMsg={expectedProtobufMsg}
            expectedProtobufMsgOnError={expectedProtobufMsgOnError}
          />
        </PaddedTabPane>
        <PaddedTabPane tab="Cache" key="cache">
          <JSONEditor value={cache?.data} type={cache?.messageType} handlers={cacheHandlers} />
        </PaddedTabPane>
      </Tabs>
    </BuilderWrapper>
  );
};

export default RequestBuilderView;
