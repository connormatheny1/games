import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './components/pages/Home';
import Navigation from "./components/nav/Navigation";
import Crazy from "./components/crazy/Crazy";
import LoginModal from "./components/panels/LoginModal"
import RegisterModal from "./components/panels/RegisterModal"
import UserSettings from "./components/pages/UserSettings"
import UserProfile from "./components/pages/UserProfile"
import Footer from "./components/panels/Footer"
import GamePage from "./components/crazy/game/GamePage"
import Rooms from "./components/crazy/rooms/Rooms"
import axios from "axios"
//import socketIOClient from 'socket.io-client'
//import socket from "./socketconnect";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import { useRouteMatch } from 'react-router'


const App = () => {
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [gameswon, setGamesWon] = useState(0)
  const [gamesplayed, setGamesPlayed] = useState(0)
  const [avatar, setAvatar] = useState(null)
  const [roomInfo, setRoomInfo] = useState()

  function usePersistedState(key, def){
    const [user, setUser] = useState(
      () => JSON.parse(localStorage.getItem(key)) || def
    );
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(user));
    }, [key, user]);
    return [user, setUser];
  }

  const [user, setUser] = usePersistedState('user', {
    username: 'unauth',
    email: '',
    isLoggedIn: false,
    gamesplayed: 0,
    gameswon: 0,
    avatar: null,
    uid: null,
    room_id: null,
    socket_id: null,
    roomCreator: false,
  });

  const [loginModal, toggleLoginModal] = useState(false)
  const [registerModal, toggleRegisterModal] = useState(false)
  const [tokenList, setTokenList] = useState()

  const login = (bool) => {
    setIsLoggedIn(bool)
  }

  const updateGrandparent = (val) => {
    if(registerModal){
      toggleRegisterModal(false);
    }
    toggleLoginModal(val) 
  }

  const updateRegisterModal = (val) => {
    if(loginModal){
      toggleLoginModal(false)
    }
    toggleRegisterModal(val)
  }

  const userAuthed = (res) => {
    console.log(res);
    if(res.data.auth){
      setUser({
        username: res.data.rows.username,
        isLoggedIn: res.data.rows.logged_in,
        email: res.data.rows.email,
        gameswon: res.data.rows.games_won,
        gamesplayed: res.data.rows.games_played,
        avatar: res.data.rows.avatar,
        socket_id: res.data.rows.socket_id,
        room_id: res.data.rows.room_id,
        uid: res.data.rows.uid,
        roomCreator: false,
      })
    }
    
  }

  const logout = () => {
    //setIsLoggedIn(false);
    axios.post('/users/logout', { username: user.username, rid: user.room_id, creator: user.roomCreator })
      .then(res => userAuthed(res))
      .catch(err => console.log(err))
    localStorage.removeItem('user')
    window.location.href = "/"
  }

  const updateAvatar = (val) => {
    setUser({
      username: user.username,
      isLoggedIn: user.isLoggedIn,
      email: user.email,
      token: user.token,
      gameswon: user.gameswon,
      gamesplayed: user.gamesplayed,
      avatar: val,
      uid: user.id,
      room_id: useEffect.room_id,
      roomCreator: user.roomCreator
    })
    window.location.reload()
  }

  const updateUserRoom = (res) => {
    console.log(res)
    setUser({
      username: user.username,
      isLoggedIn: user.isLoggedIn,
      email: user.email,
      gameswon: user.gameswon,
      gamesplayed: user.gamesplayed,
      avatar: user.avatar,
      socket_id: user.socket_id,
      room_id: res.data.rid,
      uid: user.id,
      roomCreator: res.data.creator
    })
    window.location.reload();

    // axios.get(`/crazy/rooms/${user.room_id}`)
    //   .then(res => setRoomInfo(res))
    //   .catch(err => console.log(err))
  }

  return (
    <Router>
      <Navigation updateApp={updateGrandparent} isLoggedIn={user.isLoggedIn} logout={logout} updateReg={updateRegisterModal} registerOpen={registerModal} loginOpen={loginModal} user={user} localToken={localStorage.jwtToken}/>
        <Route exact path="/" component={Home} />
        <Route 
          path="/crazy/rooms"
          render={
            (props) => <Crazy {...props} user={user} updateUserRoom={updateUserRoom} roomInfo={roomInfo}/>
          }
        />
        <Route 
          path="/crazy/rooms/:roomId"
          render={
            (props) => <Crazy {...props} user={user} updateUserRoom={updateUserRoom} roomInfo={roomInfo}/>
          }
        />
        {/* <Route path="'/crazy/rooms/:roomId'" render={
          (props) => <Crazy {...props} roomId={user.room_id} user={user}/>
        }>
        </Route> */}
        <Route path="/settings" component={UserSettings} />
        <Route 
          path="/profile" 
          render={
            (props) => <UserProfile {...props} user={user} updateAvatar={updateAvatar}/>
          } 
        />
      <LoginModal updateUser={userAuthed} updateApp={updateGrandparent} isOpen={loginModal}/>
      <RegisterModal updateUser={userAuthed} isOpen={registerModal} updateApp={updateRegisterModal}/>
      <Footer></Footer>
    </Router>
  );
}

export default App;