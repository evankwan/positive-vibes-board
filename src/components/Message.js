const Message = ({ content: { key, details: { name, date, message } } }) => {
  return (
    <li className="messageBoardPost" key={key}>
      <p className="messageHead">Posted by: {name} on {date}</p>
      <p className="messageText">{message}</p>
    </li>
  )
}

export default Message