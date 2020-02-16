import React from 'react';
import { Select, Button, Icon, Modal, Divider, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../models/AppState';
import { EnvEditor } from './EnvEditor';
import { getByKey } from '../../../utils/utils';
import { Draft } from 'immer';
import { Env } from '../../../models/Env';
import { switchEnv, updateEnv, createEnv, deleteEnv } from './EnvPickerActions';

const { Option } = Select;

const EnvPicker: React.FunctionComponent<{}> = ({}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const showModal = (): void => setModalVisible(true);
  const closeModal = (): void => setModalVisible(false);

  const currentEnv = useSelector((s: AppState) => s.currentEnv);
  const envList = useSelector((s: AppState) => s.envList);

  const env = getByKey(envList, currentEnv);

  const dispatch = useDispatch();

  function handleEnvChange(newEnvName: string, newEnv: Draft<Env>): void {
    dispatch(updateEnv(currentEnv, newEnvName, newEnv));
    closeModal();
  }

  function handleEnvSwitch(newEnvName: string): void {
    dispatch(switchEnv(newEnvName));
  }

  function handleEnvDelete(envName: string): void {
    if (envList.length > 1) {
      dispatch(deleteEnv(envName));
      closeModal();
    } else {
      message.error("Can't delete the last environment");
    }
  }

  function validateName(name: string): boolean {
    return name.length > 0 && (name === currentEnv || envList.map(([n]): string => n).every(n => n !== name));
  }

  function createNewEnv(): void {
    const tmpName = 'env';
    let tmpNameIdx = 1;
    while (!validateName(`${tmpName}${tmpNameIdx}`)) tmpNameIdx++;
    dispatch(createEnv(`${tmpName}${tmpNameIdx}`));
  }

  return (
    <>
      <Button shape="circle-outline" style={{ marginLeft: 4 }} onClick={showModal}>
        <Icon type="setting" />
      </Button>
      <Select
        onSelect={handleEnvSwitch}
        value={currentEnv}
        style={{ width: 100 }}
        dropdownRender={(menu): React.ReactNode => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div
              style={{ padding: '4px 8px', cursor: 'pointer' }}
              onMouseDown={(e): void => e.preventDefault()}
              onClick={createNewEnv}
            >
              <Icon type="plus" /> New
            </div>
          </div>
        )}
      >
        {envList.map(([name]) => (
          <Option key={name}>{name}</Option>
        ))}
      </Select>
      {env ? (
        <Modal visible={modalVisible} footer={null} closable={false} destroyOnClose>
          <EnvEditor
            envName={currentEnv}
            env={env}
            onConfirm={handleEnvChange}
            onCancel={closeModal}
            checkName={validateName}
            onDeleteEnv={handleEnvDelete}
          />
        </Modal>
      ) : null}
    </>
  );
};

export default EnvPicker;
