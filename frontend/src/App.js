import React, { useState, useEffect } from 'react';
import WorkoutDisplay from './WorkoutDisplay';
import WorkoutInfo from './WorkoutInfo';
import AddWorkoutForm from './AddWorkoutForm';
import ExerciseHistory from './ExerciseHistory';
import Login from './Login';
import Register from './Register';
import Header from './Header';

import { useContext } from 'react';
import PageContext from './context/PageContext';
import DataContext from './context/DataContext';
import RequestContext from './context/RequestContext';

function App() {
  const { showWorkouts, showWorkoutInfo, showAddWorkoutForm, showUpdateWorkoutForm, showExerciseHistoryPage } = useContext(PageContext)
  const { displayWorkout, setWorkoutData, setUserExercises } = useContext(DataContext);
  const { handleWorkoutsRefresh, handleExerciseRefresh, makeRequest, handleRefresh, token, setToken, isLoggedIn, setIsLoggedIn} = useContext(RequestContext);

  const PAGE_SIZE = 5;

  // state to store username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // state to store registration info
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // data states
  const [curPage, setCurPage] = useState(1);

  //log in a user
  const handleLogin = async () => {
    const user = username;
    const pwd = password;
    try {
      //call the log in endpoint
      const response = await fetch(process.env.REACT_APP_API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({user, pwd})
      });

      //throw errors if the status codes indicate an error
      if(response.status === 400) throw new Error('Bad request body');
      if(response.status === 401) throw new Error('Unauthorized');
      if(response.status === 404) throw new Error('User not found');

      //log and store the access token
      const data = await response.json();
      setToken(data["accessToken"]);
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');

      //refresh the display workouts with the new page 1
      const workouts = await handleWorkoutsRefresh(data["accessToken"]);
      setWorkoutData(workouts);

      //refetch the user exercises
      const exercises = await handleExerciseRefresh(data["accessToken"]);
      setUserExercises(exercises.exercises);

    } catch(err) {
      //raise an alert upon any error
      alert(err.message);
    }
  };

  //Log a user out
  const handleLogout = async () => {
    try {
      //call the log in endpoint
      const response = await fetch(process.env.REACT_APP_API_URL + '/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      //throw errors if the status codes indicate an error
      if(response.status === 500) throw new Error('Internal server error');

      //clear the access token update login state
      setToken('');
      setIsLoggedIn(false);
    } catch(err) {
      //raise an alert if an error occurs
      alert(err.message);
    }
  };

  //if the refresh token is still valid, keep the user logged in and provide a new access token
  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleRefresh();
      } catch (err) {
        console.log(err.message);
      }
    };
  
    fetchData();
  }, []);

  const handleRegister = async () => {
    //make sure all fields are filled in
    if(!regUsername || !regPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    //make sure password and confirmation are the same
    if(regPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = regUsername;
    const pwd = regPassword;

    try{
      //call the registration endpoint
      const response = await fetch(process.env.REACT_APP_API_URL + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ user, pwd })
      });

      //catch duplicate user and other errors
      if(response.status === 409) {
        alert(`Username ${regUsername} has been taken`);
        return;
      }
      if(response.status === 500) {
        alert("Error in registration");
        return;
      }

      //upon successful registration, clear the registration fields
      alert("Registration Successful");
      setRegUsername('');
      setRegPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert(err.message);
    }
  }
  
  const getNextPage = async () => {
    try {
      //request the next page of the workouts data
      const response = await makeRequest(`workout?pageSize=${PAGE_SIZE}&page=${curPage + 1}`, 'GET', token, null);
      if(response.status !== 200) {
        alert(`Error getting next page, status code ${response.status}`);
        return;
      }

      //if successful, display the next page of data, if not, stay on the same page
      if(response.data.workouts.length > 0) {
        setWorkoutData(response.data);
        setCurPage(curPage + 1);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  const getPrevPage = async () => {
    try {
      //make sure there is a previous page to go to
      if(curPage > 1){
        const response = await makeRequest(`workout?pageSize=${PAGE_SIZE}&page=${curPage - 1}`, 'GET', token, null);
        if(response.status !== 200) {
          alert(`Error getting previous page, status code ${response.status}`);
          return;
        }

        setWorkoutData(response.data);
        setCurPage(curPage - 1);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        showWorkouts ? (
          <div className="appPage">
            <Header handleLogout={handleLogout}/>
            <WorkoutDisplay/>
            <br/>
            <button className="pageToggleButton" onClick={getPrevPage} style={{marginLeft:"35%"}}>Previous</button>
            <div className="pageToggleNum"><p>{curPage}</p></div>
            <button className="pageToggleButton" onClick={getNextPage}>Next</button>
          </div>
        ) : showWorkoutInfo ? (
          <WorkoutInfo />
        ) : showAddWorkoutForm ? (
          <AddWorkoutForm
            update={false}
            id={null}
            workoutData={null} 
          />
        ) : showUpdateWorkoutForm ? (
          <AddWorkoutForm
            update={true}
            id={displayWorkout["_id"]}
            workoutData={displayWorkout}
          />
        ) : showExerciseHistoryPage ? (
          <ExerciseHistory/>
        ) : (
          <h2>Error</h2>
        )
      ) : (
        <div className="loginPage">
          <br />
          <Login
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
          <br />
          <br />
          <Register
            regUsername={regUsername}
            setRegUsername={setRegUsername}
            regPassword={regPassword}
            setRegPassword={setRegPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleRegister={handleRegister}
          />
        </div>
      )}
    </div>
  );
}

export default App;
