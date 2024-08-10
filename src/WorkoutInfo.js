import ExerciseWidget from "./ExerciseWidget";
import { useContext } from 'react';
import PageContext from './context/PageContext';
import DataContext from "./context/DataContext";

const WorkoutInfo = () => {
    const { switchToWorkoutsPage, switchToUpdateWorkoutPage } = useContext(PageContext);
    const { displayWorkout, setDisplayWorkout } = useContext(DataContext);

    const goBack = () => {
        setDisplayWorkout(null);
        switchToWorkoutsPage();
    }

    const date = new Date(displayWorkout.date);
    return (
        <div className="appPage" style={{overflowY:"auto"}}>
            <div className='header'>
              <h2 className='headerText'>Fitness Tracker</h2>
              <button onClick={goBack} className="headerButton" style={{marginLeft:"30%"}}>Back</button>
            </div>
            <h1 id='workoutNameHeader'>{displayWorkout.name}</h1>
            <h2 id='workoutDateHeader'>{`Date: ${date.getDate()}/${date.getMonth() < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()}`}</h2>
            <br/>
            {displayWorkout.exercises.map(exercise => (
                <ExerciseWidget exercise={exercise} workout={displayWorkout}/>
            ))}
            <button onClick={switchToUpdateWorkoutPage} id="updateButton">Update</button>
        </div>
    );
}

export default WorkoutInfo;