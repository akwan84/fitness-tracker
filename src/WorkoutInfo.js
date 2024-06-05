const WorkoutInfo = ({ workout, setDisplayWorkout, setShowWorkouts, setShowWorkoutInfo }) => {
    const goBack = () => {
        setDisplayWorkout(null);
        setShowWorkouts(true);
        setShowWorkoutInfo(false);
    }

    const date = new Date(workout.date);
    return (
        <div>
            <h2>{workout.name}</h2>
            <h3>{`${date.getDate()}/${date.getMonth() < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()}`}</h3>
            {workout.exercises.map(exercise => (
                <p>{JSON.stringify(exercise)}</p>
            ))}
            <button onClick={goBack}>Back</button>
        </div>
    );
}

export default WorkoutInfo;