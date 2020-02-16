import React from 'react';
import RequestBuilder from './request/RequestBuilderView';
import ResponseView from './response/ResponseView';
import styled from 'styled-components';
import { AppState } from '../../models/AppState';
import { useSelector } from 'react-redux';
import { getByKey } from '../../utils/utils';

const Wrapper = styled('div')`
  padding: 0px;
`;

const Spacing = styled('div')`
  height: 16px;
`;

const FlowView: React.FunctionComponent<{}> = ({}) => {
  const collections = useSelector((s: AppState) => s.collections);
  const collectionName = useSelector((s: AppState) => s.currentCollection);
  const flowName = useSelector((s: AppState) => s.currentFlow);

  const collection = getByKey(collections, collectionName);

  if (!collection) return null;

  const flow = getByKey(collection.flows, flowName);

  if (!flow) return null;

  const { requestBuilder, response } = flow;
  const { protoCtx } = collection;

  return (
    <Wrapper>
      <RequestBuilder requestBuilder={requestBuilder} protoCtx={protoCtx} />
      <Spacing />
      {response ? <ResponseView response={response} /> : null}
    </Wrapper>
  );
};

export default FlowView;
