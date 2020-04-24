import React from 'react';

type Props = {
  collectionName: string;
  onFix: () => void;
};

const BuildFailureWarning: React.FC<Props> = ({ collectionName, onFix }) => {
  return (
    <>
      <span>{`.proto files in collection ${collectionName} cannot be built!`}</span>
      <a style={{ marginLeft: 8 }} onClick={onFix}>
        Fix
      </a>
    </>
  );
};

export default BuildFailureWarning;
