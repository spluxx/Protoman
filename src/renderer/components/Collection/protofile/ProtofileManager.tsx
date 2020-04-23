import React from 'react';
import styled from 'styled-components';
import { Typography, List, Button, Row, Col, Checkbox, Divider, Alert, Input } from 'antd';
import { PlusOutlined, CloseOutlined, BuildOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { buildProtofiles, resetProtofileStatus } from './ProtofileManagerActions';
import { AppState } from '../../../models/AppState';
import { getByKey } from '../../../utils/utils';
import { closeFM } from '../CollectionActions';

const Wrapper = styled('div')`
  padding: 0px;
`;

const Scrollable = styled('div')`
  height: 300px;
  overflow: auto;
`;

type Props = {
  collectionName: string;
};

const ProtofileManager: React.FunctionComponent<Props> = ({ collectionName }) => {
  const dispatch = useDispatch();

  const collection = useSelector((s: AppState) => getByKey(s.collections, collectionName));
  const filepaths = collection?.protoFilepaths;
  const rootPath = collection?.protoRootPath;
  const buildStatus = collection?.buildStatus;
  const buildError = collection?.buildError;

  const [selected, setSelected] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState<string[]>([]);
  const [draftRootPath, setDraftRootPath] = React.useState<string>('');

  const filepickerRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (filepaths) {
      setDraft([...filepaths]);
    }
  }, [filepaths]);

  React.useEffect(() => {
    if (rootPath) {
      setDraftRootPath(rootPath ?? '');
    }
  }, [rootPath]);

  if (!collection) return null;

  function handleFileInput(files: FileList | null): void {
    if (!files) return;

    dispatch(resetProtofileStatus(collectionName));

    const filepaths: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        filepaths.push(file.path);
      }
    }

    if (filepickerRef.current) {
      filepickerRef.current.value = '';
    }

    setDraft(Array.from(new Set([...draft, ...filepaths])).sort());
  }

  function handleFileDelete(): void {
    setDraft(
      Array.from(
        selected.reduce((s, path) => {
          s.delete(path);
          return s;
        }, new Set(draft)),
      ),
    );
    setSelected([]);
  }

  function tryBuilding(): void {
    dispatch(buildProtofiles(collectionName, draft, draftRootPath || undefined));
  }

  const triggerFileDialog = (): void => filepickerRef.current?.click();

  function handleToggle(filepath: string, checked: boolean): void {
    if (checked) {
      setSelected([...selected, filepath]);
    } else {
      const filtered = selected.filter(s => s !== filepath);
      setSelected([...filtered]);
    }
  }

  function handleGlobalToggle(checked: boolean): void {
    if (checked) {
      setSelected([...draft]);
    } else {
      setSelected([]);
    }
  }

  function handleCloseFM(): void {
    dispatch(closeFM());
  }

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>.proto files for {collectionName}</Typography.Title>
        <Button shape="circle" danger size="small" onClick={handleCloseFM}>
          <CloseOutlined />
        </Button>
      </div>

      <div style={{ marginBottom: 8 }}>
        <Input
          addonBefore="proto_path"
          value={draftRootPath}
          onChange={(e): void => setDraftRootPath(e.target.value)}
        />
      </div>

      {draft.length > 0 ? (
        <>
          <Checkbox
            indeterminate={0 < selected.length && selected.length < draft.length}
            checked={selected.length === draft.length}
            onChange={(b): void => handleGlobalToggle(b.target.checked)}
          />
          <span style={{ marginLeft: 8 }}>Check All</span>
          <Divider style={{ margin: '4px 0px', backgroundColor: 'darkgray' }} />
        </>
      ) : null}

      <Scrollable>
        <List
          dataSource={draft} // won't update by itself
          renderItem={(filepath): React.ReactNode => (
            <List.Item style={{ padding: '4px 0px', width: '100%' }}>
              <Row align="middle" style={{ width: '100%' }}>
                <Col span={1}>
                  <Checkbox
                    checked={selected.includes(filepath)}
                    onChange={(b): void => handleToggle(filepath, b.target.checked)}
                  />
                </Col>
                <Col span={23}>
                  <p style={{ width: '100%', marginLeft: 8, marginBottom: 0 }}>{filepath}</p>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Scrollable>
      <input
        type="file"
        accept=".proto"
        multiple
        hidden
        ref={filepickerRef}
        onChange={(e): void => handleFileInput(e.target.files)}
      />

      {buildStatus === 'failure' ? (
        <Alert message={buildError?.toString() || ' '} type="error" closeText="Close" />
      ) : null}
      {buildStatus === 'success' ? <Alert message="Build success!" type="success" closeText="Close" /> : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div>
          <Button onClick={triggerFileDialog}>
            <PlusOutlined />
          </Button>
          <Button onClick={handleFileDelete} danger style={{ marginLeft: 8 }} disabled={selected.length === 0}>
            Delete
          </Button>
        </div>
        <div>
          <Button
            onClick={tryBuilding}
            type="primary"
            style={{ marginLeft: 8 }}
            loading={buildStatus === 'building'}
            ghost
          >
            <BuildOutlined />
            Build and Save
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProtofileManager;
