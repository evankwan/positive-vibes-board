import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// component for the new message form
const Form = ({ submitEvent, changeEvent, nameValue, messageValue, expandForm, isExpanded, switchCheckbox, isChecked, keydownCheckbox }) => {
  return (
    <div className="formContainer">
      <div className="formHeadingContainer">
        <h2 className="formHeading" onClick={expandForm}>
          Post To The Board&nbsp;
          <FontAwesomeIcon icon="caret-down" /> 
        </h2>
      </div>
      <form 
        action="submit"
        className={`messageForm ${isExpanded ? "expandedForm" : ""}`}
        onSubmit={submitEvent}
      >
        <div className="formNameContainer">
          <label htmlFor="name" className="srOnly">Enter your name</label>
          <input 
            id="name" 
            className={`nameInput ${isChecked ? "disabled" : ""}`} 
            type="text" 
            onChange={changeEvent} 
            placeholder="Enter your name" 
            value={nameValue} 
            autoComplete="off"
            disabled={isChecked}
            required={!isChecked}
          />

          <div className="anonymousContainer">
            <label 
              htmlFor="anonymous" 
              className="anonymousLabel" 
              tabIndex="0"
              onKeyDown={keydownCheckbox}
            >
              Remain Anonymous
            </label>
            <FontAwesomeIcon icon={isChecked ? "check-square" : "square"} /> 
            <input 
              type="checkbox" 
              name="anonymous" 
              id="anonymous" 
              className="anonymousCheckbox" 
              onClick={() => switchCheckbox(false)}
              tabIndex="-1"
            />
          </div>
        </div>
        
        <div className="formMessageContainer">
          <label htmlFor="message" className="srOnly">Enter Message</label>
          <textarea 
            name="message" 
            id="message" 
            className="messageField" 
            onChange={changeEvent} 
            value={messageValue} 
            placeholder="Enter Message" 
            required
          ></textarea>
        </div>

        <div className="formSubmitContainer">
          <input 
            type="submit" 
            value="Post Your Message" 
            className="submitButton" 
          />
        </div>
      </form>
    </div>
  )
}

export default Form