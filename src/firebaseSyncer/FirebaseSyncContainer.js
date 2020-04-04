import React from "react";
import DbToStoreSyncer from "./DbToStoreSyncer";
import RoomStateReconciler from "./RoomStateReconciler";
import { StoreToDbSyncer } from "./StoreToDbSyncer";

function FirebasePlayerSyncContainer(props) {
  return (
    <div>
      <DbToStoreSyncer />
      <RoomStateReconciler />
      <StoreToDbSyncer />
    </div>
  );
}

FirebasePlayerSyncContainer.propTypes = {};

export default FirebasePlayerSyncContainer;
