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

    const workoutYear = workout.date.substring(0, 4);
    const workoutMonth = workout.date.substring(5, 7);
    const workoutDay = workout.date.substring(8, 10);

    return (
        <div className="workoutWidget">
            <div onClick={showWorkoutInfo} className="workoutWidgetContent">
                <h3 style={{marginLeft:"3%",paddingTop:"1vh",fontSize:"2vh"}}>{workout.name}</h3>
                <p style={{marginLeft:"3%", fontSize:"1.5vh"}}>{`${workoutDay}/${workoutMonth}/${workoutYear}`}</p>
            </div>
            {!showConfirm && <button className="workoutWidgetButton" onClick={() => setShowConfirm(!showConfirm)}>Delete</button>}
            {showConfirm && <button className="workoutWidgetButton" onClick={() => setShowConfirm(!showConfirm)}>Cancel</button>}
            {showConfirm && <button className="workoutWidgetButton" onClick={deleteWorkout}>Confirm</button>}
        </div>
    );
}

export default WorkoutWidget;