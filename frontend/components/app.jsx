import React from 'react';
import NavContainer from './nav/nav_container';
import { Route, Link, Switch } from 'react-router-dom';
import Modal from './modal/modal';
import UserShowContainer from './user/user_show_container';
import StoryIndexContainer from './story/story_index_container';
import StoryShowContainer from './story/story_show_container';
import { ProtectedRoute } from '../util/route_util';
import NewStoryContainer from './story/new_story_container';
import EditStoryContainer from './story/edit_story_container';

const App = () => (
  <div>
    <Modal />
    <header>
      <a className="about" href={'https://github.com/gabrieltal/betwixt'}>About</a>

      <Link to="/" className="header-Link">
        <h1>Betwixt</h1>
      </Link>
      <NavContainer />
    </header>
    <Switch>
      <ProtectedRoute exact path="/story/new" component={NewStoryContainer} />
      <ProtectedRoute exact path="/story/:storyId/edit" component={EditStoryContainer}/>
      <Route exact path="/story/:storyId" component={StoryShowContainer} />


      <Route exact path="/user/:userId" component={UserShowContainer} />
      <Route exact path="/" component={StoryIndexContainer} />
    </Switch>
  </div>
);

export default App;
