const MessageBoardList = ({ addNewBoard, newBoardValue, updateNewBoardValue, boardsList }) => {
  return (
    <aside className="boardsListContainer">
      <h3 className="boardsListHeading">Message Boards</h3>
      <div className="boardFormContainer">
        {/* new form message board */}
        <form action="submit" className="newBoardForm" onSubmit={addNewBoard}>
          <label htmlFor="name" className="srOnly">Add A New Message Board</label>
          <input
            id="boardName"
            className="boardNameInput"
            type="text"
            placeholder="Add New Message Board"
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
      <ul>
        {boardsList}
      </ul>
    </aside>
  )
}

export default MessageBoardList