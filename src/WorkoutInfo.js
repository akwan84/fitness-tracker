import ExerciseWidget from "./ExerciseWidget";

const WorkoutInfo = ({ workout, setDisplayWorkout, setShowWorkouts, setShowWorkoutInfo, setShowUpdateWorkoutForm }) => {
    const goBack = () => {
        setDisplayWorkout(null);
        setShowWorkouts(true);
        setShowWorkoutInfo(false);
    }

    const updateWorkout = () => {
        setShowUpdateWorkoutForm(true);
        setShowWorkoutInfo(false);
    }

    const date = new Date(workout.date);
    return (
        <div>
            <h1>{workout.name}</h1>
            <h2>{`${date.getDate()}/${date.getMonth() < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()}`}</h2>
            {workout.exercises.map(exercise => (
                <ExerciseWidget exercise={exercise} workout={workout}/>
            ))}
            <button onClick={goBack}>Back</button>
            <button onClick={updateWorkout}>Update</button>
        </div>
    );
}

export default WorkoutInfo;