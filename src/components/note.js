import React, { Component } from 'react';
import Draggable from 'react-draggable';
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import editImg from '../img/write.png';
import trashImg from '../img/garbage.png';
import checkImg from '../img/checked.png';

import { updateCount, updateEditor } from '../services/datastore';

class Note extends Component {
  // post it notes used in boards.
  constructor(props) {
    super(props);
    this.state = { editMode: false };
  }

  componentDidMount() {
    // used so that editor can be updated upon refresh.
    // whenever user leaves while editing.
    window.addEventListener('beforeunload', this.onUnload);
  }

  onContextChange = (event) => {
    // onChange for contents textarea
    const p = { text: event.target.value };
    this.props.onUpdate(p);
  }

  onTitleChange = (event) => {
    // onChange for title input
    if (event.target.value.length <= 25) {
      const p = { title: event.target.value };
      this.props.onUpdate(p);
    }
  }

  handleDragStart =() => {
    // called on start of note drag, updates editor info in firebase.
    if (!this.state.editMode) {
      updateEditor(this.props.boardId, this.props.id, this.props.user);
    }
  }

  handleDragStop =() => {
    // called at the end of note drag, updates editor info in firebase
    if (!this.state.editMode) {
      updateEditor(this.props.boardId, this.props.id, null);
    }
  }

  handleDrag = (e, data) => {
    // handles positional and z-index while dragging.
    if (this.props.note.zIndex < this.props.count - 1) {
      const p = { x: data.x, y: data.y, zIndex: this.props.count };
      this.props.onUpdate(p);
      updateCount(this.props.boardId, this.props.count + 1);
    } else {
      const p = { x: data.x, y: data.y };
      this.props.onUpdate(p);
    }
  }

  onUnload = (e) => {
    // set editor to null
    e.preventDefault();
    if (this.state.editMode) {
      updateEditor(this.props.boardId, this.props.id, null);
    }
  };

  // handle onClick for edit button
  handleEdit = () => {
    if (this.state.editMode) {
      if (this.props.note.text === '') {
        return;
      }
      updateEditor(this.props.boardId, this.props.id, null);
    } else {
      if (this.props.note.editor != null) {
        return;
      }
      updateEditor(this.props.boardId, this.props.id, this.props.user);
    }
    this.setState((prevState) => ({
      editMode: !prevState.editMode,
    }));
  }

  // handle onclick for delete button
  handleDelete = () => {
    if (this.props.note.editor != null && this.state.editMode === false) {
      return;
    }
    this.props.onDelete();
  }

  render() {
    // constants used to reformat md images that are too large
    // to fit into my fixed note size
    const MyImage = (props) => (
      <img
        className="markdownImg"
        alt={props.alt}
        src={props.src}
      />
    );
    const renderers = {
      img: MyImage,
    };

    return (
      <Draggable
        handle=".dragButton"
        grid={[5, 5]}
        position={{
          x: this.props.note.x, y: this.props.note.y,
        }}
        disabled={this.props.note.editor != null && !this.state.editMode}
        bounds="parent"
        onStart={this.handleDragStart}
        onDrag={this.handleDrag}
        onStop={this.handleDragStop}
      >
        <div className="note" style={{ zIndex: this.props.note.zIndex }}>
          {this.props.note.editor != null ? <img id="profileImg" src={this.props.note.editor.photoURL} alt="" /> : null}
          <header>
            {this.state.editMode ? <input type="text" value={this.props.note.title} onChange={this.onTitleChange} /> : <h1>{this.props.note.title}</h1>}
            <div className="dragButton" />
          </header>
          {this.state.editMode
            ? <TextareaAutosize className="textArea" onChange={this.onContextChange} minRows={3} value={this.props.note.text} placeholder="Provide non-empty contents here!" />
            : <ReactMarkdown className="noteText" components={renderers}>{this.props.note.text}</ReactMarkdown>}
          <footer>
            <input type="image" src={this.state.editMode ? checkImg : editImg} onClick={() => this.handleEdit()} alt="" />
            <input type="image" src={trashImg} onClick={() => this.handleDelete()} alt="" />
          </footer>
        </div>
      </Draggable>
    );
  }
}

export default Note;
