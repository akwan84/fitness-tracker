# Fitness Tracker
This simple fitness tracker built using the MERN tech stack, specfically:
- A [MongoDB](https://www.mongodb.com/products/platform/atlas-database) Atlas database
- [ExpressJS](https://expressjs.com/) framework for building the backend REST API
- [React](https://react.dev/) for the front end
- [Node.js](nodejs.org/en) for the back end
- API documentation created with the [swagger-js](https://github.com/swagger-api/swagger-js) library
- [Docker](docker.com) to create a consistent environment for the frontend and backend
## Inspiration
Having gotten into weight training a few years ago, I started to understand the importance of tracking progress. Using the notes app on my phone was inconvenient and disorganized, and most fitness trackers I have tried were either too complicated, too simple, or too expensive. Realizing that all the features of a fitness tracker I would want to use could be built into a full-stack application led me to start this project.

## Installation and Set Up
### Required Installations
- [Docker Desktop](docker.com)
- [Git](https://www.atlassian.com/git/tutorials/install-git)
- [Node](https://nodejs.org/en/download/package-manager)

### Cloning the Repository
To download the code, click the Code button at the top of Github page and copy the HTTP link. Open your terminal or command prompt and type `git clone <link>` using the retrieved link to download the application code.

### Frontend Environment Variables
In the `frontend` directory, rename `.env.example` to `.env`. This will only contain 1 environment variable, `REACT_APP_API_URL`. This can be customized for a deployed API, but if running locally, the default `http://localhost:3500` will suffice. 

### Backend Environment Variables
In the `backend` directory, rename `.env.example` to `.env`. This has 3 variables. `DATABASE_URI` can also be customized to use another MongoDB instance, but if running locally, the default `mongodb://mongo:27017/Workouts` will use create and use a MongoDB Docker image.

For `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`, you need to generate 2 random cryto byte strings, which can be done with the following with `node` installed:
1. Open a terminal and type `node`, which should open the Node.js console
2. Type `require('crypto').randomBytes(64).toString('hex')` to get a random crypto bytes string needed for generating and verifying JWT tokens
3. You are going to need 2 of these (run the above command twice), copy them both without the quotes

### Running the Application
Using the terminal, navigate to the project folder `fitness-tracker`. Then to start up the backend, change directories to the `backend` folder and type
```
docker-compose up -d
```
Then to start the frontend, navigate to the `frontend` folder and type
```
docker-compose up -d
```
To check if everything is running fine, open Docker Desktop, and make sure that in the Containers tab, all running containers are green. With everything working, the application should be running locally, so open a web browser and type http://localhost:3000.

## Features
### Login and Registration
When launching the app for the first time, you will be greeted with the login page where you can choose to register a new user, or log in an existing user. By using a JWT access and refresh token for user verification, a user can stay logged in for 1 day before automatically being logged out.

### Workout Display Page
On this page, all workouts of the user will be displayed in small widgets containing the name and date of the workout sorted from most to least recent. Each of these widgets can be clicked on to see more information about the workout. Each of these widgets also contain a delete button to delete a selected workout.

### Viewing Workouts
When a widget from the home page is clicked, more information about a workout can be shown, including:
- Workout name
- Date
- Exercises performed
- Number of sets per exercise
- Weight and reps per set

It is also on this page where the option to update information about the workout can be done.

### Adding Workouts
Adding a new workout is very simple with a simple interface that can be used to add and remove exercises and sets. 

It is also on this page where users can create new exercises. The purpose for this is to allow for each exercise added to be selected from a dropdown rather than being typed, which makes gathering exercise history much easier. 

### Updating Workouts
Updating a workout uses the same interface used to add a new workout, just that information from the workout has already been filled in. This makes updating a workout very easy and seamless. 

### Exercise History
Exercise history is one of the most useful features of this application from a practicality standpoint, and one of the features I was not always able to get with fitness trackers I have used in the past. On this page, an exercise can be selected from the dropdown, and information about each time the exercise was performed would be displayed from most to least recent.

### Backend and API Developer Notes
For anyone looking play around with the API, it has been documented using [swagger-js](https://github.com/swagger-api/swagger-js). Not all the endpoints in this API are used in the entire application, but are there in case something were to be added in the future. With the backend running, type http://localhost:3500/swagger into your web browser and you should be able to see all the endpoints available. 

All the non-User endpoints require a JWT access token to use. So if using something like Postman or Insomnia to test endpoints, you need to run the `/login` or `/refresh` endpoints to get a fresh access token, and add that token to the bearer token section for authorization.

Additionally, if you want to view the contents of the database, the [mongo-express](https://hub.docker.com/_/mongo-express) Docker image makes viewing and adding/updating data very easy. With the backend running, go to http://localhost:8083. 

## Future Plans
### Better Paging
On the exercise history and workout information page, the number of results are limited and displayed in pages. The main issue of how this is being implemented in the backend is that it still requires loading in all search results from the database query and pulling out the desired section. At small scale, this would not be a problem, but will if/when the amount of data gets large. Having chosen to use the [Mongoose](https://mongoosejs.com/docs/) library for easy database queries and object mapping, investigation into better paging techniques or libraries may be something to look more in to.

### Deletion of Exercises
Something more simple but useful would be being able to delete exercises. Once an exercise is created, it can not be deleted or edited, which may be an inconvenience to a user. 

### Friending Features
Creating some sort of friending feature would be a unique thing to have. This would involve having to set up some kind of profile for every user, allowing them to showcase things like personal records, past workouts, and many other things