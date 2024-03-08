import React, { useState } from 'react'
import { Button, Form } from "react-bootstrap"
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { createCourse } from "../redux/actions";
import { Link, useParams } from 'react-router-dom';
import apiUtil from '../utils/apiUtil'
import { TailSpin } from  'react-loader-spinner'
import Notice from '../components/Notice'
import useCourse from "../hooks/useCourse";

function AddCourse(props){
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [published, setPublished] = useState()
    const [error, setError] = useState(false)
    const [message, setMessage] = useState("")
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function postCourse(newCoursePayload){
        //make a POST course api call
        setLoading(true)
        console.log("course req body:", newCoursePayload)
        const response = await apiUtil("post", "/courses", { dispatch: dispatch, navigate: navigate}, newCoursePayload)
        console.log("response course creation:", response.data)
        setLoading(false)

        //update the redux
        setError(response.error)
        setMessage(response.message)
        if(response.status === 201){
            dispatch(createCourse(response.data.course))
            navigate(`/${response.data.course.id}`)
        }
    }

    function addCourseSubmit(e){
        e.preventDefault()

        const newCourse = {
            name: name,
            description: description,
            published: (published == "on") ? 1 : 0
        }

        postCourse(newCourse)
    }

    return (
        <>
            { message !== "" && <Notice message={message} error={error}/> }
            { loading ? <TailSpin visible={true}/> : <Form className="create-container" onSubmit={(e) => { addCourseSubmit(e) }}>
                <div className='create-bar'>
                    <Link className='back-btn-create' to={`/`}>
                        <Button className='back-btn'> 
                            <div id="back-btn-image"/>
                        </Button>
                    </Link>
                    <p className='create-subtitle'>Create Course</p>
                </div>

                <hr className='create-hr-bar'></hr>

                <Form.Group className="inputNameContainer">
                    <Form.Label>Class Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter Class Name" 
                        onChange={(e) => setName(e.target.value)}/>
                </Form.Group>
                <Form.Group className="inputDescriptionContainer">
                    <Form.Label>Class Description</Form.Label>
                    <Form.Control 
                        id="create-description"
                        as="textarea" 
                        rows="4"
                        placeholder="Enter Class Description"
                        onChange={(e) => setDescription(e.target.value)}/>
                </Form.Group>
                {/*Publish Course Doesn't do anything yet - NOT FUNCTION*/}
                <Form.Group className="inputPublishedContainer">
                    <Form.Check 
                        type="switch" 
                        id="publishSwitch" 
                        label="Publish Class" 
                        size="large" 
                        onChange={(e) => setPublished(e.target.value)}/>
                </Form.Group>
                <div className="create-btns">
                    <Link to={`/`}>
                        <Button variant="secondary" id="create-cancel">
                            Cancel
                        </Button>
                    </Link>
                    <Button variant="primary" type="submit" id="create-submit">
                        Create Course
                    </Button>
                </div>
            </Form> }
        </>
    )
}

export default AddCourse;