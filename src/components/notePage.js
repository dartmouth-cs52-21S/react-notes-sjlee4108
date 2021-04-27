import React from 'react';
import { Map } from 'immutable';
import SearchBar from './searchBar';
import Note from './note';
import * as firebasedb from '../services/datastore';

class NotePage extends React.Component {
  // Page for note boards
  // contains notes created by users
  constructor() {
    super();
    this.state = {
      notes: Map(),
      searchterm: '',
      title: '',
      count: 0,
    };
  }

  componentDidMount() {
    // gets a list of notes and variables to the local state
    firebasedb.fetchBoard(this.props.id, (board) => {
      this.setState({ notes: Map(board.notes), title: board.title, count: board.count });
    });
  }

  getNotes() {
    // returns a list of notes in note component
    return this.state.notes.entrySeq().map(([key, value]) => (
      <Note
        key={key}
        id={key}
        onUpdate={(newProp) => this.updateNote(key, newProp)}
        onDelete={() => firebasedb.deleteNote(this.props.id, key)}
        note={value}
        boardId={this.props.id}
        count={this.state.count}
        user={this.props.user}
      />
    ));
  }

  onInputChange = (event) => {
    // onChange function for title bar for creating new note
    if (event.target.value.length <= 20) {
      this.setState({ searchterm: event.target.value });
    }
  }

  addNote() {
    // method for creating a new note when clicking submit button
    if (this.state.searchterm === '') {
      return;
    }

    // note object structure used also in Firebase
    // editor = null when no one is editing. Has user info(name, picture, id) if someone is editing.
    const note = {
      title: this.state.searchterm,
      text: '',
      x: Math.floor(Math.random() * 300),
      y: Math.floor(Math.random() * 300),
      width: 40,
      height: 200,
      zIndex: this.state.count,
      editor: null,
    };
    firebasedb.updateCount(this.props.id, this.state.count + 1);
    firebasedb.addNote(this.props.id, note);
    this.setState({ searchterm: '' });
  }

  updateNote(id, newNoteProperties) {
    // update notes based on changes such as positions, z-index, and contents
    const updatedNote = { ...this.state.notes.get(id), ...newNoteProperties };
    firebasedb.updateNote(this.props.id, id, updatedNote);
  }

  render() {
    return (
      <>
        <SearchBar
          onClick={() => this.addNote()}
          onInputChange={(e) => this.onInputChange(e)}
          searchterm={this.state.searchterm}
          title={this.state.title}
        />
        <div id="notesContainer">
          {this.getNotes()}
        </div>
      </>
    );
  }
}

export default NotePage;
