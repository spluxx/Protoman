import React from 'react';
import EndpointInput from './EndpointInput';
import { Tabs, Button } from 'antd';
import HeaderView from '../shared/HeaderView';
import BodyInput from './BodyInput';
import styled from 'styled-components';
import { RequestBuilder } from '../../../models/http/request_builder';
import { ProtoCtx } from '../../../models/http/body/protobuf';

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

type Props = {
  requestBuilder: RequestBuilder;
  protoCtx: ProtoCtx;
};

const RequestBuilderView: React.FunctionComponent<Props> = ({ requestBuilder, protoCtx }) => {
  const { method, url, headers, body, responseMessageName } = requestBuilder;

  return (
    <BuilderWrapper>
      <TopBarWrapper>
        <EndpointInput method={method} url={url} />
        <LeftMarginButton>Send</LeftMarginButton>
      </TopBarWrapper>
      <Tabs defaultActiveKey="header" animated={false}>
        <PaddedTabPane tab="Headers" key="header">
          <HeaderView editable headers={headers} />
        </PaddedTabPane>
        <PaddedTabPane tab="Body" key="body">
          <BodyInput body={body} protoCtx={protoCtx} />
        </PaddedTabPane>
      </Tabs>
    </BuilderWrapper>
  );
};

export default RequestBuilderView;
