import { useContext, useState } from "react";
import PageContext from "./context/PageContext";
import DataContext from "./context/DataContext";
import RequestContext from "./context/RequestContext";
//test
const ExerciseHistory = () => {
    const PAGE_SIZE = 5;
    const [selectedExercise, setSelectedExercise] = useState('');
    const [exerciseData, setExerciseData] = useState([]);
    const [pageNum, setPageNum] = useState(1);

    const { switchToWorkoutsPage } = useContext(PageContext);
    const { userExercises } = useContext(DataContext);
    const { token, makeRequest } = useContext(RequestContext);

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
        return `${date.substring(8, 10)}/${date.substring(5, 7)}/${date.substring(0, 4)}`;
    }

    return (
        <div className="appPage" style={{overflowY:"auto"}}>
            <div className='header'>
              <h2 className='headerText'>Fitness Tracker</h2>
              <button onClick={switchToWorkoutsPage} className="headerButton" style={{marginLeft:"30%"}}>Cancel</button>
            </div>
            <select
                name="exercise"
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
                id="exerciseHistorySelect"
            >
                <option value="" disabled>Select Exercise</option>
                {userExercises.map((exercise, index) => (
                    <option key={index} value={exercise}>
                        {exercise}
                    </option>
                ))}
            </select>
            <button onClick={getHistory} id="exerciseHistorySubmit">Select</button>
            {exerciseData.length > 0 && exerciseData.map(day => (
                <div className="exerciseWidget">
                    <h3 className="exerciseHistoryWidgetHeader">{parseDate(day.date)}</h3>
                    {day.setInfo.map((set, index) => (
                        <div>
                            <p className="exerciseHistoryWidgetText">&emsp;{`${index + 1}. Weight: ${set.weight}, Reps: ${set.reps}`}</p>
                        </div>
                    ))}
                    <br/>
                </div>
            ))}
            {exerciseData.length === 0 && <h2 id="noWorkoutHistoryText">No History To Show</h2>}
            <button className="pageToggleButton" style={{marginLeft:"35%"}} onClick={getPrevPage}>Previous</button>
            <div className="pageToggleNum"><p>{pageNum}</p></div>
            <button className="pageToggleButton" onClick={getNextPage}>Next</button>
            <br/>
        </div>
    );
}

export default ExerciseHistory;