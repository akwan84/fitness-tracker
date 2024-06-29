import ExerciseWidget from "./ExerciseWidget";

const WorkoutInfo = ({ workout, setDisplayWorkout, switchToWorkoutsPage, switchToUpdateWorkoutPage }) => {
    const goBack = () => {
        setDisplayWorkout(null);
        switchToWorkoutsPage();
    }

    const date = new Date(workout.date);
    return (
        <div className="addWorkoutPage">
            <div className='header'>
              <h2 className='headerText'>Fitness Tracker</h2>
              <button onClick={goBack} className="headerButton" style={{marginLeft:"30%"}}>Back</button>
            </div>
            <h1 id='workoutNameHeader'>{workout.name}</h1>
            <h2 id='workoutDateHeader'>{`Date: ${date.getDate()}/${date.getMonth() < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()}`}</h2>
            <br/>
            {workout.exercises.map(exercise => (
                <ExerciseWidget exercise={exercise} workout={workout}/>
            ))}
            <button onClick={switchToUpdateWorkoutPage} id="updateButton">Update</button>
        </div>
    );
}

export default WorkoutInfo;