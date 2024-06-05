const ExerciseWidget = ({ exercise, workout }) => {
    const mapSets = () => {
        const sets = [];
        for(let i = 0; i < exercise.setInfo.length; i++) {
            sets.push(
                <div>
                    <h3>{`Set ${i+1}`}</h3>
                    <p>&emsp;{`Weight: ${exercise.setInfo[i].weight}`}</p>
                    <p>&emsp;{`Reps: ${exercise.setInfo[i].reps}`}</p>
                </div>
            );
        }
        return sets;
    }

    return (
        <div>
            <h2>{exercise.exercise}</h2>
            {mapSets()}
        </div>
    );
}

export default ExerciseWidget;