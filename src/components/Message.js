import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Comment from './Comment';

// component for each Message on a message board
const Message = ({ content: { key, details: { name, date, message, likes } }, updateLikes, expandCommentForm, commentFormIsExpanded, addNewComment, postComments, updateCommentLikes, commentNameValue, commentMessageValue, commentChange, switchCheckbox, isAnonChecked }) => {
  return (
    <li className="messageBoardPost" key={key}>
      <p className="messageHead">Posted by {name} on {date}</p>
      <p className="messageText">&#187; {message}</p>
      <div className="likeContainer">
        <FontAwesomeIcon 
          icon="heart" 
          onClick={() => {
            updateLikes(key);
          }}
          tabIndex="0"
        />
        <p className="likesCount">{likes}</p>
        <FontAwesomeIcon
          icon="comment"
          tabIndex="0"
          onClick={() => expandCommentForm(key)}
        />
        <p 
          className="commentLine"
          onClick={() => expandCommentForm(key)}
        >
          Add Comment
        </p>
      </div>
      
      <form 
        action="submit" 
        className={`commentForm ${commentFormIsExpanded.indexOf(key) > -1 ? "expandedForm" : ""}`}
        onSubmit={(event) => addNewComment(event, key)}
      >
        <div className="formNameContainer commentFormNameContainer">
          <label htmlFor="name" className="srOnly">Enter your name</label>
          <input
            id="commentName"
            className={`nameInput commentNameInput`}
            type="text"
            placeholder="Enter your name"
            autoComplete="off"
            value={commentNameValue}
            onChange={commentChange}
          />

          <div className="anonymousContainer">
            <label
              htmlFor="commentAnonymous"
              className="anonymousLabel commentAnonymousLabel"
              tabIndex="0"
            >
              Remain Anonymous
          </label>
            <FontAwesomeIcon icon={key === isAnonChecked[0] ? "check-square" : "square"} />
            <input
              type="checkbox"
              name="anonymous"
              id="commentAnonymous"
              className="anonymousCheckbox commentAnonymousCheckbox"
              onClick={() => switchCheckbox(true, key)}
              tabIndex="-1"
            />
          </div>
        </div>

        <div className="formMessageContainer">
          <label htmlFor="message" className="srOnly">Enter Message</label>
          <textarea
            name="message"
            id="commentMessage"
            className="messageField commentMessageField"
            placeholder="Enter Message"
            value={commentMessageValue}
            onChange={commentChange}
            required
          ></textarea>
        </div>

        <div className="formSubmitContainer">
          <input
            type="submit"
            value="Post Your Message"
            className="submitButton commentSubmitButton"
          />
        </div>
      </form>

      <ul className="commentList">
        {(postComments.length > 0) ? 
          <li className="commentHeading">Comments:</li> :
          ""
        }
        
        {
          postComments.map((comment) => {
            return <Comment key={comment.key} commentObject={comment} updateLikes={updateCommentLikes}/>
          })
        }
      </ul>
    </li>
  )
}

export default Message