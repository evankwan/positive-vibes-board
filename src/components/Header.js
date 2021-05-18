import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Header component
const Header = () => {
  return (
    <header>
      <div className="wrapper headerContainer">
        <div className="logoContainer">
          <FontAwesomeIcon icon="sun" />
        </div>
        <div className="titleContainer">
          <h1>
            Positive Vibes Board
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header