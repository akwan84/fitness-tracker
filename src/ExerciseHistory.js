import { useState } from "react";

const ExerciseHistory = ({ switchToWorkoutsPage, userExercises, token, makeRequest }) => {
    const [selectedExercise, setSelectedExercise] = useState('');
    const [exerciseData, setExerciseData] = useState([]);

    const getHistory = async() => {
        if(!selectedExercise) {
            alert("Exercise must be selected");
            return;
        }

        const parsedExercise = selectedExercise.replace(/ /g, "%20");

        const response = await makeRequest(`exercise/history?exercise=${parsedExercise}`, 'GET', token, null); 
        if(response.status !== 200) {
            alert(`Error getting history for ${selectedExercise}, status ${response.status}`);
            return;
        }
        setExerciseData(response.data.data);
    }

    const parseDate = (date) => {
        return `${date.getDate()}/${date.getMonth() < 10 ? '0' : ''}${date.getMonth() + 1}/${date.getFullYear()}`
    }

    return (
        <div>
            <select
                name="exercise"
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
            >
                <option value="" disabled>Select Exercise</option>
                {userExercises.map((exercise, index) => (
                    <option key={index} value={exercise}>
                        {exercise}
                    </option>
                ))}
            </select>
            <button onClick={getHistory}>Select</button>
            {exerciseData.map(day => (
                <div>
                    <h3>{parseDate(new Date(day.date))}</h3>
                    {day.setInfo.map((set, index) => (
                        <div>
                            <p>&emsp;{`${index + 1}. Weight: ${set.weight}, Reps: ${set.reps}`}</p>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={switchToWorkoutsPage}>Back</button>
        </div>
    );
}

export default ExerciseHistory;