import React from 'react';

const SearchBar = (props) => (
  // top bar section used in note page.
  // cntains title, text input and a button
  <div id="searchBarContainer">
    <h1>{props.title}</h1>
    <input type="text" onChange={props.onInputChange} value={props.searchterm} placeholder="New note title, max 20 char" />
    <input type="button" value="Submit" onClick={props.onClick} />
  </div>
);

export default SearchBar;
