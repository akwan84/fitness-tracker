import React, { useState, useEffect } from 'react';
import WorkoutDisplay from './WorkoutDisplay';
import WorkoutInfo from './WorkoutInfo';
import AddWorkoutForm from './AddWorkoutForm';

function App() {
  const PAGE_SIZE = 5;

  // State to store user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [workoutData, setWorkoutData] = useState(null);
  const [userExercises, setUserExercises] = useState([]);

  //pages to show
  const [showWorkouts, setShowWorkouts] = useState(true);
  const [showWorkoutInfo, setShowWorkoutInfo] = useState(false);
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false);
  const [showUpdateWorkoutForm, setShowUpdateWorkoutForm] = useState(false);

  const [displayWorkout, setDisplayWorkout] = useState({});
  const [curPage, setCurPage] = useState(1);

  //refresh the access token
  const handleRefresh = async () => {
    try {
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

      const workouts = await makeRequest(`workout?pageSize=${PAGE_SIZE}&page=1`, 'GET', data["accessToken"], null);
      setWorkoutData(workouts);

      const exercises = await makeRequest('exercise', 'GET', data["accessToken"], null);
      setUserExercises(exercises.exercises);

    } catch(err) {
      console.log(err.message);
    }
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

      const workouts = await makeRequest(`workout?pageSize=${PAGE_SIZE}&page=1`, 'GET', data["accessToken"], null);
      setWorkoutData(workouts);

      const exercises = await makeRequest('exercise', 'GET', data["accessToken"], null);
      setUserExercises(exercises.exercises);

    } catch(err) {
      console.log(err.message);
    }
  };

  //log in a user
  const handleLogout = async () => {
    try {
      //call the log in endpoint
      const response = await fetch('http://localhost:3500/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      //throw errors if the status codes indicate an error
      if(response.status === 500) throw new Error('Internal server error');

      //log and store the access token
      setToken('');
      setIsLoggedIn(false);
    } catch(err) {
      console.log(err.message);
    }
  };

  const makeRequest = async (route, method, token, reqBody) => {
    try {
      const options = {
        method: method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if(reqBody) {
        options.body = JSON.stringify(reqBody);
      }

      //attempt to call the endpoint
      let response = await fetch(`http://localhost:3500/${route}`, options);

      if(response.status === 403) {
        //try refreshing the token if the call returns a 403
        console.log("Refreshing Token");
        await handleRefresh();
        response = await fetch(`http://localhost:3500/${route}`, options);
      }

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      //console.log(data);
      return data;
    } catch(err) {
      console.log(err.message);
    }
  }

  const switchToAddWorkout = () => {
    setShowWorkoutInfo(false);
    setShowWorkouts(false);
    setShowAddWorkoutForm(true);
  }

  //if the refresh token is still valid, keep the user logged in and provide a new access token
  useEffect(() => {
    handleRefresh()
  }, []);

  const handleRegister = async () => {
    if(!regUsername || !regPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if(regPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = regUsername;
    const pwd = regPassword;

    try{
      const response = await fetch('http://localhost:3500/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ user, pwd })
      });

      if(response.status === 409) {
        alert(`Username ${regUsername} has been taken`);
        return;
      }
      if(response.status === 500) {
        alert("Error in registration");
        return;
      }

      alert("Registration Successful");
      setRegUsername('');
      setRegPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.log(err.message);
    }
  }
  
  const getNextPage = async () => {
    try {
      const workouts = await makeRequest(`workout?pageSize=${PAGE_SIZE}&page=${curPage + 1}`, 'GET', token, null);
      if(workouts.workouts.length > 0) {
        setWorkoutData(workouts);
        setCurPage(curPage + 1);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getPrevPage = async () => {
    try {
      if(curPage > 1){
        const workouts = await makeRequest(`workout?pageSize=${PAGE_SIZE}&page=${curPage - 1}`, 'GET', token, null);
        setWorkoutData(workouts);
        setCurPage(curPage - 1);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        showWorkouts ? (
          <div>
            <h2>Welcome!</h2>
            <button onClick={switchToAddWorkout}>Add Workout</button>
            <WorkoutDisplay 
              makeRequest={makeRequest}
              token={token}
              workoutData={workoutData} 
              setDisplayWorkout={setDisplayWorkout} 
              setShowWorkouts={setShowWorkouts} 
              setShowWorkoutInfo={setShowWorkoutInfo}
              setWorkoutData={setWorkoutData}
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
            setShowWorkouts={setShowWorkouts} 
            setShowWorkoutInfo={setShowWorkoutInfo}
            setShowUpdateWorkoutForm={setShowUpdateWorkoutForm}
          />
        ) : showAddWorkoutForm ? (
          <AddWorkoutForm
            makeRequest={makeRequest}
            token={token}
            setShowWorkouts={setShowWorkouts}
            setShowWorkoutInfo={setShowWorkoutInfo}
            setShowAddWorkoutForm={setShowAddWorkoutForm}
            setShowUpdateWorkoutForm={setShowUpdateWorkoutForm}
            setWorkoutData={setWorkoutData}
            update={false}
            id={null}
            workoutData={null}
            userExercises={userExercises}
            setUserExercises={setUserExercises}
          />
        ) : showUpdateWorkoutForm ? (
          <AddWorkoutForm
            makeRequest={makeRequest}
            token={token}
            setShowWorkouts={setShowWorkouts}
            setShowWorkoutInfo={setShowWorkoutInfo}
            setShowAddWorkoutForm={setShowAddWorkoutForm}
            setShowUpdateWorkoutForm={setShowUpdateWorkoutForm}
            setWorkoutData={setWorkoutData}
            update={true}
            id={displayWorkout["_id"]}
            workoutData={displayWorkout}
            userExercises={userExercises}
            setUserExercises={setUserExercises}
          />
        ) : (
          <h2>Error</h2>
        )
      ) : (
        <div>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={handleLogin}>Login</button>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          <button onClick={handleRegister}>Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default App;
