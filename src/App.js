import React, { useState, useEffect } from 'react';
import WorkoutDisplay from './WorkoutDisplay';
import WorkoutInfo from './WorkoutInfo';
import AddWorkoutForm from './AddWorkoutForm';
import ExerciseHistory from './ExerciseHistory';

function App() {
  const PAGE_SIZE = 5;

  // state to store username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // state to store registration info
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // access token
  const [token, setToken] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // data states
  const [workoutData, setWorkoutData] = useState(null);
  const [userExercises, setUserExercises] = useState([]);
  const [displayWorkout, setDisplayWorkout] = useState({});
  const [curPage, setCurPage] = useState(1);

  // states to manage what page to show
  const [showWorkouts, setShowWorkouts] = useState(true);
  const [showWorkoutInfo, setShowWorkoutInfo] = useState(false);
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false);
  const [showUpdateWorkoutForm, setShowUpdateWorkoutForm] = useState(false);
  const [showExerciseHistoryPage, setShowExerciseHistoryPage] = useState(false);

  const handleWorkoutsRefresh = async(token) => {
    const res = await makeRequest(`workout?pageSize=${PAGE_SIZE}&page=1`, 'GET', token, null);
    if(res.status !== 200) {
      throw new Error(res.message);
    }
    return res.data;
  }

  const handleExerciseRefresh = async(token) => {
    const res = await makeRequest('exercise', 'GET', token, null);
    if(res.status !== 200) {
      throw new Error(res.message);
    }
    return res.data;
  }

  //Method to refresh the access token
  const handleRefresh = async () => {
    //call the refresh token endpoint
    const response = await fetch('http://localhost:3500/refresh', {
      method: 'GET',
      credentials: 'include', 
    });

    //throw errors in the response is a 401 or 403
    if(response.status === 401) {
      setIsLoggedIn(false);
      throw new Error('Unauthorized');
    }

    if(response.status === 403) {
      setIsLoggedIn(false);
      throw new Error('Forbidden');
    }
    
    //print out and store the access token
    const data = await response.json();
    setToken(data["accessToken"]);
    setIsLoggedIn(true);

    //refresh the display workouts with the new page 1
    const workouts = await handleWorkoutsRefresh(data["accessToken"]);
    setWorkoutData(workouts);

    //refetch the user exercises
    const exercises = await handleExerciseRefresh(data["accessToken"]);
    setUserExercises(exercises.exercises);
  };

  //log in a user
  const handleLogin = async () => {
    const user = username;
    const pwd = password;
    try {
      //call the log in endpoint
      const response = await fetch('http://localhost:3500/login', {
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
      const response = await fetch('http://localhost:3500/logout', {
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

  //Method to make a request to the API
  const makeRequest = async (route, method, token, reqBody) => {
    let response;
    try {
      //set request options
      const options = {
        method: method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      //set a request body if one is provided
      if(reqBody) {
        options.body = JSON.stringify(reqBody);
      }

      //attempt to call the endpoint
      response = await fetch(`http://localhost:3500/${route}`, options);

      if(response.status === 403) {
        //try refreshing the token if the call returns a 403
        console.log("Refreshing Token");
        await handleRefresh();
        response = await fetch(`http://localhost:3500/${route}`, options);
      }

      //throw an error if an error status code is returned
      if (response.status >= 400) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        "status" : response.status,
        "data" : data
      };
    } catch(err) {
      console.log(err.message);
      return {
        "status" : response.status,
        "message" : err.message
      };
    }
  }

  const switchToAddWorkout = () => {
    setShowWorkoutInfo(false);
    setShowWorkouts(false);
    setShowUpdateWorkoutForm(false);
    setShowAddWorkoutForm(true);
    setShowExerciseHistoryPage(false);
  }

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
      const response = await fetch('http://localhost:3500/register', {
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

  const switchToWorkoutsPage = () => {
    setShowWorkouts(true);
    setShowWorkoutInfo(false);
    setShowAddWorkoutForm(false);
    setShowUpdateWorkoutForm(false);
    setShowExerciseHistoryPage(false);
  }

  const switchToUpdateWorkoutPage = () => {
    setShowWorkouts(false);
    setShowWorkoutInfo(false);
    setShowAddWorkoutForm(false);
    setShowUpdateWorkoutForm(true);
    setShowExerciseHistoryPage(false);
  }

  const switchToWorkoutInfo = () => {
    setShowWorkouts(false);
    setShowWorkoutInfo(true);
    setShowAddWorkoutForm(false);
    setShowUpdateWorkoutForm(false);
    setShowExerciseHistoryPage(false);
  }

  const switchToExerciseHistoryPage = () => {
    setShowWorkouts(false);
    setShowWorkoutInfo(false);
    setShowAddWorkoutForm(false);
    setShowUpdateWorkoutForm(false);
    setShowExerciseHistoryPage(true);
  }

  return (
    <div>
      {isLoggedIn ? (
        showWorkouts ? (
          <div className="appPage">
            <h2>Welcome!</h2>
            <button onClick={switchToAddWorkout}>Add Workout</button>
            <button onClick={switchToExerciseHistoryPage}>Exercise History</button>
            <WorkoutDisplay 
              makeRequest={makeRequest}
              token={token}
              workoutData={workoutData} 
              setDisplayWorkout={setDisplayWorkout} 
              setWorkoutData={setWorkoutData}
              handleWorkoutsRefresh={handleWorkoutsRefresh}
              switchToWorkoutInfo={switchToWorkoutInfo}
            />
            <button onClick={handleLogout}>Logout</button>
            <br/>
            <button onClick={getPrevPage}>Previous</button>
            <button onClick={getNextPage}>Next</button>
            <p>Page: {curPage}</p>
          </div>
        ) : showWorkoutInfo ? (
          <WorkoutInfo 
            workout={displayWorkout}  
            setDisplayWorkout={setDisplayWorkout} 
            switchToWorkoutsPage={switchToWorkoutsPage}
            switchToUpdateWorkoutPage={switchToUpdateWorkoutPage}
          />
        ) : showAddWorkoutForm ? (
          <AddWorkoutForm
            makeRequest={makeRequest}
            token={token}
            setWorkoutData={setWorkoutData}
            update={false}
            id={null}
            workoutData={null}
            userExercises={userExercises}
            setUserExercises={setUserExercises}
            handleWorkoutsRefresh={handleWorkoutsRefresh}
            switchToWorkoutsPage={switchToWorkoutsPage}
          />
        ) : showUpdateWorkoutForm ? (
          <AddWorkoutForm
            makeRequest={makeRequest}
            token={token}
            setWorkoutData={setWorkoutData}
            update={true}
            id={displayWorkout["_id"]}
            workoutData={displayWorkout}
            userExercises={userExercises}
            setUserExercises={setUserExercises}
            handleWorkoutsRefresh={handleWorkoutsRefresh}
            switchToWorkoutsPage={switchToWorkoutsPage}
          />
        ) : showExerciseHistoryPage ? (
          <ExerciseHistory
            switchToWorkoutsPage={switchToWorkoutsPage}
            userExercises={userExercises}
            token={token}
            makeRequest={makeRequest}
          />
        ) : (
          <h2>Error</h2>
        )
      ) : (
        <div className="loginPage">
          <br />
          <h2 className="loginHeader">Login</h2>
          <input
            className="loginInput"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            className="loginInput"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="loginButton" onClick={handleLogin}>Login</button>
          <br />
          <br />
          <h2 className="loginHeader">Sign Up</h2>
          <input
            className="loginInput"
            type="text"
            placeholder="Username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
          />
          <br />
          <input
            className="loginInput"
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
          <br />
          <input
            className="loginInput"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          <button className="loginButton" onClick={handleRegister}>Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default App;
