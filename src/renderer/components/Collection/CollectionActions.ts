type CreateCollection = {
  type: 'CREATE_COLLECTION';
  collectionName: string;
};

const CREATE_COLLECTION = 'CREATE_COLLECTION';

type ChangeCollectionName = {
  type: 'CHANGE_COLLECTION_NAME';
  collectionName: string;
  newName: string;
};

const CHANGE_COLLECTION_NAME = 'CHANGE_COLLECTION_NAME';

type DeleteCollection = {
  type: 'DELETE_COLLECTION';
  collectionName: string;
};

const DELETE_COLLECTION = 'DELETE_COLLECTION';

type ToggleCollections = {
  type: 'TOGGLE_COLLECTIONS';
  openCollections: string[];
};

const TOGGLE_COLLECTIONS = 'TOGGLE_COLLECTIONS';

type CreateFlow = {
  type: 'CREATE_FLOW';
  collectionName: string;
  flowName: string;
};

const CREATE_FLOW = 'CREATE_FLOW';

type SelectFlow = {
  type: 'SELECT_FLOW';
  collectionName: string;
  flowName: string;
};

const SELECT_FLOW = 'SELECT_FLOW';

type DeleteFlow = {
  type: 'DELETE_FLOW';
  collectionName: string;
  flowName: string;
};

const DELETE_FLOW = 'DELETE_FLOW';

type CloneFlow = {
  type: 'CLONE_FLOW';
  collectionName: string;
  originalFlowName: string;
  flowName: string;
};

const CLONE_FLOW = 'CLONE_FLOW';

type OpenFM = {
  type: 'OPEN_FM';
  collectionName: string;
};

const OPEN_FM = 'OPEN_FM';

type CloseFM = {
  type: 'CLOSE_FM';
};

const CLOSE_FM = 'CLOSE_FM';

type ReorderFlow = {
  type: 'REORDER_FLOW';
  collectionName: string;
  src: number;
  dst: number;
};

const REORDER_FLOW = 'REORDER_FLOW';

export const CollectionActionTypes = [
  CREATE_COLLECTION,
  CHANGE_COLLECTION_NAME,
  DELETE_COLLECTION,
  TOGGLE_COLLECTIONS,
  CREATE_FLOW,
  SELECT_FLOW,
  DELETE_FLOW,
  CLONE_FLOW,
  OPEN_FM,
  CLOSE_FM,
  REORDER_FLOW,
];

export type CollectionAction =
  | CreateCollection
  | ChangeCollectionName
  | DeleteCollection
  | ToggleCollections
  | CreateFlow
  | SelectFlow
  | DeleteFlow
  | CloneFlow
  | OpenFM
  | CloseFM
  | ReorderFlow;

export function createCollection(collectionName: string): CreateCollection {
  return {
    type: CREATE_COLLECTION,
    collectionName,
  };
}

export function changeCollectionName(collectionName: string, newName: string): ChangeCollectionName {
  return {
    type: CHANGE_COLLECTION_NAME,
    collectionName,
    newName,
  };
}

export function deleteCollection(collectionName: string): DeleteCollection {
  return {
    type: DELETE_COLLECTION,
    collectionName,
  };
}

export function toggleCollections(openCollections: string[]): ToggleCollections {
  return {
    type: TOGGLE_COLLECTIONS,
    openCollections,
  };
}

export function createFlow(collectionName: string, flowName: string): CreateFlow {
  return {
    type: CREATE_FLOW,
    collectionName,
    flowName,
  };
}

export function selectFlow(collectionName: string, flowName: string): SelectFlow {
  return {
    type: SELECT_FLOW,
    collectionName,
    flowName,
  };
}

export function deleteFlow(collectionName: string, flowName: string): DeleteFlow {
  return {
    type: DELETE_FLOW,
    collectionName,
    flowName,
  };
}

export function cloneFlow(collectionName: string, originalFlowName: string, flowName: string): CloneFlow {
  return {
    type: CLONE_FLOW,
    collectionName,
    originalFlowName,
    flowName,
  };
}

export function openFM(collectionName: string): OpenFM {
  return {
    type: OPEN_FM,
    collectionName,
  };
}

export function closeFM(): CloseFM {
  return {
    type: CLOSE_FM,
  };
}

export function reorderFlow(collectionName: string, src: number, dst: number): ReorderFlow {
  return {
    type: REORDER_FLOW,
    collectionName,
    src,
    dst,
  };
}
