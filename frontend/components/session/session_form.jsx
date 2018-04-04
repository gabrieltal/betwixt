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
    this.props.processForm(user).then(this.props.closeModal);
  }

  update(field) {
    return (e) => this.setState({[field]: e.target.value})
  }

  render () {
    return (
      <div className='login-form-container'>
        <form onSubmit={this.handleSubmit} className={this.props.formType}>
          <button onClick={this.props.closeModal}>X</button>
          <br/>
          <h3>{this.props.headerMessage}</h3>
          <br/>
          <label> username:
            <input onChange={this.update('username')}
                type="text" value={this.state.username}/>
          </label>
          <br/>
        <label> password:
          <input onChange={this.update('password')} type="password" value={this.state.password}/>
        </label>
        <br/>
        <p className='formText'> {this.props.redirectPageMessage}
        {this.props.otherForm}
        </p>

        <br/>
        <input type="submit" value="Continue" />
      </form>
      </div>
    );
  }
}

export default withRouter(SessionForm);
