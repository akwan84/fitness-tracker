import { useState } from "react";

const WorkoutWidget = ({ makeRequest, token, workout, setDisplayWorkout, setWorkoutData, handleWorkoutsRefresh, switchToWorkoutInfo }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const showWorkoutInfo = () => {
        switchToWorkoutInfo();
        setDisplayWorkout(workout);
    }

    const deleteWorkout = async() => {
        const response = await makeRequest(`workout/${workout["_id"]}`, 'DELETE', token, null);
        if(response.status !== 200) {
            alert(`Error deleting workout, error code ${response.status}`);
            return;
        }

        const workouts = await handleWorkoutsRefresh(token);
        setWorkoutData(workouts);
        setShowConfirm(false);
    }

    return (
        <div>
            <div onClick={showWorkoutInfo}>
                <h3>{workout.name}</h3>
                <p>{workout.date}</p>
            </div>
            {!showConfirm && <button onClick={() => setShowConfirm(!showConfirm)}>Delete</button>}
            {showConfirm && <button onClick={() => setShowConfirm(!showConfirm)}>Cancel</button>}
            {showConfirm && <button onClick={deleteWorkout}>Confirm</button>}
        </div>
    );
}

export default WorkoutWidget;