import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { TailSpin } from  'react-loader-spinner'
import Notice from '../Notice'
import { Button, Card } from "react-bootstrap"

function SingleQuestionTeacher(props) {
    const content = Object.keys(props.question.content)
    const answers = Object.keys(props.question.answers)
    return (
        <>
            <h1>
                { props.question.stem }
            </h1>
            <p>
                { props.question.type }
            </p>
            {content.map( (option, index) =>
                <div key={index}>
                    {
                        (answers[index] === true) ? <p>{index}. {option} (correct answer)</p> : <p>{index}. {option}</p>
                    }
                </div>
            )}
            {/* <button className="btn btn-primary" onClick={((e) => addQuestionsToLecture(e))}>Submit</button> */}
        </>
    )
}

export default SingleQuestionTeacher