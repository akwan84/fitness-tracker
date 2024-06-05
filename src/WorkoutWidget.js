const WorkoutWidget = ({ workout, setDisplayWorkout, setShowWorkouts, setShowWorkoutInfo }) => {
    const showWorkoutInfo = () => {
        setShowWorkouts(false);
        setShowWorkoutInfo(true);
        setDisplayWorkout(workout);
    }

    return (
        <div onClick={showWorkoutInfo}>
            <h3>{workout.name}</h3>
            <p>{workout.date}</p>
        </div>
    );
}

export default WorkoutWidget;