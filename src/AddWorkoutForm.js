import { useState } from "react";

const AddWorkoutForm = ({ makeRequest, token, setWorkoutData, update, id, workoutData, userExercises, setUserExercises, handleWorkoutsRefresh, switchToWorkoutsPage }) => {
    const [name, setName] = useState(workoutData ? workoutData.name : '');
    const [date, setDate] = useState(workoutData ? `${workoutData.date.substring(0, 4)}-${workoutData.date.substring(5, 7)}-${workoutData.date.substring(8,10)}` : '');
    const [exercises, setExercises] = useState(workoutData ? workoutData.exercises : []);
    const [newExercise, setNewExercise] = useState('');
    
    //Add an exercise to the form
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

    //Add a set to an exercise in the form
    const addSet = (index) => {
        const values = [...exercises];
        values[index]["setInfo"].push({ 'weight' : '', 'reps' : ''});
        setExercises(values);
    }

    //Update the state of a set when info changes
    const handleSetInfoChange = (index1, index2, e) => {
        const values = [...exercises];
        values[index1]["setInfo"][index2][e.target.name] = e.target.value;
        setExercises(values);
    }

    //Update the state of an exercise when info changes
    const handleExerciseChange = (index, e) => {
        const values = [...exercises];
        values[index]["exercise"] = e.target.value;
        setExercises(values);
    }

    //Remove a set from an exercise in the form
    const removeSet = (index1, index2) => {
        const values = [...exercises];
        values[index1]["setInfo"].splice(index2, 1);
        setExercises(values);
    }

    //Remove an exercise from the form
    const removeExercise = (index) => {
        const values = [...exercises];
        values.splice(index, 1);
        setExercises(values);
    }

    //Submit the form
    const handleSubmit = async() => {
        //create initial request body with the workout name and date
        if(!name || !date) {
            alert('Name and date are required');
            return;
        }

        const reqBody = {
            "name" : name,
            "date" : date,
        };

        const exerciseList = [];

        for(let i = 0; i < exercises.length; i++) {
            //make sure an exercise is selected
            if(!exercises[i]["exercise"]) {
                alert("All exercises must be selected");
                return;
            }
            //make sure there are more than 0 sets
            if(exercises[i]["setInfo"].length === 0) {
                alert(`Exercise ${exercises[i]["exercise"]} can not have 0 sets`);
                return;
            }

            for(let j = 0; j < exercises[i]["setInfo"].length; j++) {
                //make sure weight and rep info is all filled in
                if(!exercises[i]["setInfo"][j]["weight"] || !exercises[i]["setInfo"][j]["reps"]) {
                    alert("Weight and reps must be filled in");
                    return;
                }
                //check if all weight and reps are numbers
                if(isNaN(exercises[i]["setInfo"][j]["weight"]) || isNaN(exercises[i]["setInfo"][j]["reps"])) {
                    alert("All weight and reps must be numbers");
                    return;
                }
            }
            exerciseList.push({
                "exercise" : exercises[i]["exercise"],
                "sets" : exercises[i]["setInfo"].length,
                "setInfo" : exercises[i]["setInfo"]
            });
        }
        reqBody["exercises"] = exerciseList;

        if(!update) {
            const postResponse = await makeRequest('workout', 'POST', token, reqBody);
            if(postResponse.status !== 201) {
                alert(`Error adding new workout, error code ${postResponse.status}`);
            }
        } else {
            const putResponse = await makeRequest(`workout/${id}`, 'PUT', token, reqBody);
            if(putResponse.status !== 201) {
                alert(`Error updating workout, error code ${putResponse.status}`);
            }
        }

        switchToWorkoutsPage();

        const updatedWorkouts = await handleWorkoutsRefresh(token);
        setWorkoutData(updatedWorkouts);
    }

    //Create a new exercise
    const createExercise = async() => {
        //make sure the exercise name is filled in
        if(newExercise === '') {
            alert("Exercises must have a name");
            return;
        }

        const reqBody = {
            "exercise" : newExercise
        };

        const res = await makeRequest('exercise', 'POST', token, reqBody);
        
        //handle errors
        if(res.status === 403){
            alert("Forbidden")
            return;
        }

        if(res.status === 409){
            alert(`${newExercise} already exists`);
            return;
        }

        if(res.status !== 201){
            alert(res.message);
            return;
        }

        alert(`Exercise ${newExercise} created`);
        setNewExercise('');

        //get the updated exercise list
        const exercisesResponse = await makeRequest('exercise', 'GET', token, null);
        if(exercisesResponse.status !== 200) {
            alert(exercisesResponse.message);
            return;
        }
        setUserExercises(exercisesResponse.exercises);
    }

    return (
        <div className="appPage" style={{overflowY:"auto"}}>
            <div className='header'>
              <h2 className='headerText'>Fitness Tracker</h2>
              <button onClick={switchToWorkoutsPage} className="headerButton" style={{marginLeft:"30%"}}>Cancel</button>
            </div>
            <h2 className="addWorkoutHeader">Create New Exercise</h2>
            <input
                type="text"
                name="newExercise"
                placeholder="Exercise Name"
                value={newExercise}
                onChange={e => setNewExercise(e.target.value)}
                className="addWorkoutInput"
            />
            <br/>
            <button className="addWorkoutButton" onClick={createExercise} style={{marginLeft:"5%", marginTop:"1vh"}}>Create</button>
            <br />
            <br />
            <h2 className="addWorkoutHeader">New Workout</h2>
            <input
                type="text"
                name="name"
                placeholder="Workout Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="addWorkoutInput"
            />
            <input
                type="date"
                name="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="addWorkoutInput"
                style={{marginLeft:"1%"}}
            />
            {exercises.map((exercise, index1) => (
                <div>
                    <h3 className="addWorkoutExerciseHeader">Exercise {index1 + 1}</h3>
                    <select
                        name="exercise"
                        value={exercise.exercise}
                        onChange={e => handleExerciseChange(index1, e)}
                        className="addWorkoutInput"
                        style={{height:"3vh"}}
                    >
                        <option value="" disabled>Select Exercise</option>
                        {userExercises.map((exerciseOption, index) => (
                            <option key={index} value={exerciseOption}>
                                {exerciseOption}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => removeExercise(index1)} className="addWorkoutModifyFormButton" style={{width:"10%"}}>Remove Exercise</button>
                    {exercise.setInfo.map((set, index2) => (
                        <div>
                            <input
                                type="text"
                                name="weight"
                                placeholder="Weight"
                                value={set.weight}
                                onChange={e => handleSetInfoChange(index1, index2, e)}
                                className="addWorkoutInput"
                                style={{width:"5%",marginLeft:"7%"}}
                            />
                            <input
                                type="text"
                                name="reps"
                                placeholder="Reps"
                                value={set.reps}
                                onChange={e => handleSetInfoChange(index1, index2, e)}
                                className="addWorkoutInput"
                                style={{width:"5%",marginLeft:"1%"}}
                            />
                            <button onClick={() => removeSet(index1, index2)} className="addWorkoutModifyFormButton">Remove</button>
                        </div>
                    ))}
                    <button onClick={() => addSet(index1)} className="addSetButton">Add Set</button>
                </div>
            ))}
            <br/>
            <button onClick={addExercise} className="addWorkoutButton" style={{width:"10%",marginLeft:"5%",marginTop:"1vh"}}>Add Exercise</button>
            {!update && <button onClick={handleSubmit} className="addWorkoutButton" style={{width:"10%",marginLeft:"1%",marginBottom:"2vh"}}>Submit</button>}
            {update && <button onClick={handleSubmit} className="addWorkoutButton" style={{width:"10%",marginLeft:"1%"}}>Update</button>}
        </div>
    );
}

export default AddWorkoutForm;