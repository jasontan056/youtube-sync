import React from "react";
import { createStore } from "redux";
import syncingPlayerApp from "./reducers";
import {
  PlaybackStates,
  setPlaybackState,
  seekTo,
  setVideoId
} from "./actions";

const store = createStore(syncingPlayerApp);

// Log the initial state
console.log(store.getState());

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
const unsubscribe = store.subscribe(() => console.log(store.getState()));

// Dispatch some actions
store.dispatch(setPlaybackState(PlaybackStates.PLAYING));
store.dispatch(seekTo(50));
store.dispatch(setVideoId("newVideoId"));

// Stop listening to state updates
unsubscribe();

export default function SyncingPlayer() {
  return <p>syncing player</p>;
}
