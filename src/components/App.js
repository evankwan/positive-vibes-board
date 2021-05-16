import '../styles/App.css';
import { Fragment, useEffect, useState } from 'react';
import firebase from '../config/firebase';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSun, faCaretDown, faCheckSquare, faSquare, faHeart } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Form from './Form';
import getFormattedDate from './getFormattedDate';
import Message from './Message';
import MessageBoardListItem from './MessageBoardListItem';

function App() {
  library.add(faSun, faCaretDown, faCheckSquare, faSquare, faHeart);
  // useState declarations
  const [ messages, setMessages ] = useState([]);
  const [ userNameInput, setUserNameInput ] = useState('');
  const [ userMessageInput, setUserMessageInput ] = useState('');
  const [ boards, setBoards ] = useState([]);
  const [ currentBoard, setCurrentBoard ] = useState('publicBoard');
  const [ currentBoardName, setCurrentBoardName] = useState('Public Board');
  const [ newBoardInput, setNewBoardInput ] = useState('');
  const [ expanded, setExpanded ] = useState(false);
  const [ anonymousChecked, setAnonymousChecked ] = useState(false);

  // selectors
  const formNameInput = document.getElementById('name');
  const formAnonymousCheck = document.getElementById('anonymous');
  const formMessageInput = document.getElementById('message');
  const formNewBoard = document.getElementById('boardName');
  
  // database
  const dbRef = firebase.database().ref();
  const currentMessagesRef = firebase.database().ref(`${currentBoard}/messages`);

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
    currentMessagesRef.push({message: submittedMessage, name: submittedName, date: submittedDate, likes: 0});
  }

  const handleAnonCheck = () => {
    if (!anonymousChecked) {
      setAnonymousChecked(true)
    } else {
      setAnonymousChecked(false)
    }
  }

  const handleLike = async (key) => {
    const dbResponse = await currentMessagesRef.child(`${key}`).get(`likes`);
    const message = dbResponse.toJSON();
    const { likes } = message;
    currentMessagesRef.child(`${key}`).update({likes: (likes + 1)});
  }

  const handleFormClick = () => {
    if (!expanded) {
      setExpanded(true)
    } else {
      setExpanded(false)
    }
  }

  const handleBoardChange = async (key) => {
    setCurrentBoard(key);
    const dbResponse = await dbRef.child(key).get(`topicName`);
    const board = await dbResponse.toJSON();
    const { topicName } = board;
    setCurrentBoardName(topicName);
  }

  const handleNewBoardChange = ({ target }) => {
    setNewBoardInput(target.value);
  }

  const handleNewBoardSubmit = (event) => {
    event.preventDefault();

    const submittedBoardName = formNewBoard.value;
    console.log(submittedBoardName);

    // update the userInput state
    setNewBoardInput('');

    // update the database
    dbRef.push({ topicName: submittedBoardName, messages: {} });
  }

  // useEffect hooks
  // boards update
  useEffect(() => {
    dbRef.on("value", (response) => {
      const newState = [];
      const data = response.val();
      for (let key in data) {
        newState.unshift({key: key, name: data[key]});
      }
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
  }, []);

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
      <Message key={messageObject.key} content={messageObject} updateLikes={handleLike}/>
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
            <div className="boardFormContainer">
              <form action="submit" className="newBoardForm" onSubmit={handleNewBoardSubmit}>
                <label htmlFor="name" className="srOnly">Add A New Message Board</label>
                <input
                  id="boardName"
                  className="boardNameInput"
                  type="text"
                  placeholder="Add New Message Board"
                  autoComplete="off"
                  value={newBoardInput}
                  onChange={handleNewBoardChange}
                  required
                />
                <input
                  type="submit"
                  value="Add New Board"
                  className="submitButton boardSubmit"
                />
              </form>
            </div>
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
              switchCheckbox={handleAnonCheck}
              isChecked={anonymousChecked}
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