import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Message = ({ content: { key, details: { name, date, message, likes } }, updateLikes }) => {
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
        />
        {likes}
      </div>
    </li>
  )
}

export default Message