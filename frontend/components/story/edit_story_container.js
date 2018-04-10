import React from 'react';
import { connect } from 'react-redux';
import StoryForm from './story_form';
import { fetchStory, updateStory, receiveErrors } from '../../actions/story_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    story: state.stories[ownProps.match.params.storyId],
    errors: state.errors.form,
    authorId: Object.keys(state.session.currentUser)[0]
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStory: (id) => dispatch(fetchStory(id)),
    action: story => dispatch(updateStory(story)),
    clearErrors: () => dispatch(receiveErrors([]))
  };
};

class EditStoryForm extends React.Component {
  componentDidMount () {
    this.props.fetchStory(this.props.match.params.storyId);
  }

  render () {
    if (!!this.props.story) {
    return (
      <StoryForm action={this.props.action}
        story={this.props.story} authorId={this.props.authorId} />
    );
  } else {
    return (<div>Loading...</div>);
  }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditStoryForm);
