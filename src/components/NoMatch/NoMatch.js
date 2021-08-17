import React from "react";
import { Link } from "react-router-dom";
import "./NoMatch.scss";

const NoMatch = () => {
  return (
    <div className="nomatch__container">
      <h1>Whoops! Looks like you need to login huh? 😅</h1>
      <h3>
        <Link to="/">Home</Link>
      </h3>
    </div>
  );
};

export default NoMatch;
