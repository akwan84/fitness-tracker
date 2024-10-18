const Register = ({ regUsername, setRegUsername, regPassword, setRegPassword, confirmPassword, setConfirmPassword, handleRegister }) => {
    return (
        <div>
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
    );
}

export default Register;