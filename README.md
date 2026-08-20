# Tic Tac Toe

## Description

A two-player Tic Tac Toe browser game built as a JavaScript learning project inspired by The Odin Project.

## Features

- Two player name inputs
- X and O turns
- Occupied-cell protection
- Win detection for rows, columns, and diagonals
- Tie detection
- Start and restart controls
- Responsive layout
- Keyboard focus styles and semantic buttons

## Technologies Used

- HTML
- CSS
- Vanilla JavaScript
- Git

## How to Play

1. Enter a name for each player.
2. Select **Start Game**.
3. Players take turns selecting empty cells.
4. The first player to complete a row, column, or diagonal wins.
5. Select **Restart Game** to play again with the same names.

## Project Structure

- `index.html` contains the page structure and controls.
- `style.css` contains the responsive layout and visual styling.
- `script.js` contains the Gameboard, Player, GameController, and DisplayController logic.
- `.github/agents/javascript-mentor.agent.md` contains the project-specific JavaScript mentoring agent.

## What I Learned

- Organizing game state with an IIFE and private variables
- Creating players with a factory function
- Separating game rules from DOM logic
- Using arrays, `some()`, and `every()` for win and tie detection
- Handling forms and click events with the DOM
- Preventing invalid moves and managing game state
- Testing browser behavior and using Git milestones

## Future Improvements

- Add a visible winning-line highlight
- Add a score counter across rounds
- Add an optional computer opponent
- Add more automated tests for the game rules
