import { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Login from "./page/login/Login";
import Messenger from "./page/messenger/Messenger";
import { Register } from "./page/register/Register";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path="/"></Route>

        <Route path="/login">
          {user ? <Redirect to="/messenger" /> : <Login />}
        </Route>

        <Route path="/register">
          {user ? <Redirect to="/messenger" /> : <Register />}
        </Route>

        <Route path="/messenger">
          {user ? <Messenger /> : <Register />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
