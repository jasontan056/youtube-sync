import React from "react";
import { createStore } from "redux";
import syncingPlayerApp from "./reducers";

const store = createStore(syncingPlayerApp);

export default function SyncingPlayer() {
  return <p>syncing player</p>;
}
