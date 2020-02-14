import React, { FunctionComponent } from 'react';
import { MessageValue } from '../../../models/http/body/protobuf';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import MessageView from '../body/MessageView';

type Props = {
  body: MessageValue | null;
};

const BodyInput: FunctionComponent<Props> = ({ body }) => {
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
      {body ? <MessageView body={body} /> : null}
    </div>
  );
};

export default BodyInput;
