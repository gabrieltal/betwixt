import React from 'react';
import UserDetailPaneContainer from '../user/user_detail_pane_container';

class UsersSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: this.props.searchParams,
      errors: []
    }
  }

  componentDidMount() {
    this.props.searchTaggedUsers(this.props.searchParams);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors.length === 1) {
      this.setState({
        errors: nextProps.errors
      });
    }

    if (this.props.searchParams !== nextProps.searchParams) {
      this.props.clearErrors();
      this.props.searchTaggedUsers(nextProps.searchParams);
      this.setState({
        errors: []
      })
    }
  }

  render () {
    if (Object.keys(this.props.users).length === 0 || this.state.errors.length === 1) {
      return (
        <h2 id="no-results">
          No results found
        </h2>
      );
    } else {
      let users = Object.values(this.props.users).map((user) => (
        <li><UserDetailPaneContainer authorId={user.id}/></li>
      ));

      return (
        <ul className="users">
          {users}
        </ul>
      )
    }
  }
}

export default UsersSearch;
