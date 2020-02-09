import React from 'react';
import RequestBuilder from './RequestBuilder';
import ResponseView from './ResponseView';

const FlowView: React.FunctionComponent<{}> = ({}) => {
  return (
    <div>
      <RequestBuilder />
      <ResponseView />
    </div>
  );
};

export default FlowView;
