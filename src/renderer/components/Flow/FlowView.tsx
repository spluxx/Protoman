import React from 'react';
import RequestBuilder from './request/RequestBuilderView';
import ResponseView from './response/ResponseView';
import styled from 'styled-components';
import { AppState } from '../../models/AppState';
import { useSelector } from 'react-redux';

const Wrapper = styled('div')`
  padding: 0px;
`;

const Spacing = styled('div')`
  height: 16px;
`;

const FlowView: React.FunctionComponent<{}> = ({}) => {
  const { requestBuilder, response } = useSelector((s: AppState) => s.currentFlow);

  return (
    <Wrapper>
      <RequestBuilder requestBuilder={requestBuilder} />
      <Spacing />
      {response ? <ResponseView response={response} /> : null}
    </Wrapper>
  );
};

export default FlowView;
