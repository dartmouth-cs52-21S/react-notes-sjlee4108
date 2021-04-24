import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyD_BKzLgBMISr2Uh6_1fXBeZQh0GGo3ecs',
  authDomain: 'react-notes-b2917.firebaseapp.com',
  databaseURL: 'https://react-notes-b2917-default-rtdb.firebaseio.com',
  projectId: 'react-notes-b2917',
  storageBucket: 'react-notes-b2917.appspot.com',
  messagingSenderId: '424723283847',
  appId: '1:424723283847:web:b99a5a7edef1f860d15d22',
};
firebase.initializeApp(config);

// Get a reference to the database service
const database = firebase.database();

export function fetchNotes(callback) {
  database.ref('notes').on('value', (snapshot) => {
    const newNoteState = snapshot.val();
    callback(newNoteState);
  });
}

export function addNote(newNote) {
  const childRef = database.ref('notes').push(newNote);
  return childRef.key;
}

export function deleteNote(id) {
  database.ref('notes').child(id).remove();
}

export function updateNote(id, updatedNote) {
  database.ref('notes').child(id).set(updatedNote);
}
