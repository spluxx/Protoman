import React, { CSSProperties } from 'react';
import { Button, Col, Row, Layout, Typography } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../models/AppState';
import { selectCacheName, refreshCacheAction } from './CacheAction';
import moment from 'moment';
import { getEntryByKey } from '../../utils/utils';
const Sider = styled(Layout.Sider)`
  background: #fff;
  box-shadow: 1px 0 3px -0px #aaa;
  display: flex;
  flex-direction: column;
  height: 95vh;
`;

const Wrapper = styled('div')`
  width: 100%;
`;

const Header = styled('div')`
  text-align: center;
  width: 100%;
  flex: 0 0 auto;
  padding: 16px 8px 8px 8px;
`;

const Title = styled('h1')`
  user-select: none;
  margin: 0;
`;
const TitleWrapper = styled(Row)`
  width: 100%;
`;
const LeftyCol = styled(Col)`
  text-align: left;
`;

const RightyCol = styled(Col)`
  text-align: right;
`;

const StatusBar = styled(Col)`
  text-align: left;
  font-size: 7pt;
  color: #777;
`;

const Panel = styled('div')`
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
  position: relative;
  padding: 0px 10px 0px 10px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 10pt;
  line-height: 22px;
`;
type CacheName = 'Supply' | 'Common' | 'Demand';
const LinkButton = styled(Button)`
  padding: 0;
  font-size: 8pt;
  padding-bottom: 5px;
`;
const cacheNames: CacheName[] = ['Demand', 'Supply', 'Common'];
type SiderProps = {
  onClickOnTab: Function;
  style?: CSSProperties;
};
const RightMarginSpan = styled('span')`
  margin-right: 8px;
`;
const TimeText: React.FunctionComponent<{ time: Date | undefined }> = ({ time }) => {
  const ago = moment(time).fromNow();
  return <RightMarginSpan>{time ? `${ago}` : ''}</RightMarginSpan>;
};
function statusCodeToColor(time: Date | undefined): string {
  const minutes = time ? moment.duration(moment().diff(time)).asMinutes() : -1;
  if (minutes < 0) return 'darkgray';
  else if (minutes < 10) return 'green';
  else return 'orange';
}
const StatusText: React.FunctionComponent<{ text: string; time: Date | undefined }> = ({ text, time }) => {
  const color = statusCodeToColor(time);
  return <RightMarginSpan style={{ color }}>{text}</RightMarginSpan>;
};

const CacheSider: React.FunctionComponent<SiderProps> = ({ onClickOnTab, style }) => {
  const dispatch = useDispatch();
  const currentCacheName = useSelector((s: AppState) => s.currentCacheName);
  const nodeEnv = useSelector((s: AppState) => s.currentNodeEnv);
  function handleCacheSelect(cacheName: string): void {
    onClickOnTab();
    dispatch(selectCacheName(nodeEnv, cacheName));
  }
  function handleRefresh(cacheName: string) {
    dispatch(refreshCacheAction(nodeEnv, cacheName));
  }
  return (
    <Sider style={style}>
      <Header>
        <Title>Caches</Title>
      </Header>
      {cacheNames.map((name: CacheName) => {
        const cacheEntry = useSelector((s: AppState) => getEntryByKey(s.caches, name));
        let cacheState = 'Not ready';
        let lastRefresh: Date | undefined = undefined;
        if (cacheEntry) {
          const [cacheName, cache] = cacheEntry;
          if (cache && cache.cacheRecency) {
            cacheState = 'Ready';
            lastRefresh = cache.cacheRecency;
          }
        }
        return (
          <Panel key={name} onClick={() => handleCacheSelect(name)}>
            <StatusBar span={24}>
              <StatusText text={cacheState} time={lastRefresh} />
              <TimeText time={lastRefresh} />
            </StatusBar>
            <TitleWrapper>
              <LeftyCol span={12}>
                <Typography.Text
                  strong={currentCacheName === name}
                  style={{ userSelect: 'none', color: currentCacheName === name ? 'rgb(47, 93, 232)' : undefined }}
                >
                  {name}
                </Typography.Text>
              </LeftyCol>
              <RightyCol span={12}>
                <LinkButton type="link" onClick={() => handleRefresh(name)}>
                  Refresh
                </LinkButton>
              </RightyCol>
            </TitleWrapper>
          </Panel>
        );
      })}
    </Sider>
  );
};

export default CacheSider;
