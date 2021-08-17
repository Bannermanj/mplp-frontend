import React, { useState, useEffect } from "react";
import "./Login.scss";
import { withRouter } from "react-router-dom";
import {TextField, Select, MenuItem, InputLabel, FormControl} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import axios from "axios";

import { teams } from "../../utils/Teams";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    textFields: {
      width: "75%",
      marginBottom: 15,
      display: "flex",
      alignSelf: "center",
    },
    error: {
      color: 'red'
    }
  })
);

const Login = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [favoriteTeam, setFavoriteTeam] = useState("");

  const { history } = props;

  const regex = /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
  const phoneMatch = phone.match(regex);
  let loginExpiration = new Date(new Date());
  loginExpiration.setHours(loginExpiration.getHours() + 3);


  useEffect(() => {
    if (localStorage.getItem('uuid')) {
      history.push(`/predictions/${localStorage.getItem('uuid')}`);
    }
  },[])

  const classes = useStyles();
  const handleLogin = () => {
    // "http://ec2-18-232-101-239.compute-1.amazonaws.com:3000/api/login",
    setIsNewUser(false);
    setError(null);
    if (password && username) {
      axios
        .post(
          "http://localhost:3001/api/login",
          {
            username,
            password,
          }
        )
        .then(function (response) {
          if (response.data.id) {
            localStorage.setItem('username', JSON.stringify(username));
            localStorage.setItem('favoriteTeam', JSON.stringify(favoriteTeam));
            localStorage.setItem('uuid', JSON.stringify(response.data.id));
            localStorage.setItem('loginExpiration', loginExpiration);
            history.push(`/predictions/${response.data.id}`);
          }
        })
        .catch(function (error) {
          if (error.message.includes('404')) {
            setError('User not found');
          }
          if (error.message.includes('403')) {
            setError('Invalid username/password');
          }
        });
    }
    else {
      setError('Username and/or password cannot be blank')
    }
  };
  const handleRegister = () => {
    setIsNewUser(true);
    setError(null);

    if (!phoneMatch) {
        setError('Invalid phone number: format (000-000-0000)')
    }
    if (!username) {
      setError('Username cannot be blank');
    }
    if (!password) {
      setError('Password cannot be blank');
    }
    if (password !== confirmPassword) {
      setError('Passwords must match');
    }
    if (username && password && password === confirmPassword && phoneMatch) {
      axios
      .post(
        "http://localhost:3001/api/login/new",
        {
          username,
          password,
          phone,
          favoriteTeam
        }
      )
      .then(function (response) {
        if (response.data.id) {
          localStorage.setItem('username', JSON.stringify(username));
          localStorage.setItem('favoriteTeam', JSON.stringify(favoriteTeam));
          localStorage.setItem('uuid', JSON.stringify(response.data.id));
          localStorage.setItem('loginExpiration', loginExpiration);
          history.push(`/predictions/${response.data.id}`);
        }
      })
      .catch(function (error) {
        if (error.message.includes('403')) {
            setError('Username already taken');
          }
      });
    }
  }

  return (
    <div className="login__container">
      <div className="login__container-inner">
        <h1>
          {!isNewUser ? 'Welcome Back!' : null } <br />
          {!isNewUser ? null : "Let's get you signed up!"}
        </h1>
        <TextField
          className={classes.textFields}
          id="filled-number"
          label="Username"
          type="string"
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!username}
        />
        <TextField
          className={classes.textFields}
          id="filled-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!password || password !== confirmPassword}
        />
        {isNewUser && (
          <>
            <TextField
              className={classes.textFields}
              id="filled-password-input"
              label="Confirm Password"
              type="password"
              variant="filled"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!confirmPassword || password !== confirmPassword}
            />
            <TextField
              className={classes.textFields}
              id="filled-phone-input"
              label="Phone Number"
              type="string"
              variant="filled"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!phoneMatch}
            />
            <FormControl error={!favoriteTeam} className={classes.textFields}>
              <InputLabel id="favTeam-simple-select-label">Favorite Team</InputLabel>
              <Select
                labelId="favTeam-simple-select-label"
                label="Favorite EPL Team"
                id="demo-simple-select"
                variant="filled"
                value={favoriteTeam}
                onChange={(e) => setFavoriteTeam(e.target.value)}
              >
                {teams.map((team, i) => (
                  <MenuItem key={`${i}-${team}`} value={team.name}><img src={team.logo}/>{team.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        <div className={isNewUser ? 'col-reverse btn-wrapper' : 'btn-wrapper'}>
          <button className="login-btn" onClick={handleLogin}>Login</button>
          <button className="register-btn" onClick={handleRegister}>Register</button>
        </div>
        {error && <p className={classes.error}>{error}</p>}
      </div>
    </div>
  );
};

export default withRouter(Login);
