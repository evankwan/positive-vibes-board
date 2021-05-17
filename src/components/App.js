import '../styles/App.css';
import { Fragment, useEffect, useState } from 'react';
import firebase from '../config/firebase';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSun, faCaretDown, faCheckSquare, faSquare, faHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import Form from './Form';
import getFormattedDate from './getFormattedDate';
import clearArray from './clearArray';
import Message from './Message';
import MessageBoardListItem from './MessageBoardListItem';

function App() {
  // adding fontawesome icons globally
  library.add(faSun, faCaretDown, faCheckSquare, faSquare, faHeart, faComment);

  // database references
  const dbRef = firebase.database().ref();

  // useState declarations
  const [ messages, setMessages ] = useState([]);
  const [ userNameInput, setUserNameInput ] = useState('');
  const [ userMessageInput, setUserMessageInput ] = useState('');
  const [ boards, setBoards ] = useState([]);
  const [ currentBoard, setCurrentBoard ] = useState(`-M_qnb3Aah2p0BDqMmgq`);
  const [ currentBoardName, setCurrentBoardName] = useState('Public');
  const [ newBoardInput, setNewBoardInput ] = useState('');
  const [ expanded, setExpanded ] = useState(false);
  const [ anonymousChecked, setAnonymousChecked ] = useState(false);
  const [ addingNewBoard, setAddingNewBoard ] = useState(false);
  const [ commentFormExpanded, setCommentFormExpanded ] = useState([]);
  const [ comments, setComments ] = useState([]);
  const [ userCommentNameInput, setUserCommentNameInput ] = useState([]);
  const [ userCommentMessageInput, setUserCommentMessageInput ] = useState([]);

  // selectors
  const formNameInput = document.getElementById('name');
  const formAnonymousCheck = document.getElementById('anonymous');
  const formMessageInput = document.getElementById('message');
  const formNewBoard = document.getElementById('boardName');
  const commentFormNameInput = document.getElementById('commentName');
  const commentFormAnonymousCheck = document.getElementById('commentAnonymous');
  const commentFormMessageInput = document.getElementById('commentMessage');

  // second database reference using the currentboard state
  const currentMessagesRef = firebase.database().ref(`${currentBoard}/messages`);
  const currentCommentsRef = firebase.database().ref(`${currentBoard}/comments`);

  // functions
  // handles change of value in the new message form
  const handleChange = ({ target }) => {
    // depending on the field, set the state accordingly
    if (target.id === "name") {
      setUserNameInput(target.value);
    } else if (target.id === "message") {
      setUserMessageInput(target.value);
    } else if (target.id === "commentName") {
      setUserCommentNameInput(target.value);
    } else if (target.id === "commentMessage") {
      setUserCommentMessageInput(target.value);
    }
  }

  // handles new message submit in the new message form
  const handleSubmit = (event) => {
    // prevent reloading the page
    event.preventDefault();
    
    // grab values from the form and format dates
    const submittedMessage = formMessageInput.value;
    const submittedName = formAnonymousCheck.checked ? "Anonymous" : formNameInput.value;
    const newDate = new Date();
    const submittedDate = getFormattedDate(newDate);

    // update the userInput states
    setUserNameInput('');
    setUserMessageInput('');

    // update the database
    currentMessagesRef.push({message: submittedMessage, name: submittedName, date: submittedDate, likes: 0});

    // set focus on form again
    formNameInput.focus();
  }

  // handles hitting enter when focused on anonymous label/checkbox
  const handleEnterAnonymous = ({ key }) => {
    console.log('keydown');

    if (key === 'Enter') {
      console.log('check');
      handleAnonCheck();
    }
  }

  // handles if anonymous is checked and updates the checkbox icon
  const handleAnonCheck = () => {
    if (!anonymousChecked) {
      setAnonymousChecked(true)
    } else {
      setAnonymousChecked(false)
    }
  }

  // handles liking a message on any board
  const handleLike = async (key) => {
    // retrieve number of likes from database
    const dbResponse = await currentMessagesRef.child(`${key}`).get(`likes`);
    const message = dbResponse.toJSON();
    const { likes } = message;

    // update the likes value in the database
    currentMessagesRef.child(`${key}`).update({likes: (likes + 1)});
  }

  // handles expanding and contracting of the new message form
  const handleFormClick = () => {
    if (!expanded) {
      setExpanded(true)
    } else {
      setExpanded(false)
    }
  }

  // handles the changing of message boards
  const handleBoardChange = async (key) => {
    // set the current board state
    setCurrentBoard(key);

    // get the board name from the 
    const dbResponse = await dbRef.child(key).get(`topicName`);
    const board = await dbResponse.toJSON();
    const { topicName } = board;

    // set the board name state for the Latest Messages heading
    setCurrentBoardName(topicName);
  }

  // handles change in value of new board input
  const handleNewBoardChange = ({ target }) => {
    setNewBoardInput(target.value);
  }

  // handles submit of new board form
  const handleNewBoardSubmit = async (event) => {
    // prevent page from reloading
    event.preventDefault();

    // store the new baord name
    const submittedBoardName = formNewBoard.value;

    // update the userInput state
    setNewBoardInput('');

    // update the database
    dbRef.push({ topicName: submittedBoardName, messages: {} });

    setAddingNewBoard(true);

    // if the form is not expanded, expand
    if (!expanded) {
      await setExpanded(true)
    }

    // move focus to message form
    formNameInput.focus();
  }

  // handles expandeding the comment form
  const handleCommentClick = async (key) => {
    let expandedComments = commentFormExpanded;
    if (expandedComments.indexOf(key) === -1) {
      expandedComments = clearArray(expandedComments);
      expandedComments.push(key);
    } else {
      expandedComments = clearArray(expandedComments);
    }

    const dbResponse = await currentMessagesRef.child(`${key}`).get(`clicks`);
    const message = dbResponse.toJSON();
    const { clicks } = message;

    // update the clicks value in the database
    currentMessagesRef.child(`${key}`).update({ clicks: (clicks + 1) });
    

    setCommentFormExpanded(expandedComments);
  }

  const handleNewComment = (event, key) => {
    // prevent reloading the page
    event.preventDefault();

    // grab values from the form and format dates
    const submittedMessage = commentFormMessageInput.value;
    const submittedName = commentFormAnonymousCheck.checked ? "Anonymous" : commentFormNameInput.value;
    const newDate = new Date();
    const submittedDate = getFormattedDate(newDate);

    console.log(commentFormNameInput, commentFormMessageInput);

    // update the userInput states
    setUserCommentNameInput('');
    setUserCommentMessageInput('');

    // update the database
    dbRef.child(`${currentBoard}/comments`).push({ name: submittedName, date: submittedDate, message: submittedMessage, likes: 0, associatedPost: key });
  }

  const handleCommentLike = async (key) => {
    // retrieve number of likes from database
    const dbResponse = await currentCommentsRef.child(`${key}`).get(`likes`);
    const message = dbResponse.toJSON();
    const { likes } = message;

    // update the likes value in the database
    currentCommentsRef.child(`${key}`).update({ likes: (likes + 1) });
  }

  // useEffect hooks
  // boards update
  useEffect(() => {
    dbRef.on("value", (snapshot) => {
      // initialize new state
      const newState = [];
      const data = snapshot.val();

      // loop through data and add each board to new state
      for (let key in data) {
        newState.push({key: key, name: data[key]});
      }

      // change board to new board
      if (addingNewBoard) {
        const newBoard = newState[newState.length - 1];
        setCurrentBoard(newBoard.key);
        setCurrentBoardName(newBoard.name.topicName);
        setAddingNewBoard(false);
      }

      // set the boards state 
      setBoards(newState);
    })
  }, [addingNewBoard, anonymousChecked, expanded, commentFormExpanded])

  // messages update
  useEffect(() => {
    currentMessagesRef.on("value", (snapshot) => {
      // initialize new state
      const newState = [];
      const data = snapshot.val();
      
      // loop through data and add to new state IN REVERSE (newest show at top)
      for (let key in data) {
        newState.unshift({key: key, details: data[key]})
      };

      // set the messages state
      setMessages(newState);
    })
  }, [currentBoard, commentFormExpanded])

  // comments update
  useEffect(() => {
    currentCommentsRef.on("value", (snapshot) => {
      // initialize new state
      const newState = [];
      const data = snapshot.val();

      // loop through data and add to new state IN REVERSE (newest show at top)
      for (let key in data) {
        newState.unshift({ key: key, details: data[key] })
      };

      // set the messages state
      setComments(newState);
    })
  }, [currentBoard, messages, commentFormExpanded])

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
    const relatedComments = comments.filter((commentObject) => {
      const { details: { associatedPost } } = commentObject;
      return associatedPost === messageObject.key
    })

    relatedComments.reverse();
    return (
      <Message 
        key={messageObject.key} 
        content={messageObject} 
        updateLikes={handleLike}
        expandCommentForm={handleCommentClick}
        commentFormIsExpanded={commentFormExpanded}
        addNewComment={handleNewComment}
        postComments={relatedComments}
        updateCommentLikes={handleCommentLike}
        commentNameValue={userCommentNameInput}
        commentMessageValue={userCommentMessageInput}
        commentChange={handleChange}
      />
    )
  })

  return (
    <Fragment>
      {/* header component */}
      <Header />
      <main>
        <div className="wrapper mainContainer">
          {/* side bar with list of message boards */}
          <aside className="boardsListContainer">
            <h3 className="boardsListHeading">Message Boards</h3>
            <div className="boardFormContainer">
              {/* new form message board */}
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

            {/* list of boards */}
            <ul>
              {boardsList}
            </ul>
          </aside>

          {/* new message form */}
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
              keydownCheckbox={handleEnterAnonymous}
            />

            {/* message board */}
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
  )
}

export default App;