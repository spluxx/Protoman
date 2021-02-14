import React from 'react';
import RequestBuilder from '../request/RequestBuilderView/RequestBuilderView';
import ResponseView from '../response/ResponseView';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { sendRequest } from './FlowViewActions';
import { selectCurrentColWithName, selectCurrentFlowWithName, selectCurrentEnv } from '../../../redux/store';
import { Alert, Spin } from 'antd';

const Wrapper = styled('div')`
  padding: 0px;
`;

const Spacing = styled('div')`
  height: 16px;
`;

const FlowView: React.FunctionComponent<{}> = ({}) => {
  const dispatch = useDispatch();

  const col = useSelector(selectCurrentColWithName);
  const flo = useSelector(selectCurrentFlowWithName);
  const env = useSelector(selectCurrentEnv);

  if (!col || !flo || !env) return null;

  const [collectionName, collection] = col;
  const [flowName, flow] = flo;
  const curEnv = env;

  const { requestBuilder, requestStatus, requestError, response } = flow;
  const { protoCtx } = collection;

  function send(): void {
    dispatch(sendRequest(collectionName, flowName, requestBuilder, curEnv, protoCtx));
  }

  return (
    <Wrapper>
      {requestStatus === 'failure' ? (
        <Alert message={requestError?.message || ' '} type="error" closeText="Close" />
      ) : (
        <Spacing />
      )}
      <RequestBuilder
        requestBuilder={requestBuilder}
        protoCtx={protoCtx}
        messageNames={collection.messageNames}
        onSend={send}
      />
      <Spacing />
      {requestStatus === 'sending' ? <Spin size="large" tip="Sending request..." /> : null}

      {response ? <ResponseView response={response} /> : null}
    </Wrapper>
  );
};

export default FlowView;
