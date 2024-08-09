import { createContext, useState } from 'react';

const PageContext = createContext({});

export const DataProvider = ({ children }) => {
    const [showWorkouts, setShowWorkouts] = useState(true);
    const [showWorkoutInfo, setShowWorkoutInfo] = useState(false);
    const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false);
    const [showUpdateWorkoutForm, setShowUpdateWorkoutForm] = useState(false);
    const [showExerciseHistoryPage, setShowExerciseHistoryPage] = useState(false);

    const switchToWorkoutsPage = () => {
        setShowWorkouts(true);
        setShowWorkoutInfo(false);
        setShowAddWorkoutForm(false);
        setShowUpdateWorkoutForm(false);
        setShowExerciseHistoryPage(false);
    }

    const switchToUpdateWorkoutPage = () => {
        setShowWorkouts(false);
        setShowWorkoutInfo(false);
        setShowAddWorkoutForm(false);
        setShowUpdateWorkoutForm(true);
        setShowExerciseHistoryPage(false);
    }

    const switchToWorkoutInfo = () => {
        setShowWorkouts(false);
        setShowWorkoutInfo(true);
        setShowAddWorkoutForm(false);
        setShowUpdateWorkoutForm(false);
        setShowExerciseHistoryPage(false);
    }

    const switchToExerciseHistoryPage = () => {
        setShowWorkouts(false);
        setShowWorkoutInfo(false);
        setShowAddWorkoutForm(false);
        setShowUpdateWorkoutForm(false);
        setShowExerciseHistoryPage(true);
    }

    const switchToAddWorkout = () => {
        setShowWorkoutInfo(false);
        setShowWorkouts(false);
        setShowUpdateWorkoutForm(false);
        setShowAddWorkoutForm(true);
        setShowExerciseHistoryPage(false);
    }

    return (
        <PageContext.Provider value={{
            switchToWorkoutsPage,
            switchToUpdateWorkoutPage,
            switchToWorkoutInfo,
            switchToExerciseHistoryPage,
            switchToAddWorkout,
            showWorkouts,
            showWorkoutInfo,
            showAddWorkoutForm,
            showUpdateWorkoutForm,
            showExerciseHistoryPage
        }}>
            {children}
        </PageContext.Provider>
    )
}

export default PageContext;