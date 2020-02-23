import React from 'react';
import RequestBuilder from '../request/RequestBuilderView/RequestBuilderView';
import ResponseView from '../response/ResponseView';
import styled from 'styled-components';
import { AppState } from '../../../models/AppState';
import { useSelector, useDispatch } from 'react-redux';
import { getByKey } from '../../../utils/utils';
import { sendRequest } from './FlowViewActions';

const Wrapper = styled('div')`
  padding: 0px;
`;

const Spacing = styled('div')`
  height: 16px;
`;

const FlowView: React.FunctionComponent<{}> = ({}) => {
  const dispatch = useDispatch();

  const collections = useSelector((s: AppState) => s.collections);
  const collectionName = useSelector((s: AppState) => s.currentCollection);
  const flowName = useSelector((s: AppState) => s.currentFlow);

  const collection = getByKey(collections, collectionName);

  if (!collection) return null;

  const flow = getByKey(collection.flows, flowName);

  if (!flow) return null;

  const { requestBuilder, requestStatus, requestError, response } = flow;
  const { protoCtx } = collection;

  function send(): void {
    dispatch(sendRequest(collectionName, flowName, requestBuilder, protoCtx));
  }

  return (
    <Wrapper>
      <RequestBuilder
        requestBuilder={requestBuilder}
        protoCtx={protoCtx}
        messageNames={collection.messageNames}
        onSend={send}
      />
      <Spacing />
      {response ? <ResponseView response={response} /> : null}
    </Wrapper>
  );
};

export default FlowView;
