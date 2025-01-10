import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="cards">
        <div className="card">
          <p className="tip">Create Tasks</p>
          <p className="second-text">Add and organize your daily tasks</p>
        </div>
        <div className="card">
          <p className="tip">Track Progress</p>
          <p className="second-text">Monitor your task completion</p>
        </div>
        <div className="card">
          <p className="tip">Set Priorities</p>
          <p className="second-text">Manage tasks by importance</p>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cards {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    margin-top: 2rem;
  }

  .cards .card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    height: 150px;  // increased from 100px
    width: 300px;   // increased from 250px
    border-radius: 10px;
    color: white;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: 400ms;
  }

  .cards .card p.tip {
    font-size: 1.2em;  // increased from 1em
    font-weight: 700;
  }

  .cards .card p.second-text {
    font-size: 0.9em;  // increased from 0.7em
  }

  .cards .card:hover {
    transform: scale(1.1, 1.1);
  }

  .cards:hover > .card:not(:hover) {
    filter: blur(3px);
    transform: scale(0.95, 0.95);
  }`;

export default Card;
