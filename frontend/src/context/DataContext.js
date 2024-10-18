import { createContext, useState } from 'react';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [workoutData, setWorkoutData] = useState(null);
    const [userExercises, setUserExercises] = useState([]);
    const [displayWorkout, setDisplayWorkout] = useState({});

    return (
        <DataContext.Provider value={{
            workoutData,
            setWorkoutData,
            userExercises,
            setUserExercises,
            displayWorkout,
            setDisplayWorkout
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;