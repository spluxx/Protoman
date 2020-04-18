import React from 'react';
import { Tabs, Row, Col } from 'antd';
import styled from 'styled-components';
import HeaderView from '../shared/HeaderView/HeaderView';
import ResponseBodyView from './ResponseBodyView';
import { ResponseDescriptor } from '../../../../core/http_client/response';
import { statusCodeToText } from './StatusCodes';

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

const LeftMarginSpan = styled('span')`
  margin-left: 8px;
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
    <LeftMarginSpan>
      {'Status: '}
      <span style={{ color }}>
        {code} {text}
      </span>
    </LeftMarginSpan>
  );
};

const TimeText: React.FunctionComponent<{ time: number }> = ({ time }) => {
  let t = time;
  let unit = 'ms';

  if (t >= 1000) {
    t = t / 1000;
    unit = 's';
  }

  return (
    <LeftMarginSpan>
      Time: {t} {unit}
    </LeftMarginSpan>
  );
};

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB'];

function raise(bs: number, unit: string): [number, string] {
  const uIdx = SIZE_UNITS.findIndex(u => u === unit);
  return [Math.floor(bs / 1024), SIZE_UNITS[uIdx + 1]];
}

const BodySizeText: React.FunctionComponent<{ bodySize: number }> = ({ bodySize }) => {
  let bs = bodySize;
  let unit = 'B';
  while (bs >= 1024) {
    [bs, unit] = raise(bs, unit);
  }

  return (
    <LeftMarginSpan>
      Size: {bs} {unit}
    </LeftMarginSpan>
  );
};

type Props = {
  response: ResponseDescriptor;
};

const ResponseView: React.FunctionComponent<Props> = ({ response }) => {
  const { statusCode, headers, time, body } = response;
  const { bodySize } = body;

  return (
    <ResponseWrapper>
      <TitleWrapper align="bottom">
        <LeftyCol span={6}>Response</LeftyCol>
        <RightyCol span={18}>
          <StatusText code={statusCode} />
          <TimeText time={time} />
          <BodySizeText bodySize={bodySize} />
        </RightyCol>
      </TitleWrapper>
      <Tabs defaultActiveKey="body" animated={false}>
        <PaddedTabPane tab="Body" key="body">
          <ResponseBodyView body={body} />
        </PaddedTabPane>
        <PaddedTabPane tab="Headers" key="header">
          <HeaderView headers={headers} />
        </PaddedTabPane>
      </Tabs>
    </ResponseWrapper>
  );
};

export default ResponseView;
