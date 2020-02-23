import React from 'react';
import styled from 'styled-components';
import { Typography, List, Button, Icon, Row, Col, Checkbox, Divider } from 'antd';
import { useDispatch } from 'react-redux';
import { buildProtofiles } from './ProtofileManagerActions';
import { Collection } from '../../../models/Collection';

type Props = {
  collectionName: string;
  collection: Collection;
  onFinish: () => void;
};

const Wrapper = styled('div')`
  padding: 0px;
`;

const Scrollable = styled('div')`
  height: 350px;
  overflow: auto;
`;

const ProtofileManager: React.FunctionComponent<Props> = ({ collectionName, collection, onFinish }) => {
  const filepickerRef = React.useRef<HTMLInputElement>(null);

  const { protoFilepaths: filepaths, buildStatus, buildError } = collection;

  const [draft, setDraft] = React.useState([...filepaths]);
  React.useEffect(() => {
    setDraft([...filepaths]);
  }, [filepaths]);

  const [selected, setSelected] = React.useState<string[]>([]);

  const dispatch = useDispatch();

  function handleFileInput(files: FileList | null): void {
    if (!files) return;

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
    console.log('yo');
    dispatch(buildProtofiles(collectionName, draft));
  }

  function triggerFileDialog(): void {
    if (filepickerRef.current) {
      filepickerRef.current.click();
    }
  }

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

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>.proto files for {collectionName}</Typography.Title>
        <Button shape="circle" type="danger" size="small" ghost onClick={onFinish}>
          <Icon type="close" />
        </Button>
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
              <Row type="flex" style={{ alignItems: 'center', width: '100%' }}>
                <Col span={1}>
                  <Checkbox
                    checked={selected.includes(filepath)}
                    onChange={(b): void => handleToggle(filepath, b.target.checked)}
                  />
                </Col>
                <Col span={23}>
                  <span style={{ textOverflow: 'ellipsis', width: '100%', marginLeft: 8 }}>{filepath}</span>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Scrollable>
      <input type="file" multiple hidden ref={filepickerRef} onChange={(e): void => handleFileInput(e.target.files)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div>
          <Button onClick={triggerFileDialog}>
            <Icon type="plus" />
          </Button>
          <Button
            onClick={handleFileDelete}
            type="danger"
            style={{ marginLeft: 8 }}
            ghost
            disabled={selected.length === 0}
          >
            Delete
          </Button>
        </div>
        <div>
          <Button
            onClick={tryBuilding}
            type="primary"
            style={{ marginLeft: 8 }}
            ghost
            loading={buildStatus === 'building'}
          >
            <Icon type="build" />
            Build and Save
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProtofileManager;
