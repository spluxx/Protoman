import React from 'react';
import RequestBuilder from './request/RequestBuilder';
import ResponseView from './response/ResponseView';
import styled from 'styled-components';

const Wrapper = styled('div')`
  padding: 0px;
`;

const Spacing = styled('div')`
  height: 16px;
`;

const FlowView: React.FunctionComponent<{}> = ({}) => {
  return (
    <Wrapper>
      <RequestBuilder />
      <Spacing />
      <ResponseView />
    </Wrapper>
  );
};

export default FlowView;
