import React from "react";
import DbToStoreSyncer from "./DbToStoreSyncer";
import RoomStateReconciler from "./RoomStateReconciler";

function FirebasePlayerSyncContainer(props) {
  return (
    <div>
      <DbToStoreSyncer />
      <RoomStateReconciler />
    </div>
  );
}

FirebasePlayerSyncContainer.propTypes = {};

export default FirebasePlayerSyncContainer;
