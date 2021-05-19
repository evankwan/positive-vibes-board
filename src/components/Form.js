import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

// component for the new message form
const Form = ({ submitEvent, switchCheckbox, isChecked, keydownCheckbox, ifComment = false, commentKey, addNewComment, commentMessageInputChange, commentNameInputChange, commentAnonChecked, commentNameInput, commentMessageInput, commentAnonCheck, expandComments, expandCommentForm = [] }) => {
  // states
  const [ expanded, setExpanded ] = useState(false);
  const [ userMessageInput, setUserMessageInput ] = useState('');
  const [ userNameInput, setUserNameInput ] = useState('');

  // handles expanding and contracting of the new message form
  const handleFormClick = () => {
    if (!expanded) {
      setExpanded(true)
    } else {
      setExpanded(false)
    }
  }

  const commentNameId = `commentName-${commentKey}`
  const commentAnonId = `commentAnonymous-${commentKey}`
  const commentMessageId = `commentMessage-${commentKey}`

  return (
    <div className={
      ifComment 
      ? "" 
      : "formContainer"
    }> 
      {/* add heading for message form */}
      {ifComment 
      ? "" 
      : <div className="formHeadingContainer">
          <h2 
            className="formHeading" 
            onClick={handleFormClick} 
            onKeyDown={({ key }) => {
              if (key === 'Enter') {
                handleFormClick();
              }
            }} 
            tabIndex="0"
          >
            Post To The Board&nbsp;
            <FontAwesomeIcon icon="caret-down" /> 
          </h2>
        </div>
      }
      <form 
        action="submit"
        className={`
          ${
            ifComment
            ? "commentForm"
            : "messageForm"
          } 
          ${
            expanded 
            ? "expandedForm" 
            : ""
          }
          ${
            expandCommentForm.indexOf(commentKey) > -1
            ? "expandedForm"
            : ""
          }`
        }
        onSubmit={
          ifComment 
          ? (event) => {
            addNewComment(event, commentKey, commentNameId, commentAnonId, commentMessageId);
            // update the userInput states
            commentNameInputChange('');
            commentMessageInputChange('');
            expandComments();
          }
          : (event) => {
            submitEvent(event);
            // update the userInput states
            setUserNameInput('');
            setUserMessageInput('');
          }
        }
      >
        <div className={`formNameContainer ${
          ifComment 
          ? "commentFormNameContainer" 
          : ""}
        `}>
          <label htmlFor={
            ifComment 
            ? commentNameId 
            : "name"
          } 
          className="srOnly">
            Enter your name
          </label>
          <input 
            id={
              ifComment 
              ? commentNameId 
              : "name"
            }
            className={
              ifComment 
              ? commentKey === commentAnonChecked
                ? "nameInput commentNameInput disabled"
                : "nameInput commentNameInput" 
              : isChecked
                ? "nameInput disabled"
                : "nameInput"
            } 
            type="text" 
            onChange={
              ifComment 
              ? ({ target: { value } }) => commentNameInputChange(value)
              : ({ target: { value } }) => setUserNameInput(value)
            } 
            placeholder="Enter your name" 
            value={
              ifComment 
              ? commentNameInput
              : userNameInput
            } 
            autoComplete="off"
            disabled={
              ifComment 
              ? commentKey === commentAnonChecked 
              : isChecked
            }
            required={
              ifComment 
              ? !commentAnonChecked 
              : !isChecked
            }
          />

          <div className="anonymousContainer">
            <label 
              htmlFor={
                ifComment 
                ? commentAnonId 
                : "anonymous"
              }
              className={`anonymousLabel ${
                ifComment 
                ? "commentAnonymousLabel" 
                : "" }
              `} 
              tabIndex="0"
              onKeyDown={
                ifComment 
                ? (event) => {
                    if (event.key === 'Enter') {
                      commentAnonCheck(true, commentKey);
                    }
                  }
                : keydownCheckbox
              }
            >
              Remain Anonymous
            </label>
            {
            ifComment 
            ? commentKey === commentAnonChecked
              ? <FontAwesomeIcon icon="check-square" />
              : <FontAwesomeIcon icon="square" /> 
            : isChecked
              ? <FontAwesomeIcon icon="check-square" />
              : <FontAwesomeIcon icon="square" />
            }
            <input 
              type="checkbox" 
              name="anonymous" 
              id={
                ifComment 
                ? commentAnonId 
                : "anonymous"
              } 
              className={`anonymousCheckbox ${
                ifComment 
                ? "commentAnonymousCheckbox"
                : ""
              }`}
              onClick={
                ifComment 
                ? () => commentAnonCheck(true, commentKey)
                : () => switchCheckbox(false)
              }
              tabIndex="-1"
            />
          </div>
        </div>
        
        <div className="formMessageContainer">
          <label 
            htmlFor={
              ifComment 
              ? commentMessageId
              : "message"
            } 
            className="srOnly"
          >
            Enter Message
          </label>
          <textarea 
            name="message" 
            id={
              ifComment 
              ? commentMessageId 
              : "message"
            } 
            className={`messageField ${
              ifComment
              ? "commentMessageField"
              : "" 
            }`} 
            onChange={
              ifComment 
              ? ({ target: { value } }) => commentMessageInputChange(value)
              : ({ target: { value } }) => setUserMessageInput(value)
            } 
            value={
              ifComment 
              ? commentMessageInput
              : userMessageInput
            }
            placeholder="Enter Message" 
            required
          ></textarea>
        </div>

        <div className="formSubmitContainer">
          <input 
            type="submit" 
            value="Post Your Message" 
            className={`submitButton ${
              ifComment 
              ? "commentSubmitButton" 
              : ""
            }`}
          />
        </div>
      </form>
    </div>
  )
}

export default Form