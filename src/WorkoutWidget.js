import { useState } from "react";

const WorkoutWidget = ({ makeRequest, token, workout, setDisplayWorkout, setShowWorkouts, setShowWorkoutInfo, setWorkoutData }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const showWorkoutInfo = () => {
        setShowWorkouts(false);
        setShowWorkoutInfo(true);
        setDisplayWorkout(workout);
    }

    const deleteWorkout = async() => {
        await makeRequest(`workout/${workout["_id"]}`, 'DELETE', token, null);

        const workouts = await makeRequest('workout', 'GET', token, null);
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