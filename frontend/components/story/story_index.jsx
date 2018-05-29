import React from 'react';
import StoryIndexItem from './story_index_item';
import { Link } from 'react-router-dom';

class StoryIndex extends React.Component {
  componentDidMount () {
    this.props.fetchStories();

    let nav = document.getElementById("mainTags");
    nav.style.display="block";
    let sticky = nav.offsetTop;
    window.onscroll = () => {
      if (window.pageYOffset >= sticky) {
        nav.classList.add("sticky");
      } else {
        nav.classList.remove("sticky");
      }
    }
  }

  render () {
    let stories;
    if (!!this.props.currentUser && !!this.props.storiesList.length) {
      stories = this.props.storiesList
    } else {
      stories = Object.values(this.props.stories);
    }
    let featureItems = [];
    let storyItems = [];
    stories.forEach((story, i) => {
      i < 3 ?
        featureItems.push(<StoryIndexItem key={story.id}
        story={story} feature='feature' />) :

        storyItems.push(<StoryIndexItem key={story.id}
          story={story} feature=""/>);
    });
    return (
      <main>
      <nav id="mainTags">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search/pizza">Pizza</Link></li>
          <li><Link to="/search/books">Books</Link></li>
          <li><Link to="/search/sciencefiction">ScienceFiction</Link></li>
          <li><Link to="/search/horror">Horror</Link></li>
          <li><Link to="/search/fantasy">Fantasy</Link></li>
          <li><Link to="/search/ ">More</Link></li>
        </ul>
      </nav>
      <ul className="story-index features">
        {featureItems}
      </ul>
      <ul className="story-index">
        {storyItems}
      </ul>
      </main>
    );
  }
}

export default StoryIndex;
