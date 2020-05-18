import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch } from 'react-router-dom';
import MainMenu from './scenes/MainMenu';
import Singleplayer from './scenes/Singleplayer';
import Leaderboard from './scenes/Leaderboard';

const Routes = () => (
  <Switch>
    <Route component={MainMenu} path="/" exact />
    <Route component={Singleplayer} path="/game" exact />
    <Route component={Leaderboard} path="/leaderboard" exact />
    <Route component={MainMenu} />
  </Switch>
);

export default hot(module)(Routes);
