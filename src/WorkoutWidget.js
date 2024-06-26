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

    const date = new Date(workout.date);
    return (
        <div className="workoutWidget">
            <div onClick={showWorkoutInfo} className="workoutWidgetContent">
                <h3 style={{marginLeft:"3%",paddingTop:"1vh",fontSize:"2vh"}}>{workout.name}</h3>
                <p style={{marginLeft:"3%", fontSize:"1.5vh"}}>{`${date.getDate()}/${date.getMonth() < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()}`}</p>
            </div>
            {!showConfirm && <button className="workoutWidgetButton" onClick={() => setShowConfirm(!showConfirm)}>Delete</button>}
            {showConfirm && <button className="workoutWidgetButton" onClick={() => setShowConfirm(!showConfirm)}>Cancel</button>}
            {showConfirm && <button className="workoutWidgetButton" onClick={deleteWorkout}>Confirm</button>}
        </div>
    );
}

export default WorkoutWidget;