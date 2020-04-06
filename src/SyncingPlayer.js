import React from "react";
import YoutubeLinkContainer from "./containers/YoutubeLinkContainer";
import YoutubeContainer from "./containers/YoutubeContainer";
import FirebasePlayerSyncContainer from "./firebaseSyncer/FirebaseSyncContainer";
import { useParams } from "react-router-dom";

export default function SyncingPlayer() {
  const { roomId } = useParams();
  return (
    <div>
      <YoutubeLinkContainer />
      <YoutubeContainer />
      <FirebasePlayerSyncContainer roomId={roomId} />
    </div>
  );
}
