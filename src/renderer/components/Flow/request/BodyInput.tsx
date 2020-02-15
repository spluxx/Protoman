import React, { FunctionComponent } from 'react';
import { MessageValue } from '../../../models/http/body/protobuf';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import MessageValueView from '../body/MessageValueView';
import styled from 'styled-components';

type Props = {
  body: MessageValue | null;
};

const BodyWrapper = styled('div')`
  display: block;
  margin-top: 8px;
`;

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
      <BodyWrapper hidden={radioValue !== 'protobuf'}>
        {body ? (
          <MessageValueView level={0} value={body} onFieldChange={console.log} onValueChange={console.log} editable />
        ) : null}
      </BodyWrapper>
    </div>
  );
};

export default BodyInput;
