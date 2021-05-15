const Form = ({ submitEvent, changeEvent, nameValue, messageValue }) => {
  return (
    <div className="formContainer">
      <h2>Post To The  Board</h2>
      <form action="submit" className="messageForm" onSubmit={submitEvent}>
        <div className="formNameContainer">
          <label htmlFor="name" className="srOnly">Enter your name</label>
          <input id="name" className="nameInput" type="text" onChange={changeEvent} placeholder="Enter your name" value={nameValue} required />

          <div className="anonymousContainer">
            <label htmlFor="anonymous" className="anonymousLabel">Remain Anonymous</label>
            <input type="checkbox" name="anonymous" id="anonymous" className="anonymousCheckbox" />
          </div>
        </div>
        
        <div className="formMessageContainer">
          <label htmlFor="message" className="srOnly">Enter Message</label>
          <textarea name="message" id="message" className="messageField" onChange={changeEvent} value={messageValue} placeholder="Enter Message" required></textarea>
        </div>

        <div className="formSubmitContainer">
          <input type="submit" value="Post Your Message" className="submitButton" />
        </div>
      </form>
    </div>
  )
}

export default Form