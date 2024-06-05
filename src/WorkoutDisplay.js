import WorkoutWidget from "./WorkoutWidget";

const WorkoutDisplay = ({ workoutData, setDisplayWorkout, setShowWorkouts, setShowWorkoutInfo }) => {
    return (
        <div>
            {!workoutData && <h2>No Workouts To Show</h2>}
            {workoutData && workoutData.workouts.map(workout => (
                <WorkoutWidget 
                    workout={workout} 
                    setDisplayWorkout={setDisplayWorkout} 
                    setShowWorkouts={setShowWorkouts} 
                    setShowWorkoutInfo={setShowWorkoutInfo}
                />
            ))}
        </div>
    );
}

export default WorkoutDisplay;