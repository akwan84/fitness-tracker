import { useState } from "react";

const AddWorkoutForm = ({ makeRequest, token, setShowWorkouts, setShowWorkoutInfo, setShowAddWorkoutForm, setShowUpdateWorkoutForm, setWorkoutData, update, id, workoutData }) => {
    const [name, setName] = useState(workoutData ? workoutData.name : '');
    const [date, setDate] = useState(workoutData ? `${workoutData.date.substring(0, 4)}-${workoutData.date.substring(5, 7)}-${workoutData.date.substring(8,10)}` : '');
    const [exercises, setExercises] = useState(workoutData ? workoutData.exercises : []);
    
    const addExercise = () => {
        const newExercise = {
            'exercise' : '',
            'setInfo' : [
                {
                    'weight' : '',
                    'reps' : ''
                }
            ]
        };

        setExercises([...exercises, newExercise])
    }

    const addSet = (index) => {
        const values = [...exercises];
        values[index]["setInfo"].push({ 'weight' : '', 'reps' : ''});
        setExercises(values);
    }

    const handleSetInfoChange = (index1, index2, e) => {
        const values = [...exercises];
        values[index1]["setInfo"][index2][e.target.name] = e.target.value;
        setExercises(values);
    }

    const handleExerciseChange = (index, e) => {
        const values = [...exercises];
        values[index]["exercise"] = e.target.value;
        setExercises(values);
    }

    const removeSet = (index1, index2) => {
        const values = [...exercises];
        values[index1]["setInfo"].splice(index2, 1);
        setExercises(values);
    }

    const handleSubmit = async() => {
        const reqBody = {
            "name" : name,
            "date" : date,
        };

        const exerciseList = [];

        for(let i = 0; i < exercises.length; i++) {
            exerciseList.push({
                "exercise" : exercises[i]["exercise"],
                "sets" : exercises[i]["setInfo"].length,
                "setInfo" : exercises[i]["setInfo"]
            });
        }
        reqBody["exercises"] = exerciseList;

        if(!update) {
            await makeRequest('workout', 'POST', token, reqBody);
        } else {
            await makeRequest(`workout/${id}`, 'PUT', token, reqBody);
        }

        setShowWorkouts(true);
        setShowWorkoutInfo(false);
        setShowAddWorkoutForm(false);
        setShowUpdateWorkoutForm(false);

        const workouts = await makeRequest('workout', 'GET', token, null);
        setWorkoutData(workouts);
    }

    const removeExercise = (index) => {
        const values = [...exercises];
        values.splice(index, 1);
        setExercises(values);
    }

    const cancelAdd = () => {
        setShowWorkouts(true);
        setShowWorkoutInfo(false);
        setShowAddWorkoutForm(false);
        setShowUpdateWorkoutForm(false);
    }

    return (
        <div>
            <input
                type="text"
                name="name"
                placeholder="Workout Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="date"
                name="date"
                value={date}
                onChange={e => setDate(e.target.value)}
            />
            {exercises.map((exercise, index1) => (
                <div>
                    <input
                        type="text"
                        name="exercise"
                        placeholder="Exercise"
                        value={exercise.exercise}
                        onChange={e => handleExerciseChange(index1, e)}
                    />
                    <button onClick={() => removeExercise(index1)}>Remove Exercise</button>
                    {exercise.setInfo.map((set, index2) => (
                        <div>
                            &emsp;
                            <input
                                type="text"
                                name="weight"
                                placeholder="Weight"
                                value={set.weight}
                                onChange={e => handleSetInfoChange(index1, index2, e)}
                            />
                            <input
                                type="text"
                                name="reps"
                                placeholder="Reps"
                                value={set.reps}
                                onChange={e => handleSetInfoChange(index1, index2, e)}
                            />
                            <button onClick={() => removeSet(index1, index2)}>Remove</button>
                        </div>
                    ))}
                    <button onClick={() => addSet(index1)}>Add Set</button>
                </div>
            ))}
            <button onClick={addExercise}>Add Exercise</button>
            {!update && <button onClick={handleSubmit}>Submit</button>}
            {update && <button onClick={handleSubmit}>Update</button>}
            <button onClick={cancelAdd}>Cancel</button>
        </div>
    );
}

export default AddWorkoutForm;