import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from "../static/e.png";
import { Button, Modal, makeStyles, Input } from '@material-ui/core';
import { string } from 'prop-types';

const BASE_URL = 'http://localhost:8000/';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))



export const SignUp=(event)=>{
    event?.preventDefault();

    const classes = useStyles();

  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authToken, setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('')

  useEffect(() => {
    setAuthToken(window.localStorage.getItem('authToken'));
    setAuthTokenType(window.localStorage.getItem('authTokenType'))
    setUsername(window.localStorage.getItem('username'))
    setUserId(window.localStorage.getItem('userId'))
  }, [])

  useEffect(() => {
    authToken
      ? window.localStorage.setItem('authToken', authToken)
      : window.localStorage.removeItem('authToken')
    authTokenType
      ? window.localStorage.setItem('authTokenType', authTokenType)
      : window.localStorage.removeItem('authTokenType')
    username
      ? window.localStorage.setItem('username', username)
      : window.localStorage.removeItem('username')
    userId
      ? window.localStorage.setItem('userId', userId)
      : window.localStorage.removeItem('userId')

  }, [authToken, authTokenType, userId])

    const json_string = JSON.stringify({
      username: string,
      email: email,
      password: password
    })

    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_string
    }

    fetch(BASE_URL + 'user/', requestOption)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })


    setOpenSignUp(false)
  return (
    <div>

      <div style={modalStyle} className={classes.paper}>
        <form className="app_signin">
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} />
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <Button
            type="submit"
            onClick={SignUp}>Sign up</Button>
        </form>
      </div>

    </div>
  );
};