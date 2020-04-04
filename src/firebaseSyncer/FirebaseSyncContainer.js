import React from "react";
import DbToStoreSyncer from "./DbToStoreSyncer";
import RoomStateReconciler from "./RoomStateReconciler";
import { StoreToDbSyncer } from "./StoreToDbSyncer";

function FirebasePlayerSyncContainer() {
  return (
    <div>
      <DbToStoreSyncer />
      <RoomStateReconciler />
      <StoreToDbSyncer />
    </div>
  );
}

export default FirebasePlayerSyncContainer;
