import WorkoutWidget from "./WorkoutWidget";

const WorkoutDisplay = ({ makeRequest, token, workoutData, setDisplayWorkout, setShowWorkouts, setShowWorkoutInfo, setWorkoutData, handleWorkoutsRefresh, switchToWorkoutInfo }) => {
    return (
        <div>
            {!workoutData && <h2>No Workouts To Show</h2>}
            {workoutData && workoutData.workouts.map(workout => (
                <WorkoutWidget 
                    makeRequest={makeRequest}
                    token={token}
                    workout={workout} 
                    setDisplayWorkout={setDisplayWorkout} 
                    setWorkoutData={setWorkoutData}
                    handleWorkoutsRefresh={handleWorkoutsRefresh}
                    switchToWorkoutInfo={switchToWorkoutInfo}
                />
            ))}
        </div>
    );
}

export default WorkoutDisplay;