import React, { Component } from 'react';
import Draggable from 'react-draggable';
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import editImg from '../img/write.png';
import trashImg from '../img/garbage.png';

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.note.text, editMode: false };
  }

  onInputChange = (event) => {
    this.setState({ text: event.target.value });
  }

  handleDrag = (e, data) => {
    const p = { x: data.x, y: data.y };
    console.log(p);
    this.props.onUpdate(p);
  }

  handleEdit = () => {
    this.setState((prevState) => ({
      editMode: !prevState.editMode,
    }));
  }

  render() {
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
        onStart={this.handleStartDrag}
        onDrag={this.handleDrag}
        onStop={this.handleStopDrag}
      >
        <div className="note">
          {/* style={{ top: `${this.props.note.y}`, left: `${this.props.note.x}` }} */}
          <header>
            <h1>{this.props.note.title}</h1>
            <div className="dragButton" />
          </header>
          {this.state.editMode
            ? <TextareaAutosize className="textArea" onChange={this.onInputChange} minRows={3}>{this.state.text}</TextareaAutosize>
            : <ReactMarkdown className="noteText" components={renderers}>{this.state.text}</ReactMarkdown>}
          <footer>
            <input type="image" src={editImg} onClick={() => this.handleEdit()} alt="" />
            <input type="image" src={trashImg} onClick={this.props.onDelete} alt="" />
          </footer>
        </div>
      </Draggable>
    );
  }
}

export default Note;