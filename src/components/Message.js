const Message = ({ content: { key, details: { name, date, message } } }) => {
  console.log(key);
  return (
    <li className="messageBoardPost" key={key}>
      <p>Posted by: {name} on {date}</p>
      <p>{message}</p>
    </li>
  )
}

export default Message