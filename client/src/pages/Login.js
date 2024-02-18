import React, { useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import { Container, Row, Col, Dropdown, NavLink, Button, } from 'react-bootstrap'
import apiUtil from '../utils/apiUtil'
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions';
import Notice from '../components/Notice'
import { Link } from "react-router-dom";
import { TailSpin } from  'react-loader-spinner'
import styles from '../styles/pages.css';

export default function Login(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [ params ] = useSearchParams()

  //form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // TODO: expand this validation & use it
  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  // TODO: add some sort of loading symbol when waiting for a response
  async function authenticateUser(user){
    const response = await apiUtil('post', 'users/login', { dispatch: dispatch, navigate: navigate}, user)
    setLoading(false)
    setMessage(response.message ? response.message : "")
    setError(response.error)
    if (response.status === 200) {
      dispatch(login(response.data.user, response.data.status))
      try {
        navigate(params.get('redirect'))
      }
      catch(e) {
        navigate('/')
      }
    }
}
class LoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      rawPassword: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit() {
  event.preventDefault();
  setLoading(true)
  const user = {
    email: this.state.email,
    rawPassword: this.state.rawPassword,
  }
  authenticateUser(user);
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>

        <input type="text" name="email"
          value={this.state.email} onChange={this.handleChange}
          className="inputContainer emailContainer" placeholder="Email Address"
        />
        <input type="password" name="rawPassword"
          value={this.state.rawPassword} onChange={this.handleChange}
          className="inputContainer passwordContainer" placeholder= "Password"
        />

        <Link className="changePasswordLink" to="/reset">Forgot your password?</Link>
        {message != "" && error && <Notice message={message} error={error ? "error" : ""}/>}

        <input type="submit" value="Log in" className= "submitButton" />

        <p className='orSSOText'> or </p>

        <input type="submit" value="Continue with SSO" className= "ssoButton" />
      </form>)
  }
}

  return (
    <div id="login">
      <div className='leftContainer'>
        <div className= 'welcomeBox'>
          <span className='classroomLink'>
            <img className="classroomIcon" src="classroomIcon.png" />
            {process.env.REACT_APP_NAME}
          </span>
          <div className='textBox'>
            <p className='mainText'> Welcome Back! </p>
            <p className='subText'> New user? </p>
          </div>
          <div className='linkBox'>
            <button className='homeButton'> Return to home </button>
          </div>
        </div>
      </div>

      <div className='rightContainer'>
        <div className='loginSection'>
          <p className='mainText'> Log in </p>

          <LoginForm />

        </div>
      </div>
    </div>
  );
}