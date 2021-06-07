# Positive Vibes Board

A positivity- and motivation-focused message board created as a solo project at Juno College (98% final grade)

👷‍♂️ Built using React and Firebase.

What can you expect to see soon:
- Refactor code to include Routing
- Content filter to prevent toxic messages from being posted
- Google Authentication to sign in and include demo account

### Project Overview

This was my first React and first Firebase project that I built. During the last part of bootcamp, we were all very stressed and overwhelmed with the sheer amount of work we had, so I wanted to build a positivity message board to boost everyone up and help us get through the work. 

I started by building out a basic database structure using Firebase's Realtime Database

#### Database structure

I built a relatively flat database structure to store my message boards, messages, and comments

Database
-> Message Board (key)
  -> Messages
    -> Message (key)
      -> clicks
      -> date
      -> likes
      -> message
      -> name
  -> Comments
    -> Comment (key)
      -> associated post
      -> date
      -> likes
      -> message
      -> name
  -> topicName (value)

#### Message Boards

After getting the database structure ironed out, I moved on to building my app, starting with getting a single message board live and allowing users to add messages.

Once messages were enabled, I added the ability to create and switch between different message boards.

The final steps were adding in comments and the ability to like each post.

#### Technical Wins

I am very proud to have created this as my first React project and also my first Firebase project. Creating the database structure that was flat and also allowed me to easily pull message boards, their associated messages, and the comments associated with each message was a big win to start out.

Putting this project together in just one week on top of 8 hours of classes each day was a significant win for me.

Finally, creating a React app that successfully leveraged components where necessary for abstraction and reusability is something that I am proud of for this first project.

#### Technical Challenges

I had a few instances where I struggled with moving states that only affected the child components into those respective child components. The comments form expanded state could have lived within the message component, but I had used it in the dependency array and useEffect logic in App.js. Due to time constraints, I wasn't able to refactor this code to move this state into the Message component. 

There also seems to be an issue where if multiple people are using the site at the same time, opening the comment form and submitting a comment appears to affect the current state and screen for all users. This appears to be a quirk of using a web socket instead of a proper database. I will be attempting to resolve this by refactoring this project to include routing and make all message boards their own page.