const MessageBoardListItem = ({ boardName, clickEvent }) => {
  const { key, name: { topicName } } = boardName;
  return (
    <li>
      <button 
        className="boardButton" 
        onClick={() => {
          clickEvent(key);
        }}
      >
        {topicName}</button>
    </li>
  )
}

export default MessageBoardListItem