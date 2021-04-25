import React from 'react';
import { Map } from 'immutable';
import SearchBar from './searchBar';
import Note from './note';
import * as firebasedb from '../services/datastore';

class NotePage extends React.Component {
  constructor() {
    super();
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      notes: Map(),
      searchterm: '',
      title: '',
      count: 0,
    };
  }

  componentDidMount() {
    firebasedb.fetchBoard(this.props.id, (board) => {
      this.setState({ notes: Map(board.notes), title: board.title, count: board.count });
    });
  }

  getNotes() {
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
    // this.props.onSearchChange(event.target.value);
    if (event.target.value.length <= 25) {
      this.setState({ searchterm: event.target.value });
    }
  }

  addNote() {
    if (this.state.searchterm === '') {
      return;
    }
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
    // const id = this.state.count;
    // this.setState((prevState) => ({
    //   notes: prevState.notes.set(id, note),
    //   count: prevState.count + 1,
    // }));
  }

  updateNote(id, newNoteProperties) {
    // this.setState((prevState) => ({
    //   notes: prevState.notes.update(id, (prevNote) => ({ ...prevNote, ...newNoteProperties })),
    // }));
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
