# Description of the project

This will be a motivational message board for people to share positive messages and lift each other up. The app will look like a forum, where there is a place to enter in a message and your name (or remain anonymous) and display the posted messages below. This should update the message board for everyone to see

## MVP

- Form to enter a message, your name, or a checkbox to remain anonymous
- When the form is submitted, add the message to Firebase and update the state on the page
- Each message component will have a date, a name, and the message. 
- on Firebase update, render all messages on page
- This information will be stored in Firebase

## Stretch Goals

- A like feature on each message
- A comment feature on each message that also accepts likes
- Multiple boards based on different topics
- Users can create their own boards
- Nest comments inside of one another
- Make sure the board updates for all users at the same time
- Authentication to allow each person to have their own account. Each account can see the public board 