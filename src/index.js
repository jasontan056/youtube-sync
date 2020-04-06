import React from "react";
import ReactDOM from "react-dom";
import "./assets/main.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore } from "redux";
import reducers from "./reducers";
import { setRoomId } from "./actions";

const store = createStore(reducers);

// !!! Temporary logging to observe changes in the store.
console.log(store.getState());
store.subscribe(() => console.log(store.getState()));

ReactDOM.render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
