import React from 'react';
import RequestBuilder from '../request/RequestBuilderView/RequestBuilderView';
import ResponseView from '../response/ResponseView';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { sendRequest } from './FlowViewActions';
import { selectCurrentColWithName, selectCurrentFlowWithName, selectCurrentEnv } from '../../../redux/store';
import { Alert, Spin } from 'antd';
import { RequestBuilder as RequestBuilderModel } from '../../../models/request_builder';

const Wrapper = styled('div')`
  padding: 0px;
`;

const Spacing = styled('div')`
  height: 16px;
`;

// workaround for sanatized bad data before send protobuf request
const sanatizeRequestBuilder = (requestBuilder: RequestBuilderModel): RequestBuilderModel => {
  if (requestBuilder?.bodies?.protobuf?.mapFields) {
    const overrideMapFields: any = requestBuilder.bodies.protobuf.mapFields.map(field => {
      return [field[0], field[1].filter(Boolean)];
    });

    return {
      ...requestBuilder,
      bodies: {
        ...requestBuilder.bodies,
        protobuf: {
          ...requestBuilder.bodies.protobuf,
          mapFields: overrideMapFields,
        },
      },
    };
  }

  return requestBuilder;
};

const FlowView: React.FunctionComponent<unknown> = ({}) => {
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
    dispatch(sendRequest(collectionName, flowName, sanatizeRequestBuilder(requestBuilder), curEnv, protoCtx));
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

      {requestStatus === 'failure' ? (
        <Alert message={requestError?.message || ' '} type="error" closeText="Close" />
      ) : null}

      {requestStatus === 'sending' ? <Spin size="large" tip="Sending request..." /> : null}

      {response ? <ResponseView response={response} /> : null}
    </Wrapper>
  );
};

export default FlowView;
