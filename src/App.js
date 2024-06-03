import React, { useState, useEffect } from 'react';

function App() {
  // State to store user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  let token = '';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      console.log(data);
      token = data["accessToken"];
      setIsLoggedIn(true);
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
      console.log(data);
      token = data["accessToken"];
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
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
      token = '';
      setIsLoggedIn(false);
    } catch(err) {
      console.log(err.message);
    }
  };

  const makeRequest = async () => {
    try {
      //attempt to call the endpoint
      let response = await fetch('http://localhost:3500/workout/664fe59d90ac40e2283100ae', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });

      if(response.status === 403) {
        //try refreshing the token if the call returns a 403
        console.log("Refreshing Token");
        await handleRefresh();
        response = await fetch('http://localhost:3500/workout/664fe59d90ac40e2283100ae', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`
          },
        });
      }

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch(err) {
      console.log(err.message);
    }
  }

  //if the refresh token is still valid, keep the user logged in and provide a new access token
  useEffect(() => {
    handleRefresh()
  }, [])

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h2>Welcome!</h2>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={makeRequest}>Request</button>
        </div>
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
        </div>
      )}
    </div>
  );
}

export default App;
