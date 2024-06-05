const WorkoutWidget = ({ name, date, workout, setDisplayWorkout, setShowWorkouts, setShowWorkoutInfo }) => {
    const showWorkoutInfo = () => {
        setShowWorkouts(false);
        setShowWorkoutInfo(true);
        setDisplayWorkout(workout);
    }

    return (
        <div onClick={showWorkoutInfo}>
            <p>{name}</p>
            <p>{date}</p>
        </div>
    );
}

export default WorkoutWidget;