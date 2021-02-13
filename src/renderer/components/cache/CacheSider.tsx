import React, { CSSProperties } from 'react';
import { Button, Collapse, Layout, Typography } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../models/AppState';
import { selectCacheName } from './CacheAction';

const { Panel } = Collapse;

const Sider = styled(Layout.Sider)`
  background: #fff;
  box-shadow: 1px 0 3px -0px #aaa;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
`;

const Header = styled('div')`
  text-align: left;
  color: rgb(47, 93, 232);
  width: 100%;
  border-top: 1px solid #d9d9d9;
  flex: 0 0 auto;
`;

const Title = styled('h1')`
  user-select: none;
  margin: 0;
`;
const LinkButton = styled(Button)`
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px l    
  user-select: none;
`;
type CacheName = 'Supply' | 'Common' | 'Demand';

export const COLLECTION_SIDER_WIDTH = 210;
const cacheNames: CacheName[] = ['Demand', 'Supply', 'Common'];
type SiderProps = {
  onClickOnTab: Function;
  style?: CSSProperties;
};
const CacheSider: React.FunctionComponent<SiderProps> = ({ onClickOnTab, style }) => {
  const dispatch = useDispatch();
  const nodeEnv = useSelector((s: AppState) => s.currentNodeEnv);
  const currentCacheName = useSelector((s: AppState) => s.cache.currentCacheName);
  function handleCacheSelect(cacheName: 'Supply' | 'Common' | 'Demand'): void {
    onClickOnTab();
    dispatch(selectCacheName(nodeEnv, cacheName));
  }
  return (
    <Wrapper>
      {cacheNames.map((name: CacheName) => {
        return (
          <Header key={name}>
            <Title style={style} onClick={() => handleCacheSelect(name)}>
              <Typography.Text
                strong={currentCacheName === name}
                style={{ userSelect: 'none', color: currentCacheName === name ? 'rgb(47, 93, 232)' : undefined }}
              >
                {name}
              </Typography.Text>
            </Title>
          </Header>
        );
      })}
    </Wrapper>
  );
};

export default CacheSider;
