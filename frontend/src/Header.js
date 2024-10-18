import { useContext } from 'react';
import PageContext from './context/PageContext';

const Header = ({ handleLogout }) => {
    const { switchToAddWorkout, switchToExerciseHistoryPage } = useContext(PageContext);
    return (
        <div className='header'>
            <h2 className='headerText'>Fitness Tracker</h2>
            <button onClick={switchToAddWorkout} className="headerButton">Add Workout</button>
            <button onClick={switchToExerciseHistoryPage} className="headerButton" style={{marginLeft:"0px"}}>Exercise History</button>
            <button onClick={handleLogout} className="headerButton">Logout</button>
        </div>
    );
}

export default Header;

