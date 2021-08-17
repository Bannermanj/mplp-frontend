import React, { useState, useEffect } from "react";
import "./PredictionContainer.scss";
import classnames from "classnames";
import { teams, initialTeam } from "../../utils/Teams";
import axios from "axios";
import { withRouter } from "react-router-dom";

const PredictionContainer = props => {
  const [selectedTeam, setSelectedTeam] = useState({});
  const [remainingTeams, setRemainingTeams] = useState(20);
  const [userPositions, setUserPositions] = useState(initialTeam);
  const [submitted, setSubmitted] = useState(false);
  const { match } = props;

  useEffect(() => {
    axios
      .get(
        `http://ec2-18-232-101-239.compute-1.amazonaws.com:3001/api/predictions/${match.params.id}`
      )
      .then(function (response) {
        if (response.data.prediction.length > 0) {
          setUserPositions(response.data.prediction[0].prediction);
          let minusTeams = 0;
          response.data.prediction[0].prediction.map((prediction) => {
            if (prediction.name) {
              minusTeams++;
            }
            return minusTeams;
          });
          setRemainingTeams(remainingTeams - minusTeams);
        }
      });
  }, []);

  function moveSelectedTeam(index) {
    if (selectedTeam.name) {
      userPositions[index] = selectedTeam;
      setUserPositions(userPositions);
      setSelectedTeam({});
      setRemainingTeams(remainingTeams - 1);
    } else {
      if (userPositions[index].name) {
        setRemainingTeams(remainingTeams + 1);
      }
      let newUserPositionsArray = [...userPositions];
      newUserPositionsArray[index] = {};
      setUserPositions(newUserPositionsArray);
    }
  }

  function handleSelectedTeam(team) {
    return team !== selectedTeam ? setSelectedTeam(team) : setSelectedTeam({});
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post(
        "http://ec2-18-232-101-239.compute-1.amazonaws.com:3001/api/predictions",
        {
          userPositions,
          uuid: match.params.id,
        }
      )
      .then(function (response) {
        setSubmitted(true);
      })
      .catch(function (error) {
        setSubmitted(false);
      });
  }

  function handleReset() {
    setUserPositions([
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ]);
    setRemainingTeams(20);
  }

  return (
    <div className="prediction__container">
      <h1>
        {submitted ? `Picks Submitted!` : "My Predictions"}
      </h1>
      <div className="prediction__reset-row">
        <button onClick={handleReset} className="reset-btn">
          Reset Picks
        </button>
        <button onClick={handleSubmit} className="submit-btn">
          {submitted ? "Submitted!!!" : "Submit Picks"}
        </button>
      </div>
      <div className="prediction__row">
        <div className="prediction__column-league-table">
          <h2>Teams Remaining: {remainingTeams}</h2>
          {teams.map((team, index) => (
            <div
              onClick={() => handleSelectedTeam(team)}
              key={`${team.name}-${index}`}
              className={classnames("prediction__column-row", {
                selected: team === selectedTeam,
                hidden: userPositions.find(
                  (userTeam) => userTeam.name === team.name
                ),
              })}
            >
              <img src={team.logo} />
              <h3>{team.name}</h3>
            </div>
          ))}
        </div>
        <div className="prediction__column-user-table">
          {userPositions.map((team, index) => (
            <div
              key={`${team.name}-${index}`}
              onClick={() => moveSelectedTeam(index)}
              className={classnames("prediction__column-row-user", {
                champion: index === 0,
                championsleague: index === 3,
                europaleague: index === 4,
                europaconfleague: index === 5,
                relegation: index > 16,
              })}
            >
              <h2>{index + 1}</h2>
              <div className="prediction__column-row-inner">
                <img src={team.logo} />
                <h3>{team.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withRouter(PredictionContainer);
