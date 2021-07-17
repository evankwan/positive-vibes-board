import '../styles/App.css';
import { faSun, faCaretDown, faCheckSquare, faSquare, faHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import { Fragment, useEffect, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';
import firebase from '../config/firebase';
import Footer from './Footer'
import Form from './Form';
import Header from './Header';
import getFormattedDate from '../utilities/getFormattedDate';
import Message from './Message';
import MessageBoardList from './MessageBoardList'
import MessageBoardListItem from './MessageBoardListItem';

function App() {
  // adding fontawesome icons globally
  library.add(faSun, faCaretDown, faCheckSquare, faSquare, faHeart, faComment);

  // useState declarations
  const [ anonymousChecked, setAnonymousChecked ] = useState(false);
  const [ boards, setBoards ] = useState([]);
  const [ commentFormExpanded, setCommentFormExpanded ] = useState([]);
  const [ comments, setComments ] = useState([]);
  // currentBoard and currentBoardName could probably be condensed into a single state that holds an object with both values
  const [ currentBoard, setCurrentBoard ] = useState(`-M_qnb3Aah2p0BDqMmgq`);
  const [ currentBoardName, setCurrentBoardName] = useState('Public');
  const [ messages, setMessages ] = useState([]);
  const [ mobileExpanded, setMobileExpanded ] = useState(false);
  const [ newBoardInput, setNewBoardInput ] = useState('');
  const [ showModal, setShowModal ] = useState(false);

  // selectors
  const formNameInput = document.getElementById('name');
  const formNewBoard = document.getElementById('boardName');

  // database references
  const dbRef = firebase.database().ref();
  const currentCommentsRef = firebase.database().ref(`${currentBoard}/comments`);
  const currentMessagesRef = firebase.database().ref(`${currentBoard}/messages`);

  // useEffect hook
  useEffect(() => {
    // boards update
    const dbRef = firebase.database().ref();
    dbRef.on("value", (snapshot) => {
      // initialize new state
      const newState = [];
      const data = snapshot.val();

      // loop through data and add each board to new state
      for (let key in data) {
        newState.push({ key: key, name: data[key] });
      }

      // set the boards state 
      setBoards(newState);
    })
  }, [])

  useEffect(() => {
    // messages update
    const currentBoardRef = firebase.database().ref(`${currentBoard}`);
    currentBoardRef.on("value", (snapshot) => {
      // initialize new state
      const newState = [];
      const boardData = snapshot.val();
      const { messages } = boardData;

      // loop through data and add to new state IN REVERSE (newest show at top)
      for (let key in messages) {
        newState.unshift({ key: key, details: messages[key] })
      }

      // set the messages state
      setMessages(newState);
    })
  }, [currentBoard])

  useEffect(() => {
    if (!currentBoard) {
      setCurrentBoard(`-M_qnb3Aah2p0BDqMmgq`);
    }
    // comments update
    const currentCommentsRef = firebase.database().ref(`${currentBoard}/comments`);
    currentCommentsRef.on("value", (snapshot) => {
      // initialize new state
      const newState = [];
      const data = snapshot.val();

      // loop through data and add to new state IN REVERSE (newest show at top)
      for (let key in data) {
        newState.unshift({ key: key, details: data[key] })
      };

      // set the comments state
      setComments(newState);
    })
  }, [currentBoard])

  // functions
  // collapses the boards list on mobile screen
  const expandComments = () => {
    setMobileExpanded(!mobileExpanded);
  }

  // handles if the remain anonymous checkbox is checked in message and comment forms
  const handleAnonCheck = () => {
    const checked = anonymousChecked;
    setAnonymousChecked(!checked);
  }

  // handles the changing of message boards
  const handleBoardChange = async (key) => {
    // set the current board state
    setCurrentBoard(key);

    // get the board name from the database
    const dbResponse = await dbRef.child(key).get(`topicName`);
    const board = dbResponse.toJSON();
    const { topicName } = board;

    // set the board name state for the Latest Messages heading
    setCurrentBoardName(topicName);
  }

  // handles adding a new like onto a comment
  const handleCommentLike = async (key) => {
    // retrieve number of likes from database
    const dbResponse = await currentCommentsRef.child(`${key}`).get(`likes`);
    const message = dbResponse.toJSON();
    const { likes } = message;

    // update the likes value in the database
    currentCommentsRef.child(`${key}`).update({ likes: (likes + 1) });
  }

  // handles hitting enter when focused on anonymous label/checkbox
  const handleEnterAnonymous = ({ key }) => {
    if (key === 'Enter') {
      handleAnonCheck();
    }
  }

  // handles liking a message on any board
  const handleLike = async (key) => {
    // retrieve number of likes from database
    const dbResponse = await currentMessagesRef.child(key).get(`likes`);
    const message = dbResponse.toJSON();
    const { likes } = message;

    // update the likes value in the database
    currentMessagesRef.child(`${key}`).update({ likes: (likes + 1) });
  }

  // handles change in value of new board input
  const handleNewBoardChange = ({ target }) => {
    setNewBoardInput(target.value);
  }

  // handles submit of new board form
  const handleNewBoardSubmit = async (event) => {
    // prevent page from reloading
    event.preventDefault();

    // store the new board name
    const submittedBoardName = formNewBoard.value;

    // reset the userInput state
    setNewBoardInput('');

    // test board name
    const analyzeUrl = new URL(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.REACT_APP_PERSPECTIVE_API_KEY}`);
    const messageTestResult = await checkMessage(analyzeUrl, submittedBoardName);

    if (messageTestResult) {
      // update the database
      dbRef.push({ topicName: submittedBoardName, messages: {} });
    } else {
      setShowModal(true);
    }
  }

  // handles new comment being submitted on a message
  const handleNewComment = async (event, key, nameInputId, anonCheckId, messageInputId, name) => {
    // prevent reloading the page
    event.preventDefault();

    // grab values from the form and format dates
    const submittedName = 
      document.getElementById(anonCheckId).checked
      ? "Anonymous"
      : document.getElementById(nameInputId).value;
    const submittedMessage = document.getElementById(messageInputId).value;
    const newDate = new Date();
    const submittedDate = getFormattedDate(newDate);

    // perspective API check
    const analyzeUrl = new URL(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.REACT_APP_PERSPECTIVE_API_KEY}`);
    const messageTestResult = await checkMessage(analyzeUrl, submittedMessage);
    const nameTestResult = await checkMessage(analyzeUrl, submittedName);

    if (messageTestResult && nameTestResult) {
      // update the database
      dbRef.child(`${currentBoard}/comments`).push({ name: submittedName, date: submittedDate, message: submittedMessage, likes: 0, associatedPost: key });
    } else {
      setShowModal(true);
    }
  }

  // handles new message submit in the new message form
  const handleSubmit = async (event, message, name) => {
    // prevent reloading the page
    event.preventDefault();
    
    // grab values from the form and format dates
    const submittedName = 
      anonymousChecked
      ? "Anonymous" 
      : name;
    const submittedMessage = message;
    const newDate = new Date();
    const submittedDate = getFormattedDate(newDate);

    const analyzeUrl = new URL(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.REACT_APP_PERSPECTIVE_API_KEY}`);

    const messageTestResult = await checkMessage(analyzeUrl, submittedMessage);
    const nameTestResult = await checkMessage(analyzeUrl, submittedName);
    
    if (messageTestResult && nameTestResult) {
      // update the database
      currentMessagesRef.push({ message: submittedMessage, name: submittedName, date: submittedDate, likes: 0, clicks: 0 });

      // set focus on form again
      formNameInput.focus();
    } else {
      setShowModal(true);
    }
  }

  // function to test comment score
  const checkMessage = async (url, message) => {
    const attributeScores = await axios
      .post(url, {
        comment: {
          text: message
        },
        languages: ["en"],
        requestedAttributes: {
          IDENTITY_ATTACK: {},
          INSULT: {},
          PROFANITY: {},
          SEXUALLY_EXPLICIT: {},
          THREAT: {},
          TOXICITY: {},
          SEVERE_TOXICITY: {}
        }
      })
      .then(async (response) => {
        return response.data.attributeScores
      }).catch((error) => {
        console.error('Perspective API Check Failed');
        return {}
      })
    console.log(attributeScores);

    const scores = [];
    for (let attribute in attributeScores) {
      if (attributeScores[attribute].summaryScore.value >= 0.5) {
        scores.push(false);
      } else {
        scores.push(true);
      }
    }
    if (scores.includes(false)) {
      return false
    } else {
      return true
    }
  }

  // page elements
  // boards
  const boardsList = boards.map((board) => {
    return (
      <MessageBoardListItem
        key={board.key} 
        boardName={board} 
        clickEvent={handleBoardChange}
        collapseList={expandComments}
      />
    )
  })

  // messages - related comments inside
  const messagesList = messages.map((messageObject) => {
    // pull related comments for each message
    const relatedComments = comments.filter((commentObject) => {
      const { details: { associatedPost } } = commentObject;
      return associatedPost === messageObject.key
    })
    // reverse the order of comments, oldest first
    relatedComments.reverse();
    return (
      <Message 
        key={messageObject.key} 
        content={messageObject} 
        updateLikes={handleLike}
        formSubmitEventHandler={handleNewComment}
        postComments={relatedComments}
        updateCommentLikes={handleCommentLike}
        // switchCheckbox={handleAnonCheck}
        messagesRef={currentMessagesRef}
        // isAnonChecked={messagesWithAnonChecked}
        isCommentFormExpanded={commentFormExpanded}
        setIsCommentFormExpanded={setCommentFormExpanded}
      />
    )
  })

  // App return
  return (
    <Fragment>
      {/* header component */}
      <Header />
      <main className="main">
        <div className="wrapper mainContainer">
          {
            showModal
              ? <div className="postRejectedModalContainer">
                  <div className="postRejectedModal">
                    <p className="postRejectedModalMessage">Please reconsider your post. This is a positivity message board.
                      <br/><br/>

                      <strong> Toxic, sexually explicit, profane, threatening, or insulting comments are not permitted.</strong>
                    </p>
                    <button className="closePostRejectedModal" onClick={() => setShowModal(false)}>
                      Close
                    </button>
                  </div>
                </div>
              : <>
                  {/* side bar with list of message boards */}
                  <MessageBoardList
                    addNewBoard={handleNewBoardSubmit}
                    newBoardValue={newBoardInput}
                    updateNewBoardValue={handleNewBoardChange}
                    boardsList={boardsList}
                    handleClick={expandComments}
                    isMobileExpanded={mobileExpanded}
                  />

                  {/* new message form */}
                  <div className="messageBoard">
                    <Form
                      submitEvent={handleSubmit}
                      switchCheckbox={handleAnonCheck}
                      isChecked={anonymousChecked}
                      keydownCheckbox={handleEnterAnonymous}
                    />

                    {/* message board */}
                    <section className="messagesBoardContainer">
                      <h2 className="messagesListHeading">Latest Messages on {currentBoardName} Board</h2>
                      <ul>
                        {messagesList}
                      </ul>
                    </section>
                  </div>
                </>
          }
          
        </div>
        {/* wrapper ended */}
      </main>
      <Footer />
    </Fragment>
  )
}

export default App;