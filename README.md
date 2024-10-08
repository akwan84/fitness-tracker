# Fitness Tracker
This simple fitness tracker built using the MERN tech stack, specfically:
- A [MongoDB](https://www.mongodb.com/products/platform/atlas-database) Atlas database
- [ExpressJS](https://expressjs.com/) framework for building the backend REST API
- [React](https://react.dev/) for the front end
- [Node.js](nodejs.org/en) for the back end
- API documentation created with the [swagger-js](https://github.com/swagger-api/swagger-js) library
## Inspiration
Having gotten into weight training a few years ago, I started to understand the importance of tracking progress. Using the notes app on my phone was inconvenient and disorganized, and most fitness trackers I have tried were either too complicated, too simple, or too expensive. Realizing that all the features of a fitness tracker I would want to use could be built into a full-stack application led me to start this project.

## Installation and Set Up
### Node and NPM
Make sure you have a fairly new version of `node` installed on your computer. I built this project with `18.7.0`, so this and newer versions should be okay. Installation instructions can be found [here](https://nodejs.org/en/download/package-manager).

### MongoDB Atlas Setup
1. Head to [mongodb.com](http://mongodb.com) and create an account
2. Create a new project and set up user access permissions if needed
3. Go to the "Database" tab and select the tier you want. For each project, you get up to 1 free tier cluster (which is what I have been using)
4. Choose a cloud provider and region (I used AWS, but it should not matter). Everything else can be left as default
5. Go back to the "Database" tab and a cluster should be created
6. Click "Browse Collections", then "Create Database"
7. Create a new database called "Workouts", and create 3 collections:
    - exercises
    - users
    - workouts
8. Go to the "Security" section and click "Database Access", and "Add New Database User"
9. Choose "Password" and create a username and password allow read and write access
10. Go back to the "Databases" tab and click "Connect"
11. For connection setup, add any IPs you may want being able to access the database. Or to allow access from anywhere, just put in `0.0.0.0/0`
12. Move to "Choose a connection method" and select "Node.js". You will receive a connection string in this format:

```
mongodb+srv://<username>:<password>@workouts.28rasq9.mongodb.net/Workouts?retryWrites=true&w=majority&appName=Workouts
```
This will be the connection string you will need in the environment variables


### Access and Refresh Tokens
First off, ensure you have Node.js installed on your computer. You can check this by typing `node --version` and see if a version pops up.

1. Open a terminal and type `node`, which should open the Node.js console
2. Type `require('crypto').randomBytes(64).toString('hex')` to get a random crypto bytes string needed for generating and verifying JWT tokens
3. You are going to need 2 of these (run the above command twice), copy them both without the quotes

### Installing Dependencies
With `node` installed on your computer, navigate to the project in your terminal and type `npm install` to install all the needed dependencies for the project.

### Environment Variable Setup
Open the project up in your file explorer or IDE and in the root of the project, create a `.env` file and add the following content:

```
ACCESS_TOKEN_SECRET=XXXXXX
REFRESH_TOKEN_SECRET=XXXXXX
DATABASE_URI=XXXXXX
```
Replace the Xs in `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` with the 2 generated byte strings, and `DATABASE_URI` with the URI received from Mongo. 

### Running the Application
There are 2 parts to this project; the frontend and the backend. 

To launch the backend, type `npm run dev` in the terminal from the root of the project. You will know it succeeded if the terminal says:

```
Connected to MongoDB
Server running on port 3500
```

To launch the frontend, type `npm start` in seperate terminal tab, and a url should be provided that you can type into a web browser to view the application.
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

### API Notes
For anyone looking play around with the API, it has been documented using [swagger-js](https://github.com/swagger-api/swagger-js). Not all the endpoints in this API are used in the entire application, but are there in case something were to be added in the future. With the Node server running, type `localhost:3500/swagger` into your web browser and you should be able to see all the endpoints available. 

All the non-User endpoints require a JWT access token to use. So if using something like Postman or Insomnia to test endpoints, you need to run the `/login` or `/refresh` endpoints to get a fresh access token, and add that token to the bearer token section for authorization.

## Future Plans
### Better Paging
On the exercise history and workout information page, the number of results are limited and displayed in pages. The main issue of how this is being implemented in the backend is that it still requires loading in all search results from the database query and pulling out the desired section. At small scale, this would not be a problem, but will if/when the amount of data gets large. Having chosen to use the [Mongoose](https://mongoosejs.com/docs/) library for easy database queries and object mapping, investigation into better paging techniques or libraries may be something to look more in to.

### Deletion of Exercises
Something more simple but useful would be being able to delete exercises. Once an exercise is created, it can not be deleted or edited, which may be an inconvenience to a user. 

### Friending Features
Creating some sort of friending feature would be a unique thing to have. This would involve having to set up some kind of profile for every user, allowing them to showcase things like personal records, past workouts, and many other things