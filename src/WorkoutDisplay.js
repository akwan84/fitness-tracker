const WorkoutDisplay = ({ workoutData }) => {
    return (
        <div>
            {!workoutData && <h2>No Workouts To Show</h2>}
            {workoutData && workoutData.workouts.map(workout => (
                <div>
                    <p>{workout.name}</p>
                    <p>{workout.date}</p>
                </div>
            ))}
        </div>
    );
}

export default WorkoutDisplay;