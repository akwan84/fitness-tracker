import WorkoutWidget from "./WorkoutWidget";
import { useContext } from 'react';
import PageContext from './context/PageContext';

const WorkoutDisplay = ({ makeRequest, token, workoutData, setDisplayWorkout, setWorkoutData, handleWorkoutsRefresh }) => {
    const { switchToWorkoutInfo } = useContext(PageContext);
    return (
        <div style={{height:"78vh"}}>
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