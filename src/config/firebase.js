import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAdVn-5KOOwJBTiIHuTikXHMKtfdad5sgw",
  authDomain: "positive-vibes-board.firebaseapp.com",
  projectId: "positive-vibes-board",
  storageBucket: "positive-vibes-board.appspot.com",
  messagingSenderId: "549757297627",
  appId: "1:549757297627:web:d1fd726896debdcd9e7dfe"
};

firebase.initializeApp(firebaseConfig);

export default firebase;