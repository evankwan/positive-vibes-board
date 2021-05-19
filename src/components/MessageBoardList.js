import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MessageBoardList = ({ addNewBoard, newBoardValue, updateNewBoardValue, boardsList, handleClick, isMobileExpanded }) => {
  
  return (
    <aside className="boardsListContainer">
      <h3 
        id="boardsListHeading" className="boardsListHeading"
        onClick={handleClick}
      >
        Message Boards
        <span className="mobileOnly">
          &nbsp;
          <FontAwesomeIcon icon="caret-down" />
        </span>
      </h3>
      <div className={`boardFormContainer 
          ${
            isMobileExpanded
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
            isMobileExpanded
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