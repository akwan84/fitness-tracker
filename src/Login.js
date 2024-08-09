const Login = ({ username, setUsername, password, setPassword, handleLogin }) => {
    return (
        <div>
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
        </div>
    );
}

export default Login;