import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../models/AppState';
import { switchNodeEnv } from './NodeEnvPickerActions';

const NodeEnvPicker: React.FunctionComponent<{}> = ({}) => {
  const currentNodeEnv = useSelector((s: AppState) => s.currentNodeEnv);
  const nodeEnvNames = useSelector((s: AppState) => s.nodeEnvList);
  const dispatch = useDispatch();

  function handleNodeEnvSwitch(newEnvName: string): void {
    dispatch(switchNodeEnv(newEnvName));
  }

  return (
    <Select onSelect={handleNodeEnvSwitch} value={currentNodeEnv} style={{ width: 300 }}>
      {nodeEnvNames.map((name, idx) => (
        <Select.Option key={idx} value={name}>
          {_.capitalize(name)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default NodeEnvPicker;
