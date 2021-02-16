import React from 'react';
import { Tabs, Row, Col } from 'antd';
import styled from 'styled-components';
import { CacheResponseDescriptor } from '../../../core/Cache';
import AceEditor from 'react-ace-builds';

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
  const text = 'OK';
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
  responseDescriptor: CacheResponseDescriptor;
};

const CacheResponseView: React.FunctionComponent<Props> = ({ responseDescriptor }) => {
  const { response, time } = responseDescriptor;
  const data = response ? JSON.stringify(response.data, null, '\t') : '';
  const bodySize = Buffer.from(data).length;
  return (
    <ResponseWrapper>
      <TitleWrapper align="bottom">
        <LeftyCol span={6}>Response</LeftyCol>
        <RightyCol span={18}>
          <StatusText code={200} />
          <TimeText time={time} />
          <BodySizeText bodySize={bodySize} />
        </RightyCol>
      </TitleWrapper>
      <Tabs defaultActiveKey="body" animated={false}>
        <PaddedTabPane tab="Body" key="body">
          <AceEditor
            theme={'solarized-light'}
            showGutter={true}
            mode="json"
            height="60vh"
            width="180vh"
            value={data}
            setOptions={{
              readOnly: true,
              showPrintMargin: false,
              highlightActiveLine: false,
              showLineNumbers: true,
              minLines: 200,
              tabSize: 2,
            }}
          />
        </PaddedTabPane>
      </Tabs>
    </ResponseWrapper>
  );
};

export default CacheResponseView;
