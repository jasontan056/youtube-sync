import React from "react";
import YoutubeLinkContainer from "./containers/YoutubeLinkContainer";
import YoutubeContainer from "./containers/YoutubeContainer";
import FirebasePlayerSyncContainer from "./firebaseSyncer/FirebaseSyncContainer";

export default function SyncingPlayer() {
  return (
    <div>
      <YoutubeLinkContainer />
      <YoutubeContainer />
      <FirebasePlayerSyncContainer />
    </div>
  );
}
