# ROLE BASED ACCESS CONTROL

This project is a full-stack application with a frontend built using React and a backend built using Node.js. Below are the instructions for cloning the repository, installing dependencies, and running the application.

## Prerequisites

Before you start, ensure that you have the following installed:

- **Git**: To clone the repository.
- **Node.js and npm**: For installing dependencies and running the project.
- **Nodemon** (for backend): For automatic server restarts during development.

## Clone the Repository

Start by cloning the repository to your local machine. Use the following command in your terminal:

git clone https://github.com/Mihir355/RBAC.git

## Install Dependencies
After cloning the repository, you will have two main directories: frontend and backend.

1. Install Frontend Dependencies
-Navigate to the frontend folder:
cd frontend

-Install the necessary packages listed in the package.json file using npm:
npm install

2. Install Backend Dependencies
-Next, navigate to the backend folder:
cd ../backend

-Install the necessary packages for the backend:
npm install

## Running the Application
1. Run the Frontend
-To run the frontend React application, follow these steps:
-Navigate to the frontend/src folder:

cd frontend/src

-Open the integrated terminal and run the following command to start the React development server:

npm start

-This will start the React frontend application, which will be accessible at http://localhost:3000.

2. Run the Backend
-To run the backend server, follow these steps:
-Navigate to the backend folder:

cd ../backend

-Open the integrated terminal in this folder and run the following command:

nodemon server.js

-This will start the backend server, typically accessible at http://localhost:5000.

## Accessing the Application
-Frontend: Once the frontend server is running, open your browser and navigate to http://localhost:3000.
-Backend: The backend API will be running at http://localhost:5000. Ensure that the frontend and backend servers are both running for the application to work correctly.
-Environment Variables
If your project requires specific environment variables (such as API keys or database URIs), make sure to create a .env file in both the frontend and backend directories and add the necessary variables. Here is an example for the backend:

MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=5000
