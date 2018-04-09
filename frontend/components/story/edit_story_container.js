import React from 'react';
import { connect } from 'react-redux';
import StoryForm from './story_form';
import { fetchStory, updateStory } from '../../actions/story_actions';

const mapStateToProps = (state, ownProps) => {
  const defaultPost = {
    title: '',
    body: '',
    author_id: '0'
  };

  const story = state.stories[ownProps.match.params.storyId] || defaultPost;
  return { story }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStory: (id) => dispatch(fetchStory(id)),
    action: story => dispatch(updateStory(story))
  };
};
