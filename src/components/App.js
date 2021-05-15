import '../styles/App.css';
import { Fragment, useEffect, useState } from 'react';
import firebase from '../config/firebase';
import Header from './Header';
import Form from './Form';
import getFormattedDate from './getFormattedDate'


function App() {
  // useState declarations
  const [ messages, setMessages ] = useState([]);
  const [ userNameInput, setUserNameInput ] = useState('');
  const [ userMessageInput, setUserMessageInput ] = useState('');

  // selectors
  const formNameInput = document.getElementById('name');
  const formAnonymousCheck = document.getElementById('anonymous');
  const formMessageInput = document.getElementById('message');
  

  const dbRef = firebase.database().ref();
  const publicMessagesRef = firebase.database().ref('public-board/messages');

  const handleChange = ({ target }) => {
    if (target.id === "name") {
      setUserNameInput(target.value);
    } else if (target.id === "message") {
      setUserMessageInput(target.value);
    }
    
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const submittedMessage = formMessageInput.value;
    const submittedName = formAnonymousCheck.checked ? "Anonymous" : formNameInput.value;
    const newDate = new Date();
    const submittedDate = getFormattedDate(newDate);

    // update the userInput state
    setUserNameInput('');
    setUserMessageInput('');

    // update the database
    publicMessagesRef.push({message: submittedMessage, name: submittedName, date: submittedDate});
  }

  

  useEffect(() => {
    publicMessagesRef.on("value", (response) => {
      const newState = [];
      const data = response.val();
      for (let key in data) {
        newState.unshift(data[key])
      };
      setMessages(newState);
    })
  }, []);

  return (
    <Fragment>
      <Header />

      <div className="wrapper">
        <Form submitEvent={handleSubmit} changeEvent={handleChange} nameValue={userNameInput} messageValue={userMessageInput} />
      </div>

      <ul>
        {
          messages.map((messageObject) => {
            return (
              <li>
                <p>Post by: {messageObject.name} on {messageObject.date}</p>
                <p>{messageObject.message}</p>
              </li>
            )
          })
        }
      </ul>
      
      
    </Fragment>
  );
}

export default App;
