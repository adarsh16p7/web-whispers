# Web Whispers

### Project Description
Web Whispers is a blog application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to sign up, log in, and perform CRUD (Create, Read, Update, Delete) operations on blog posts. Users can edit or delete only the posts they have created, ensuring proper authentication and authorization.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Table of Contents

- [Web Whispers](#web-whispers)
    - [Project Description](#project-description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Environment Variables](#environment-variables)
    - [Frontend Setup](#frontend-setup)
    - [Usage](#usage)
  - [*Available Scripts*](#available-scripts)
  - [Backend](#backend)
    - [`yarn dev`](#yarn-dev)
    - [`yarn start`](#yarn-start)
    - [`yarn prod`](#yarn-prod)
  - [Frontend](#frontend)
    - [`yarn start`](#yarn-start-1)
    - [`yarn build`](#yarn-build)
    - [`yarn test`](#yarn-test)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)
  - [Learn More](#learn-more)
  - [Code Splitting](#code-splitting)
  - [Analyzing the Bundle Size](#analyzing-the-bundle-size)
  - [Making a Progressive Web App](#making-a-progressive-web-app)
  - [Advanced Configuration](#advanced-configuration)
  - [Deployment](#deployment)
  - [`yarn build` fails to minify](#yarn-build-fails-to-minify)


## Installation

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js
- Yarn (Package manager)
- MongoDB

### Backend Setup

1. Clone the repository.
   ```sh
   git clone https://github.com/adarsh16p7/web-whispers.git
   ```

2. Navigate to the backend directory
   ```sh
   cd web-whispers/backend
   ```

3. Install backend dependencies
   ```sh
   yarn install
   ```
4. For development, you can use nodemon to automatically restart the server on file changes:

   ```sh
   yarn global add nodemon
   nodemon index.js
   ```

### Environment Variables

Create a .env file in the backend directory with the following environment variables:

```
MONGODB_URI=mongodb+srv://adarshpatel0716:0izHWYUVNhSW3WlH@web-whispers-cluster.6lpokdf.mongodb.net/?retryWrites=true&w=majority&appName=web-whispers-cluster
JWT_SECRET=iuebyrc28746287c52bfweydui19e8mifduify34875872edcuegfy

```

### Frontend Setup

1. Navigate to the frontend directory
   ```sh
   cd ../frontend
   ```

2. Install frontend dependencies
   ```sh
   yarn install
   ```

3. Start the frontend server
   ```sh
   yarn start
   ```

### Usage
   Open your browser and go to http://localhost:3000 to access the application.
   
## *Available Scripts*

## Backend

In the backend directory, you can run:

### `yarn dev`

Runs the backend server in development mode using nodemon.

### `yarn start`

Runs the backend server in production mode using node.

### `yarn prod`

Runs the backend server in production mode using pm2.

## Frontend

In the frontend directory, you can run:

### `yarn start`

Runs the app in development mode.
Open http://localhost:3000 to view it in your browser.
The page will reload when you make changes.
You may also see any lint errors in the console.

### `yarn build`

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `yarn test`

Launches the test runner in the interactive watch mode.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

Your Name - *adarsh.patel0716@gmail.com*

Project Link:  *[https://github.com/adarsh16p7/web-whispers](https://github.com/your_username/web-whispers)*

## Learn More

You can learn more in the Create React App documentation.
To learn React, check out the React documentation.

## Code Splitting

This section has moved here: [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

## Analyzing the Bundle Size

This section has moved here: [Analyzing the Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

## Making a Progressive Web App

This section has moved here: [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

## Advanced Configuration

This section has moved here: [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

## Deployment

This section has moved here: [Deployment](https://facebook.github.io/create-react-app/docs/deployment)

## `yarn build` fails to minify

This section has moved here: [Yarn Build Fails to Minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
