
import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from  '../Messages/Messages';

import './Chat.css';
let socket;



const Chat = ({location}) => {
    const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
 
  const ENDPOINT = 'localhost:5000';
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);
    console.log(socket);

     socket.emit('join', { name, room }, () => {
    //   if(error) {
    //     alert(error);
    //   }
    });
    return () =>{

        socket.emit('disconnect');
        socket.off();
    }
  }, [ENDPOINT, location.search]);
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([ ...messages, message ]);
    });
    
    // socket.on("roomData", ({ users }) => {
    //   setUsers(users);
    // });
}, [messages]);
const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }
  console.log(message,messages);
//function for sendin msg
return(
    <div className="outerContainer">
    <div className="container">
    {/* <input
      
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    /> */}
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </div>
    
  </div>
)
 
}

export default Chat;
