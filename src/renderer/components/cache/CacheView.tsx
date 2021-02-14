import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCurrentCacheWithName } from '../../redux/store';
import { Alert, Spin } from 'antd';
import CacheRequestBuilderView from './CacheRequestBuilderView';
import CacheResponseView from './CacheResponseView';

const Wrapper = styled('div')`
  padding: 0px;
`;

const Spacing = styled('div')`
  height: 16px;
`;
const CacheView: React.FunctionComponent<{}> = ({}) => {
  const cacheEntry = useSelector(selectCurrentCacheWithName);
  if (!cacheEntry) return null;
  const [cacheName, cache] = cacheEntry;
  const { requestStatus, requestError, responseDescriptor } = cache;
  return (
    <Wrapper>
      {requestStatus === 'failure' ? (
        <Alert message={requestError?.message || ' '} type="error" closeText="Close" />
      ) : (
        <Spacing />
      )}
      <CacheRequestBuilderView />
      <Spacing />
      {requestStatus === 'sending' ? <Spin size="large" tip="Sending request..." /> : null}

      {responseDescriptor ? <CacheResponseView responseDescriptor={responseDescriptor} /> : null}
    </Wrapper>
  );
};

export default CacheView;
