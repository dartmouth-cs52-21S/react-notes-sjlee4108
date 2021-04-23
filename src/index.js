import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { Map } from 'immutable';
import SearchBar from './components/searchBar';
import Note from './components/note';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      notes: Map(),
      count: 10,
      searchterm: '',
    };
  }

  getNotes() {
    return this.state.notes.entrySeq().map(([key, value]) => (
      <Note
        onUpdate={(newProp) => this.updateNote(key, newProp)}
        onDelete={() => this.deleteNote(key)}
        note={value}
      />
    ));
  }

  onInputChange = (event) => {
    // this.props.onSearchChange(event.target.value);
    this.setState({ searchterm: event.target.value });
    console.log(this.state.searchterm);
  }

  deleteNote(id) {
    this.setState((prevState) => ({
      notes: prevState.notes.delete(id),
    }));
  }

  addNote() {
    const note = {
      title: this.state.searchterm,
      text: '',
      x: 15,
      y: 15,
      zIndex: 0,
    };
    const id = this.state.count;
    this.setState((prevState) => ({
      notes: prevState.notes.set(id, note),
      count: prevState.count + 1,
    }));
  }

  updateNote(id, newNoteProperties) {
    this.setState((prevState) => ({
      notes: prevState.notes.update(id, (prevNote) => ({ ...prevNote, ...newNoteProperties })),
    }));
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
