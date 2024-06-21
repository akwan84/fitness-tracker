import { useState } from "react";

const ExerciseHistory = ({ switchToWorkoutsPage, userExercises, token, makeRequest }) => {
    const PAGE_SIZE = 2;
    const [selectedExercise, setSelectedExercise] = useState('');
    const [exerciseData, setExerciseData] = useState([]);
    const [pageNum, setPageNum] = useState(1);

    const getHistory = async() => {
        try {
            if(!selectedExercise) {
                alert("Exercise must be selected");
                return;
            }

            const parsedExercise = selectedExercise.replace(/ /g, "%20");

            const response = await makeRequest(`exercise/history?exercise=${parsedExercise}&page=1&pageSize=${PAGE_SIZE}`, 'GET', token, null); 
            if(response.status !== 200) {
                alert(`Error getting history for ${selectedExercise}, status ${response.status}`);
                return;
            }
            setExerciseData(response.data.data);
            setPageNum(1);
        } catch (err) {
            alert(err.message);
        }
    }

    const getNextPage = async() => {
        try {
            if(!selectedExercise) return;

            const parsedExercise = selectedExercise.replace(/ /g, "%20");

            const response = await makeRequest(`exercise/history?exercise=${parsedExercise}&page=${pageNum + 1}&pageSize=${PAGE_SIZE}`, 'GET', token, null); 
            if(response.status !== 200) {
                alert(`Error getting history for ${selectedExercise}, status ${response.status}`);
                return;
            }

            if(response.data.data.length > 0) {
                setExerciseData(response.data.data);
                setPageNum(pageNum + 1);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    const getPrevPage = async() => {
        try {
            if(!selectedExercise) return;

            const parsedExercise = selectedExercise.replace(/ /g, "%20");

            if(pageNum > 1) {
                const response = await makeRequest(`exercise/history?exercise=${parsedExercise}&page=${pageNum - 1}&pageSize=${PAGE_SIZE}`, 'GET', token, null); 
                if(response.status !== 200) {
                    alert(`Error getting history for ${selectedExercise}, status ${response.status}`);
                    return;
                }
                setExerciseData(response.data.data);
                setPageNum(pageNum - 1);
            }
        } catch (err) {
            alert(err.message);
        }
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
            {exerciseData.length > 0 && exerciseData.map(day => (
                <div>
                    <h3>{parseDate(new Date(day.date))}</h3>
                    {day.setInfo.map((set, index) => (
                        <div>
                            <p>&emsp;{`${index + 1}. Weight: ${set.weight}, Reps: ${set.reps}`}</p>
                        </div>
                    ))}
                </div>
            ))}
            {exerciseData.length === 0 && <h2>No History To Show</h2>}
            <button onClick={getPrevPage}>Previous</button>
            <button onClick={getNextPage}>Next</button>
            <br/>
            <p>Page: {pageNum}</p>
            <br/>
            <button onClick={switchToWorkoutsPage}>Back</button>
        </div>
    );
}

export default ExerciseHistory;