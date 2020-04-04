import React from "react";
import DbChangeSyncer from "./DbChangeSyncer";
import RoomStateReconciler from "./RoomStateReconciler";

function FirebasePlayerSyncContainer(props) {
  return (
    <div>
      <DbChangeSyncer />
      <RoomStateReconciler />
    </div>
  );
}

FirebasePlayerSyncContainer.propTypes = {};

export default FirebasePlayerSyncContainer;
