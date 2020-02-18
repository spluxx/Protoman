import React from 'react';
import { List, Typography, Button, Icon } from 'antd';
import styled from 'styled-components';
import { prevent } from '../../utils/utils';

const ClickableItem = styled(List.Item)`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  &:hover {
    cursor: pointer;
    background-color: #f7fcff;
  }
`;

const Footer = styled('div')`
  width: 100%;
  display: flex;
  justify-content: center;
`;

type Props = {
  isCurrentCollection: boolean;
  currentFlow: string;
  flowNames: string[];
  onSelection: (name: string) => void;
  onDelete: (name: string) => void;
  onCreate: () => void;
};

const FlowList: React.FunctionComponent<Props> = ({
  isCurrentCollection,
  currentFlow,
  flowNames,
  onSelection,
  onDelete,
  onCreate,
}) => {
  const footer = (
    <Footer>
      <Button type="primary" ghost onClick={onCreate}>
        <Icon type="plus" />
        New Flow
      </Button>
    </Footer>
  );

  return (
    <List
      footer={footer}
      dataSource={flowNames}
      renderItem={(flowName): React.ReactNode => (
        <ClickableItem onClick={(): void => onSelection(flowName)}>
          <Typography.Text strong={isCurrentCollection && currentFlow === flowName}>{flowName}</Typography.Text>
          <div>
            <Button
              ghost
              shape="circle"
              type="danger"
              size="small"
              onClick={prevent((): void => onDelete(flowName))}
              style={{ marginLeft: 4 }}
            >
              <Icon type="delete" />
            </Button>
          </div>
        </ClickableItem>
      )}
    />
  );
};

export default FlowList;
