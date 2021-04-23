import React from 'react';

const SearchBar = (props) => (
  <div id="searchBarContainer">
    <input type="text" onChange={props.onInputChange} value={props.searchterm} />
    <input type="button" value="Submit" onClick={props.onClick} />
  </div>
);

export default SearchBar;
