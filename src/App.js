import React from "react";
import "./index.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Import Components
import PredictionContainer from "./components/Predictions/PredictionContainer";
import Login from "./components/Login/Login";
import NoMatch from "./components/NoMatch/NoMatch";

class App extends React.Component {
  render() {
    return (
      <Router>
          <Switch>
            <Route exact={true} path="/predictions/:id" component={PredictionContainer} />
            <Route path="/" component={Login} />
            <Route path="*" component={NoMatch} />
          </Switch>
      </Router>
    );
  }
}

export default App;

