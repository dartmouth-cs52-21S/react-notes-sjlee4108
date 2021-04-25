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

export function fetchBoard(boardID, callback) {
  database.ref('boards').child(boardID).on('value', (snapshot) => {
    const newNoteState = snapshot.val();
    callback(newNoteState);
  });
}

export function addNote(boardID, newNote) {
  const childRef = database.ref('boards').child(boardID).child('notes').push(newNote);
  return childRef.key;
}

export function deleteNote(boardID, id) {
  database.ref('boards').child(boardID).child('notes').child(id)
    .remove();
}

export function updateNote(boardID, id, updatedNote) {
  database.ref('boards').child(boardID).child('notes').child(id)
    .set(updatedNote);
}

export function updateCount(boardID, count) {
  const childRef = database.ref('boards').child(boardID).child('count').set(count);
  return childRef.key;
}

export function updateEditor(boardID, id, editor) {
  database.ref('boards').child(boardID).child('notes').child(id)
    .child('editor')
    .set(editor);
}

export function addNewBoard(userId, title) {
  const boardRef = database.ref('boards').push({ title, notes: null, count: 0 });
  database.ref(`users/${userId}/boards`).child(boardRef.key).set({ title });
}

export function addExistBoard(userId, boardId, callback) {
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
  database.ref(`users/${userId}/boards`).on('value', (snapshot) => {
    const listState = snapshot.val();
    callback(listState);
  });
}

export function removeBoard(userId, boardId) {
  database.ref(`users/${userId}/boards`).child(boardId).remove();
}
export const provider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();
