import React from 'react';
import { Button, Collapse, Layout } from 'antd';
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

export const COLLECTION_SIDER_WIDTH = 210;
const cacheNames: string[] = ['Demand', 'Supply', 'Common'];
type SiderProps = {
  onClickOnTab: Function;
};
const CacheSider: React.FunctionComponent<SiderProps> = ({ onClickOnTab }) => {
  const dispatch = useDispatch();
  const nodeEnv = useSelector((s: AppState) => s.currentNodeEnv);
  function handleCacheSelect(cacheName: string): void {
    onClickOnTab();
    dispatch(selectCacheName(nodeEnv, cacheName));
  }
  return (
    <Sider width={COLLECTION_SIDER_WIDTH} theme="light">
      <Wrapper>
        {cacheNames.map(name => {
          return (
            <Header key={name}>
              <LinkButton type="link" onClick={() => handleCacheSelect(name)}>
                {name}
              </LinkButton>
            </Header>
          );
        })}
      </Wrapper>
    </Sider>
  );
};

export default CacheSider;
