import React from "react";
import PropTypes from "prop-types";
import DbToStoreSyncer from "./DbToStoreSyncer";
import RoomStateReconciler from "./RoomStateReconciler";
import StoreToDbSyncer from "./StoreToDbSyncer";

export default function FirebasePlayerSyncContainer({ roomId }) {
  return (
    <div>
      <DbToStoreSyncer roomId={roomId} />
      <RoomStateReconciler />
      <StoreToDbSyncer roomId={roomId} />
    </div>
  );
}

FirebasePlayerSyncContainer.propTypes = {
  roomId: PropTypes.string.isRequired,
};
