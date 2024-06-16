import WorkoutWidget from "./WorkoutWidget";

const WorkoutDisplay = ({ makeRequest, token, workoutData, setDisplayWorkout, setShowWorkouts, setShowWorkoutInfo, setWorkoutData, handleWorkoutsRefresh }) => {
    return (
        <div>
            {!workoutData && <h2>No Workouts To Show</h2>}
            {workoutData && workoutData.workouts.map(workout => (
                <WorkoutWidget 
                    makeRequest={makeRequest}
                    token={token}
                    workout={workout} 
                    setDisplayWorkout={setDisplayWorkout} 
                    setShowWorkouts={setShowWorkouts} 
                    setShowWorkoutInfo={setShowWorkoutInfo}
                    setWorkoutData={setWorkoutData}
                    handleWorkoutsRefresh={handleWorkoutsRefresh}
                />
            ))}
        </div>
    );
}

export default WorkoutDisplay;