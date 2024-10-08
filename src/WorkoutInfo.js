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

    const workoutYear = displayWorkout.date.substring(0, 4);
    const workoutMonth = displayWorkout.date.substring(5, 7);
    const workoutDay = displayWorkout.date.substring(8, 10);
    return (
        <div className="appPage" style={{overflowY:"auto"}}>
            <div className='header'>
              <h2 className='headerText'>Fitness Tracker</h2>
              <button onClick={goBack} className="headerButton" style={{marginLeft:"30%"}}>Back</button>
            </div>
            <h1 id='workoutNameHeader'>{displayWorkout.name}</h1>
            <h2 id='workoutDateHeader'>{`Date: ${workoutDay}/${workoutMonth}/${workoutYear}`}</h2>
            <br/>
            {displayWorkout.exercises.map(exercise => (
                <ExerciseWidget exercise={exercise} workout={displayWorkout}/>
            ))}
            <button onClick={switchToUpdateWorkoutPage} id="updateButton">Update</button>
        </div>
    );
}

export default WorkoutInfo;