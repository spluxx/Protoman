import React, { FunctionComponent } from 'react';
import { Radio } from 'antd';

const BodyInput: FunctionComponent<{}> = ({}) => {
  const [radioValue, setRadioValue] = React.useState('none');

  return (
    <div>
      <Radio.Group defaultValue="none" value={radioValue} onChange={console.log}>
        <Radio value="none">None</Radio>
        <Radio value="protobuf">Protobuf</Radio>
      </Radio.Group>
    </div>
  );
};

export default BodyInput;
