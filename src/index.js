import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import NotePage from './components/notePage';
import HomePage from './components/homePage';
import {
  auth, provider, fetchBoardList,
} from './services/datastore';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      user: null,
      boards: null,
    };
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const { photoURL, displayName, uid } = user;
        this.setState({ user: { photoURL, displayName, uid } });
        fetchBoardList(user.uid, (boards) => {
          this.setState({ boards });
        });
      }
    });
  }

  getRoutes() {
    if (this.state.boards != null) {
      return Object.entries(this.state.boards).map(([key]) => (
        <Route key={key} path={`/${key}`}>
          <NotePage id={key} user={this.state.user} />
        </Route>
      ));
    }
    return null;
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null,
        boards: null,
      });
    });
  }

  render() {
    return (
      <Router>
        <div id="mainBoard">
          <Switch>
            <Route exact path="/">
              <HomePage user={this.state.user}
                login={() => auth.signInWithPopup(provider)}
                logout={this.logout}
                boards={this.state.boards}
              />
            </Route>
            {this.getRoutes()}
          </Switch>
        </div>
      </Router>

    );
  }
}
ReactDOM.render(<App />, document.getElementById('main'));
