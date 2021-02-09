import React from 'react';
import { Button, Collapse, Layout } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../models/AppState';

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

const CacheSider: React.FunctionComponent<{}> = ({}) => {
  const dispatch = useDispatch();

  const cache = useSelector((s: AppState) => s.cache);

  function handleCacheSelect(e: any): void {
    //dispatch(toggleCollections(openCollections));
  }
  return (
    <Sider width={COLLECTION_SIDER_WIDTH} theme="light">
      <Wrapper>
        {cache.protoCtxs.map(([name]) => {
          return (
            <Header key={name}>
              <LinkButton type="link" onClick={handleCacheSelect}>
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
