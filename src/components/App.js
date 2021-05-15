import '../styles/App.css';
import { Fragment, useEffect, useState } from 'react';
import firebase from '../config/firebase';
import Header from './Header';
import Form from './Form';
import getFormattedDate from './getFormattedDate';
import Message from './Message';
import MessageBoardListItem from './MessageBoardListItem';


function App() {
  // useState declarations
  const [ messages, setMessages ] = useState([]);
  const [ userNameInput, setUserNameInput ] = useState('');
  const [ userMessageInput, setUserMessageInput ] = useState('');
  const [ boards, setBoards ] = useState([]);
  const [ currentBoard, setCurrentBoard ] = useState('publicBoard');

  // selectors
  const formNameInput = document.getElementById('name');
  const formAnonymousCheck = document.getElementById('anonymous');
  const formMessageInput = document.getElementById('message');
  
  // database
  const dbRef = firebase.database().ref();
  const publicMessagesRef = firebase.database().ref(`${currentBoard}/messages`);

  // functions
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

  // useEffect hooks
  // boards update
  useEffect(() => {
    dbRef.on("value", (response) => {
      const newState = [];
      const data = response.val();
      for (let key in data) {
        newState.push({key: key, name: data[key]});
      }
      setBoards(newState);
    })
  }, [])

  // messages update
  useEffect(() => {
    publicMessagesRef.on("value", (response) => {
      const newState = [];
      const data = response.val();
      for (let key in data) {
        newState.unshift({key: key, details: data[key]})
      };
      setMessages(newState);
    })
  }, []);

  // page elements
  const boardsList = boards.map((board) => {
    return (
      <MessageBoardListItem key={board.key} boardName={board.name}/>
    )
  })

  const messagesList = messages.map((messageObject) => {
    return (
      <Message key={messageObject.key} content={messageObject} />
    )
  })

  return (
    <Fragment>
      <Header />

      <div className="wrapper">
        <Form submitEvent={handleSubmit} changeEvent={handleChange} nameValue={userNameInput} messageValue={userMessageInput} />
      </div>

      <main>
        <div className="wrapper mainContainer">

          <aside className="boardsListContainer">
            <h3 className="boardsListHeading">Available Message Boards</h3>
            <ul>
              {boardsList}
            </ul>
          </aside>

          <section className="messagesBoardContainer">
            <h3 className="messagesListHeading">Latest Messages</h3>
            <ul>
              {messagesList}
            </ul>
          </section>

        </div>
      </main>
    </Fragment>
  );
}

export default App;
