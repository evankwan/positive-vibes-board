import '../styles/App.css';
import { Fragment, useEffect, useState } from 'react';
import firebase from '../config/firebase';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSun, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Form from './Form';
import getFormattedDate from './getFormattedDate';
import Message from './Message';
import MessageBoardListItem from './MessageBoardListItem';

function App() {
  library.add(faSun, faCaretDown);
  // useState declarations
  const [ messages, setMessages ] = useState([]);
  const [ userNameInput, setUserNameInput ] = useState('');
  const [ userMessageInput, setUserMessageInput ] = useState('');
  const [ boards, setBoards ] = useState([]);
  const [ currentBoard, setCurrentBoard ] = useState('publicBoard');
  const [ expanded, setExpanded ] = useState(false);

  // selectors
  const formNameInput = document.getElementById('name');
  const formAnonymousCheck = document.getElementById('anonymous');
  const formMessageInput = document.getElementById('message');
  
  // database
  const dbRef = firebase.database().ref();
  const currentMessagesRef = firebase.database().ref(`${currentBoard}/messages`);

  // variables
  let currentBoardName = 'Public';

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
    currentMessagesRef.push({message: submittedMessage, name: submittedName, date: submittedDate});
  }

  const handleFormClick = () => {
    if (expanded) {
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }

  const handleBoardChange = (key) => {
    setCurrentBoard(key);
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
      currentBoardName = data[currentBoard].topicName;
      console.log(currentBoardName);
      setBoards(newState);
    })
  }, [])

  // messages update
  useEffect(() => {
    currentMessagesRef.on("value", (response) => {
      const newState = [];
      const data = response.val();
      for (let key in data) {
        newState.unshift({key: key, details: data[key]})
      };
      setMessages(newState);
    })
  }, [currentBoard]);

  // page elements
  const boardsList = boards.map((board) => {
    return (
      <MessageBoardListItem 
        key={board.key} 
        boardName={board} 
        clickEvent={(key) => {
          handleBoardChange(key);
        }} 
      />
    )
  })

  const messagesList = messages.map((messageObject) => {
    return (
      <Message key={messageObject.key} content={messageObject} />
    )
  })

  return (
    <Fragment>
      <script src="https://kit.fontawesome.com/7627ee882a.js" crossorigin="anonymous"></script>
      <Header />
      <main>
        <div className="wrapper mainContainer">
          <aside className="boardsListContainer">
            <h3 className="boardsListHeading">Message Boards</h3>
            <ul>
              {boardsList}
            </ul>
          </aside>

          <div className="messageBoard">
            <Form 
              changeEvent={handleChange} 
              expandForm={handleFormClick}
              submitEvent={handleSubmit} 
              messageValue={userMessageInput} 
              nameValue={userNameInput}
              isExpanded={expanded}
            />

            <section className="messagesBoardContainer">
              <h3 className="messagesListHeading">Latest Messages on {currentBoardName} Board</h3>
              <ul>
                {messagesList}
              </ul>
            </section>
          </div>
        </div>
        {/* wrapper ended */}
      </main>
    </Fragment>
  );
}

export default App;
