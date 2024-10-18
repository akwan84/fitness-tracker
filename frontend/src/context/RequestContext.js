import { createContext, useContext, useState } from 'react';
import DataContext from './DataContext';

const RequestContext = createContext({});

export const RequestProvider = ({ children }) => {
    const PAGE_SIZE = 5;

    const [token, setToken] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { setWorkoutData, setUserExercises } = useContext(DataContext);

    const handleWorkoutsRefresh = async(token) => {
        const res = await makeRequest(`workout?pageSize=${PAGE_SIZE}&page=1`, 'GET', token, null);
        if(res.status !== 200) {
            throw new Error(res.message);
        }
        return res.data;
    }

    const handleExerciseRefresh = async(token) => {
        const res = await makeRequest('exercise', 'GET', token, null);
        if(res.status !== 200) {
          throw new Error(res.message);
        }
        return res.data;
    }

    const handleRefresh = async () => {
        //call the refresh token endpoint
        const response = await fetch('http://localhost:3500/refresh', {
          method: 'GET',
          credentials: 'include', 
        });
    
        //throw errors in the response is a 401 or 403
        if(response.status === 401) {
          setIsLoggedIn(false);
          throw new Error('Unauthorized');
        }
    
        if(response.status === 403) {
          setIsLoggedIn(false);
          throw new Error('Forbidden');
        }
        
        //print out and store the access token
        const data = await response.json();
        setToken(data["accessToken"]);
        setIsLoggedIn(true);
    
        //refresh the display workouts with the new page 1
        const workouts = await handleWorkoutsRefresh(data["accessToken"]);
        setWorkoutData(workouts);
    
        //refetch the user exercises
        const exercises = await handleExerciseRefresh(data["accessToken"]);
        setUserExercises(exercises.exercises);
    }

    const makeRequest = async (route, method, token, reqBody) => {
        let response;
        try {
            //set request options
            const options = {
                method: method,
                headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                }
            };
        
            //set a request body if one is provided
            if(reqBody) {
                options.body = JSON.stringify(reqBody);
            }
        
            //attempt to call the endpoint
            response = await fetch(`http://localhost:3500/${route}`, options);
        
            if(response.status === 403) {
                //try refreshing the token if the call returns a 403
                console.log("Refreshing Token");
                await handleRefresh();
                response = await fetch(`http://localhost:3500/${route}`, options);
            }
        
            //throw an error if an error status code is returned
            if (response.status >= 400) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            return {
                "status" : response.status,
                "data" : data
            };
        } catch(err) {
            console.log(err.message);
            return {
                "status" : response.status,
                "message" : err.message
            };
        }
    }

    return (
        <RequestContext.Provider value={{
            handleWorkoutsRefresh,
            handleExerciseRefresh,
            makeRequest,
            handleRefresh,
            token,
            setToken,
            isLoggedIn,
            setIsLoggedIn
        }}>
            {children}
        </RequestContext.Provider>
    )
}

export default RequestContext;