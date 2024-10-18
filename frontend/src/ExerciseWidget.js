const ExerciseWidget = ({ exercise, workout }) => {
    const mapSets = () => {
        const sets = [];
        for(let i = 0; i < exercise.setInfo.length; i++) {
            sets.push(
                <div>
                    <h3 className="exerciseWidgetSetHeader">{`Set ${i+1}`}</h3>
                    <p className="exerciseWidgetSetContent">{`Weight: ${exercise.setInfo[i].weight}`}</p>
                    <p className="exerciseWidgetSetContent">{`Reps: ${exercise.setInfo[i].reps}`}</p>
                </div>
            );
        }
        return sets;
    }

    return (
        <div className="exerciseWidget">
            <br/>
            <h2 className="exerciseWidgetExerciseHeader">{exercise.exercise}</h2>
            {mapSets()}
            <br/>
        </div>
    );
}

export default ExerciseWidget;