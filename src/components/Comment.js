import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Comment = ({ commentObject: { details, key }, updateLikes }) => {
  const { date, likes, message, name } = details;
  return (
    <li className="commentListItem">
      <p className="commentHead">Posted by {name} on {date}</p>
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
      </div>
    </li>
  )
}

export default Comment