import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import Room from "./Room";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/room/:roomId">
          <Room />
        </Route>
        <Route path="/">
          <CreateRoom />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
