import WorkoutWidget from "./WorkoutWidget";
import { useContext } from 'react';
import PageContext from './context/PageContext';
import DataContext from "./context/DataContext";
import RequestContext from "./context/RequestContext";

const WorkoutDisplay = () => {
    const { switchToWorkoutInfo } = useContext(PageContext);
    const { workoutData, setDisplayWorkout, setWorkoutData } = useContext(DataContext);
    const { makeRequest, token, handleWorkoutsRefresh } = useContext(RequestContext);

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