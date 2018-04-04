import React from 'react';
import { withRouter } from 'react-router-dom';

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.closeModal(e);
    this.props.processForm(user);
  }

  update(field) {
    return (e) => this.setState({[field]: e.target.value})
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit} className={this.props.formType}>
        <button onClick={this.props.closeModal}>X</button>
        <br/>
        <h3>{this.props.headerMessage}</h3>
        <br/>
        <label> username:
          <input onChange={this.update('username')} type="text" value={this.state.username}/>
        </label>
        <br/>
        <label> password:
          <input onChange={this.update('password')} type="password" value={this.state.password}/>
        </label>
        <br/>
        {this.props.redirectPageMessage}<button onClick={()=>{this.props.closeModal(); this.props.otherForm();}}>{this.props.redirectPageText}</button>
        <br/><input type="submit" value="Continue" />
      </form>
    );
  }
}

export default withRouter(SessionForm);
