# Todo App

This is a full-stack Todo application that allows users to manage their tasks efficiently. The app includes user authentication with JWT and provides a modern UI built with React and Material-UI.

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Responsive design using Material-UI
- Backend built with Node.js and Express
- MongoDB for data persistence

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (v4 or later)

## Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository

**Before cloning open VSCode or any other IDE and open the terminal in your desired directory

git clone https://github.com/eyalsegev123/Todo-app.git

cd Todo-app

### 2. Set Up the Backend
#### 1.Navigate to the backend directory:

cd backend

#### 2.Install dependencies:

npm install

#### 3.Create a .env file in the backend directory:

#### 4.Add the following environment variables to the .env file:

PORT=5001

MONGO_URI=mongodb://127.0.0.1:27017/todoDB

JWT_SECRET=8c07f141f430336f8f48b552e4e31b467ebff2f8b00942e9abbf9dd7fd1742fca5e507f076f5046e48e82a84211b14bacd61ce76482d6ddfd1dc3dd5c369b776

##### This is a JWT_SECRET I generated for this Project

#### 5.Start the MongoDB server (if not already running):

mongod --dbpath    your-mongo-data-directory

#### 6.Create the todoDB database in MongoDB:

Open a terminal and start the MongoDB shell:

mongosh

Run the following command to create the todoDB database:

use todoDB

#### 7.Create the users and tasks collection:

db.createCollection("users")
db.createCollection("tasks")


#### 8.Start the backend server (In a different terminal):

node server.js

The backend will be running at http://localhost:5001.

### 3. Set Up the Frontend
#### 1.Navigate to the frontend directory:

cd ../frontend

#### 2. Create a .env file:

Create a .env file in the frontend directory and add the following content:

REACT_APP_API_URL=http://localhost:5001/api

#### 3.Install dependencies:

npm install

#### 4.Start the React development server:

npm start

The frontend will be running at http://localhost:3000.

## Usage
Open your browser and go to http://localhost:3000.

Register a new user or log in with an existing account.

Manage your tasks via the tasks page.

## Notes
Ensure MongoDB is running locally or modify the MONGO_URI in .env to point to a remote MongoDB instance.
