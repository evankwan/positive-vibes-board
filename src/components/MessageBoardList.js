import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

const MessageBoardList = ({ addNewBoard, newBoardValue, updateNewBoardValue, boardsList }) => {
  const [ mobileExpanded, setMobileExpanded ] = useState(false);

  const handleClick = () => {
    setMobileExpanded(!mobileExpanded);
  }

  return (
    <aside className="boardsListContainer">
      <h3 
        id="boardsListHeading" className="boardsListHeading"
        onClick={handleClick}
      >
        Message Boards
        <span className="mobileOnly">&nbsp;</span>
        <FontAwesomeIcon icon="caret-down" className="mobileOnly"/> 
      </h3>
      <div className={`boardFormContainer 
          ${
            mobileExpanded
            ? ""
            : "hiddenMobile"
          }`
        }
      >
        {/* new form message board */}
        <form 
          action="submit" 
          className="newBoardForm" 
          onSubmit={addNewBoard}>
          <label htmlFor="name" className="srOnly">Add A New Message Board</label>
          <input
            id="boardName"
            className="boardNameInput"
            type="text"
            placeholder="New Board Name"
            autoComplete="off"
            value={newBoardValue}
            onChange={updateNewBoardValue}
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
      <ul id="boardsList" className={`boardsList 
          ${
            mobileExpanded
            ? ""
            : "hiddenMobile"
          }`
        }
      >
        {boardsList}
      </ul>
    </aside>
  )
}

export default MessageBoardList