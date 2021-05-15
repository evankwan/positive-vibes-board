const Form = ({ submitEvent, changeEvent, nameValue, messageValue }) => {
  return (
    <div className="formContainer">
      <form action="submit" className="messageForm" onSubmit={submitEvent}>
        <div className="formNameContainer">
          <label htmlFor="name" className="sr-only">Enter your name</label>
          <input id="name" type="text" onChange={changeEvent} placeholder="Enter your name" value={nameValue} required />

          <label htmlFor="anonymous">Remain Anonymous</label>
          <input type="checkbox" name="anonymous" id="anonymous" />
        </div>
        
        <div className="formMessageContainer">
          <label htmlFor="message"></label>
          <textarea name="message" id="message" onChange={changeEvent} value={messageValue} required></textarea>
        </div>

        <div className="formSubmitContainer">
          <input type="submit" value="Post Your Message"/>
        </div>
      </form>
    </div>
  )
}

export default Form