import React, { useState } from 'react';

function App() {
  // State to store user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  let token = '';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRefresh = async () => {
    /*if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid username or password');
    }*/
    try {
      const response = await fetch('http://localhost:3500/refresh', {
        method: 'GET',
        credentials: 'include', 
      });
      const data = await response.json();
      console.log(data);
      token = data["accessToken"];
    } catch(err) {
      console.log(err.stack);
    }
  };

  const handleLogin = async () => {
    const user = username;
    const pwd = password;
    try {
      const response = await fetch('http://localhost:3500/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({user, pwd})
      });
      const data = await response.json();
      console.log(data);
      token = data["accessToken"];
    } catch(err) {
      console.log(err.stack);
    }
  };

  const makeRequest = async () => {
    try {
      let response = await fetch('http://localhost:3500/workout/664fe59d90ac40e2283100ae', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });

      if(response.status === 403) {
        console.log("Refreshing Token");
        await handleRefresh();
        response = await fetch('http://localhost:3500/workout/664fe59d90ac40e2283100ae', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`
          },
        });
        console.log(response.status);
      }

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch(err) {
      console.log(err.stack);
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        <h2>Welcome, {username}!</h2>
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
          <button onClick={makeRequest}>Request</button>
        </div>
      )}
    </div>
  );
}

export default App;
