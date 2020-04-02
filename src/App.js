import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import SyncingPlayer from "./SyncingPlayer";

function App() {
  return (
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
  );
}

export default App;
