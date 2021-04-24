import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { Map } from 'immutable';
import SearchBar from './components/searchBar';
import Note from './components/note';
import * as firebasedb from './services/datastore';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      notes: Map(),
      searchterm: '',
    };
  }

  componentDidMount() {
    firebasedb.fetchNotes((notes) => {
      this.setState({ notes: Map(notes) });
    });
  }

  getNotes() {
    return this.state.notes.entrySeq().map(([key, value]) => (
      <Note
        onUpdate={(newProp) => this.updateNote(key, newProp)}
        onDelete={() => firebasedb.deleteNote(key)}
        note={value}
      />
    ));
  }

  onInputChange = (event) => {
    // this.props.onSearchChange(event.target.value);
    this.setState({ searchterm: event.target.value });
    console.log(this.state.searchterm);
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
      zIndex: 0,
    };
    firebasedb.addNote(note);
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
    firebasedb.updateNote(id, updatedNote);
  }

  render() {
    return (
      <div id="mainBoard">
        <SearchBar
          onClick={() => this.addNote()}
          onInputChange={(e) => this.onInputChange(e)}
          searchterm={this.state.searchterm}
        />
        <div id="notesContainer">
          {this.getNotes()}
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('main'));
