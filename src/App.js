import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import SyncingPlayer from "./SyncingPlayer";
import { Provider } from "react-redux";

function App({ store }) {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/room/:roomId">
            <SyncingPlayer />
          </Route>
          <Route path="/">
            <CreateRoom />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
