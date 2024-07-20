import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Button, Modal, makeStyles, Input } from '@material-ui/core';

import './App.css';
import HeadPage from './components/HeadPage';
import Navbar from './components/Navbar';
import Login from "./components/login";
import Community from './components/Community';
import { Signup } from './components/Signup';
import {Bazaar} from './components/Bazaar';
import {User} from './components/User';
import {Market} from './components/Market';
import {Cropchecker} from './components/Cropchecker';
import Weather from './components/Weather';

const BASE_URL = 'http://localhost:8000/'

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


function App() {
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

  const signIn = (event) => { 
    event?.preventDefault();

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const requestOptions = {
      method: 'POST',
      body: formData
    }

    fetch(BASE_URL + 'login', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        console.log(data);
        setAuthToken(data.access_token)
        setAuthTokenType(data.token_type)
        setUserId(data.user_id)
        setUsername(data.username)
      })
      .catch(error => {
        console.log(error);
        alert(error)
      })

    setOpenSignIn(false);
  }

  const signOut = (event) => {
    setAuthToken(null)
    setAuthTokenType(null)
    setUserId('')
    setUsername('')
  }

  const signUp = (event) => {
    event?.preventDefault();

    const json_string = JSON.stringify({
      username: username,
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
      .then(data => {
        // console.log(data);
        signIn();
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })


    setOpenSignUp(false)
  }

  const nft = (event) => {}


  
  const PrivateRoute = ({ path, element }) => {
    const token = localStorage.getItem('token');
  
    // If token is not present, redirect to the registration page
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  
    // Otherwise, render the provided element
    return element;
  };
  
  const PublicRoute = ({ path, element }) => {
    const token = localStorage.getItem('token');
  
    // If token is present, redirect to the sidebar
    if (token) {
      return <Navigate to="/User" replace />;
    }
  
    // Otherwise, render the provided element
    return element;
  };
  return (
    <>
    <Router>
    <Navbar/>
    <Routes>
            <Route exact path="/community" element={<Community />}/>
            <Route exact path="/Bazaar" element={<Bazaar />}/>
            <Route exact path="/Market" element={<Market/>}/>
            <Route exact path="/Cropchecker" element={<Cropchecker/>}/>
            <Route exact path="/" element={<HeadPage />}/>
             <Route exact path="/User" element={<PrivateRoute element={<User />} />} />
            <Route exact path="/Signup" element={<PublicRoute element={<signUp />} />} />
            <Route exact path="/login" element={<PublicRoute element={<Login />} />} />
            <Route exact path="/Weather" element={<Weather/>}/>
    </Routes>
    </Router>
    <div>

    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}>

      <div style={modalStyle} className={classes.paper}>
        <form className="app_signin">
          {/* <center>
            <img className="app_headerImage"
              src="https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png"
              alt="Instagram"/>
          </center> */}
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <Button
            type="submit"
            onClick={signIn}>Login</Button>
        </form>
      </div>

    </Modal>

    <Modal
      open={openSignUp}
      onClose={() => setOpenSignUp(false)}>

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
            onClick={signUp}>Sign up</Button>
        </form>
      </div>

    </Modal>


    <div className="app_header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
  {authToken ? (
    <div>
      <p>Number of Items Scanned: 0</p>
      <Button onClick={() => nft()}>Badges Earned</Button>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  ) : (
    <div>
      <Button onClick={() => setOpenSignIn(true)}>Login</Button>
      <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
    </div>
  )}
</div>

      {/* <div className="app_posts">
        {
          posts.map(post => (
            <Post
              post = {post}
              authToken={authToken}
              authTokenType={authTokenType}
              username={username}
            />
          ))
        }
      </div> */}

      {/* {
        authToken ? (
          <ImageUpload
            authToken={authToken}
            authTokenType={authTokenType}
            userId={userId}
          />
        ) : (
          <h3>You need to login to upload</h3>
        )
      } */}
    </div>
    </>
  );
}

export default App;