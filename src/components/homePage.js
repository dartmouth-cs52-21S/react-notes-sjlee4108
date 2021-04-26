import React, { useState } from 'react';
import {
  Link,
} from 'react-router-dom';
import trashImg from '../img/garbage.png';

import { addExistBoard, addNewBoard, removeBoard } from '../services/datastore';

const getBoardList = (boards, userId) => Object.entries(boards).map(([key, value]) => (
  <li key={key}>
    <Link key={key} to={`/${key}`}>{value.title}</Link>
    <input type="image" src={trashImg} onClick={() => removeBoard(userId, key)} alt="" />
  </li>

));

const HomePage = (props) => {
  const [textBox, setTextBox] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const onChangeTextbox = (e) => {
    if (e.target.value.length <= 30) {
      setErrorMsg('');
      setTextBox(e.target.value);
    } else {
      setErrorMsg('Must be less than 31 characters');
    }
  };

  const onClickNewBoard = () => {
    if (textBox.length !== 0) {
      addNewBoard(props.user.uid, textBox);
      setTextBox('');
    } else {
      setErrorMsg('Need a title');
    }
  };

  const onClickExistBoard = () => {
    if (textBox.length !== 0) {
      addExistBoard(props.user.uid, textBox, () => setErrorMsg('Invalid key'));
      setTextBox('');
    } else {
      setErrorMsg('Need a key');
    }
  };

  return (
    <div id="homepage">
      <div id="welcomeSection">
        <h1>Note Share</h1>
        <h2>Share post-it notes with your friends, teammates and co-workers in real time.</h2>
      </div>
      <div id="profileSection">
        {props.user == null
          ? <input type="button" id="googleButton" value="Google Sign In" onClick={props.login} />
          : (
            <div id="profile">
              <input type="button" id="logout" value="SIGN OUT" onClick={props.logout} />
              <div id="nameSection">
                <img src={props.user.photoURL} alt="" />
                <h1>{props.user.displayName}</h1>
              </div>
              <input type="text"
                onChange={onChangeTextbox}
                placeholder="New title or existing board key"
                value={textBox}
              />
              <span>{errorMsg}</span>
              <div id="buttonContainer">
                <input type="button" value="New Board" onClick={() => onClickNewBoard()} />
                <input type="button" value="Existing Board" onClick={() => onClickExistBoard()} />
              </div>
              <div id="boardContainer">
                <ul>
                  {props.boards != null ? getBoardList(props.boards, props.user.uid) : null}
                </ul>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default HomePage;
