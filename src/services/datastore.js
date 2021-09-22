import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyB1oNGw7jKQf_Sj_oHN2shMEmQTIbhsudM',
  authDomain: 'react-notes-bef24.firebaseapp.com',
  projectId: 'react-notes-bef24',
  storageBucket: 'react-notes-bef24.appspot.com',
  messagingSenderId: '195079950641',
  appId: '1:195079950641:web:226408947a50a3c4556010',
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

export function fetchBoard(boardID, callback) {
  // gets all info of a board
  database.ref('boards').child(boardID).on('value', (snapshot) => {
    const newNoteState = snapshot.val();
    callback(newNoteState);
  });
}

export function addNote(boardID, newNote) {
  // adds a new note
  const childRef = database.ref('boards').child(boardID).child('notes').push(newNote);
  return childRef.key;
}

export function deleteNote(boardID, id) {
  // delete a note of given id
  database.ref('boards').child(boardID).child('notes').child(id)
    .remove();
}

export function updateNote(boardID, id, updatedNote) {
  // updates note with given info
  database.ref('boards').child(boardID).child('notes').child(id)
    .set(updatedNote);
}

export function updateCount(boardID, count) {
  // update count that keeps track of max z-index
  const childRef = database.ref('boards').child(boardID).child('count').set(count);
  return childRef.key;
}

export function updateEditor(boardID, id, editor) {
  // update editor info of the board
  database.ref('boards').child(boardID).child('notes').child(id)
    .child('editor')
    .set(editor);
}

export function addNewBoard(userId, title) {
  // add new board with given title
  const boardRef = database.ref('boards').push({ title, notes: null, count: 0 });
  database.ref(`users/${userId}/boards`).child(boardRef.key).set({ title });
}

export function addExistBoard(userId, boardId, callback) {
  // add exisiting board based on the given key
  database.ref('boards').child(boardId).once('value', (snapshot) => {
    if (snapshot.exists()) {
      const { title } = snapshot.val();
      database.ref(`users/${userId}/boards`).child(boardId).set({ title });
    } else {
      callback();
    }
  });
}

export function fetchBoardList(userId, callback) {
  // fetch list of boards in a user's list.
  database.ref(`users/${userId}/boards`).on('value', (snapshot) => {
    const listState = snapshot.val();
    callback(listState);
  });
}

export function removeBoard(userId, boardId) {
  // remove board from a user's list of boards.
  database.ref(`users/${userId}/boards`).child(boardId).remove();
}
export const provider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();
