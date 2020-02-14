import React, { FunctionComponent } from 'react';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

const BodyInput: FunctionComponent<{}> = ({}) => {
  const [radioValue, setRadioValue] = React.useState('none');

  function onRadioChange(e: RadioChangeEvent): void {
    setRadioValue(e.target.value);
  }

  return (
    <div>
      <Radio.Group defaultValue="none" value={radioValue} onChange={onRadioChange}>
        <Radio value="none">None</Radio>
        <Radio value="protobuf">Protobuf</Radio>
      </Radio.Group>
    </div>
  );
};

export default BodyInput;
