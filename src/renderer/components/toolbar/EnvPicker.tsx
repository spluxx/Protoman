import React from 'react';
import { Select, Button, Icon } from 'antd';
import { useSelector } from 'react-redux';
import { AppState } from '../../models/AppState';

const { Option } = Select;

const EnvPicker: React.FunctionComponent<{}> = ({}) => {
  const currentEnv = useSelector((s: AppState) => s.currentEnv);
  const envList = useSelector((s: AppState) => Object.entries(s.envList));

  return (
    <>
      <Button shape="circle-outline" style={{ marginLeft: 4 }}>
        <Icon type="setting" />
      </Button>
      <Select onSelect={console.log} value={currentEnv} style={{ width: 100 }}>
        {envList.map(([name]) => (
          <Option key={name}>{name}</Option>
        ))}
      </Select>
    </>
  );
};

export default EnvPicker;
