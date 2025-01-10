import React from 'react';
import styled from 'styled-components';

const Button = ({ onClick }) => {  // Add onClick prop
  return (
    <StyledWrapper>
      <button onClick={onClick}>Go To Tasks</button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    padding: 17px 40px;
    border-radius: 50px;
    cursor: pointer;
    border: 0;
    background-color: white;
    box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-size: 15px;
    transition: all 0.5s ease;
  }

  button:hover {
    letter-spacing: 3px;
    background-color: #1a1a1a;  // Changed to matte black to match HomeCards
    color: hsl(0, 0%, 100%);
    box-shadow: rgba(0, 0, 0, 0.3) 0px 7px 29px 0px;  // Updated shadow to match dark theme
  }

  button:active {
    letter-spacing: 3px;
    background-color: hsl(261deg 80% 48%);
    color: hsl(0, 0%, 100%);
    box-shadow: rgb(93 24 220) 0px 0px 0px 0px;
    transform: translateY(10px);
    transition: 100ms;
  }`;

export default Button;
