import React from 'react';
import { Tabs, Row, Col } from 'antd';
import styled from 'styled-components';
import HeaderView from '../shared/HeaderView/HeaderView';
import { Response, statusCodeToText } from '../../../models/http/response';
import ResponseBodyView from './ResponseBodyView';

const { TabPane } = Tabs;

const ResponseWrapper = styled('div')`
  padding: 16px;
  background-color: white;
  border-radius: 5px;
`;

const TitleWrapper = styled(Row)`
  width: 100%;
`;

const LeftyCol = styled(Col)`
  text-align: left;
  font-size: 12pt;
`;

const RightyCol = styled(Col)`
  text-align: right;
  font-size: 10pt;
`;

const PaddedTabPane = styled(TabPane)`
  padding: 4px;
`;

function statusCodeToColor(code: number): string {
  if (code < 300) return 'green';
  else if (code < 400) return 'yellow';
  else if (code < 500) return 'red';
  else return 'darkgray';
}

const StatusText: React.FunctionComponent<{ code: number }> = ({ code }) => {
  const text = statusCodeToText(code);
  const color = statusCodeToColor(code);

  return (
    <span>
      Status:
      <span style={{ color }}>
        {code} {text}
      </span>
    </span>
  );
};

type Props = {
  response: Response;
};

const ResponseView: React.FunctionComponent<Props> = ({ response }) => {
  const { statusCode, headers, body } = response;
  return (
    <ResponseWrapper>
      <TitleWrapper type="flex" align="bottom">
        <LeftyCol span={6}>Response</LeftyCol>
        <RightyCol span={18}>
          <StatusText code={statusCode} />
        </RightyCol>
      </TitleWrapper>
      <Tabs defaultActiveKey="header" animated={false}>
        <PaddedTabPane tab="Headers" key="header">
          <HeaderView headers={headers} />
        </PaddedTabPane>
        <PaddedTabPane tab="Body" key="body">
          <ResponseBodyView body={body} />
        </PaddedTabPane>
      </Tabs>
    </ResponseWrapper>
  );
};

export default ResponseView;
