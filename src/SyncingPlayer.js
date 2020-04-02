import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import syncingPlayerApp from "./reducers";
import YoutubeLinkContainer from "./containers/YoutubeLinkContainer";

const store = createStore(syncingPlayerApp);

// !!! Temporary logging to observe changes in the store.
console.log(store.getState());
store.subscribe(() => console.log(store.getState()));

export default function SyncingPlayer() {
  return (
    <Provider store={store}>
      <YoutubeLinkContainer />
    </Provider>
  );
}
