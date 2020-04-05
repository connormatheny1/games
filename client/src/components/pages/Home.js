import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Home = props => {
    
    // useEffect(() => {
    //     axios.get('/api/get/users')
    //     .then(res => setState(res.data))
    //     .catch(err => console.log(err))
    // }, [])
    // const [state, setState] = useState('')
    // const [username, setUsername] = useState('')
    // const [password, setPassword] = useState('')

    // const submitForm = () => {
    //     const data = {
    //         password:password,
    //         username:username
    //     }
    //     axios.post("api/post/createuser", data)
    //         .then(res => console.log(res))
    //         .catch(err => console.log(err))
    // }

    

  return(
    <div>
      <p>This is the React version of the crazy 8s websocket game, has postgres db to store user information, express server, socket.io websocket client</p>
      
    </div>
 )
};

export default Home;