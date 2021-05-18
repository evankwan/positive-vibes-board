import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import clearArray from '../utilities/clearArray'
import Comment from './Comment';
import Form from './Form';

// component for each Message on a message board
const Message = ({ content: { key, details: { name, date, message, likes } }, updateLikes, formSubmitEventHandler, postComments, updateCommentLikes, switchCheckbox, messagesRef, isAnonChecked, isCommentFormExpanded, setIsCommentFormExpanded }) => {
  // set states
  const [ expandedComments, setExpandedComments ] = useState(false);
  const [ userCommentMessageInput, setUserCommentMessageInput ] = useState([]);
  const [ userCommentNameInput, setUserCommentNameInput ] = useState([]);

  // handles expanding the comment form by logging clicks in the database
  const handleCommentClick = async (key) => {
    // ensuring we do not mutate state
    let expandedComments = isCommentFormExpanded;
    // check if the comment form is expanded
    if (expandedComments.indexOf(key) === -1) {
      // if comment form is not expanded, close all comment forms and expand the targeted form
      expandedComments = clearArray(expandedComments);
      expandedComments.push(key);
      
    } else {
      // if comment form is expanded, close the comment form
      expandedComments = clearArray(expandedComments);
    }

    const dbResponse = await messagesRef.child(`${key}`).get(`clicks`);
    const message = dbResponse.toJSON();
    const { clicks } = message;

    // update the clicks value in the database
    messagesRef.child(`${key}`).update({ clicks: (clicks + 1) });

    setIsCommentFormExpanded(expandedComments);
  }

  const handleClick = () => {
    setExpandedComments(!expandedComments);
  }

  return (
    <li className="messageBoardPost" key={key}>
      <p className="messageHead">Posted by {name} on {date}</p>
      <p className="messageText">&#187; {message}</p>
      <div className="likeContainer">
        <FontAwesomeIcon 
          icon="heart" 
          onClick={() => {
            updateLikes(key)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              updateLikes(key)
            }
          }}
          tabIndex="0"
        />
        <p className="likesCount">{likes}</p>
        <FontAwesomeIcon
          icon="comment"
          tabIndex="0"
          onClick={() => handleCommentClick(key)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleCommentClick(key)
            }
          }}
        />
        <p 
          className="commentLine"
          onClick={() => handleCommentClick(key)}
        >
          Add Comment
        </p>
      </div>
      
      <Form
        ifComment={true}
        commentKey={key}
        addNewComment={formSubmitEventHandler}
        expandCommentForm={isCommentFormExpanded}
        commentNameInputChange={setUserCommentNameInput}
        commentMessageInputChange={setUserCommentMessageInput}
        commentAnonChecked={isAnonChecked[0]}
        commentNameInput={userCommentNameInput}
        commentMessageInput={userCommentMessageInput}
        commentAnonCheck={switchCheckbox}
      />

      <ul className="commentList">
        {
          postComments.length > 0 
          ? <li className="commentHeading" onClick={handleClick}>Comments:
              <span className="mobileOnly">
                &nbsp;
                <FontAwesomeIcon icon="caret-down" className="mobileOnly" />
              </span>
            </li> 
          : ""
        }
        {
          postComments.map((comment) => {
            return <Comment key={comment.key} commentObject={comment} updateLikes={updateCommentLikes} isExpanded={expandedComments}/>
          })
        }
      </ul>
    </li>
  )
}

export default Message