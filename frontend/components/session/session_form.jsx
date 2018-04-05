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
        <button className='x-close' onClick={this.props.closeModal}>X</button>

        <form onSubmit={this.handleSubmit} className='form-session'>

          <h3>{this.props.headerMessage}</h3>
          <br/>
          <label className="input-field"> Username
            <br/>
            <input onChange={this.update('username')}
                type="text" value={this.state.username}/>
          </label>
          <br/>
        <label className="input-field"> Password
          <br/>
          <input onChange={this.update('password')} type="password" value={this.state.password}/>
        </label>
        <br/>
        <input className="submit-button" type="submit" value="Continue" />
        <br/>

        <p className='formText'>{this.props.redirectPageMessage}{this.props.otherForm}
        </p>
      </form>
      </div>
    );
  }
}

export default withRouter(SessionForm);