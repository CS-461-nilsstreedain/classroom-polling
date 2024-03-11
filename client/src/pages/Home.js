import styled from '@emotion/styled/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap';
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { borderRadius, fontFamily, fontStyle, minHeight } from '@mui/system';

function Home() {
    return(

        <div id="home">
            <p className='mainText'> Welcome Back! </p>
        </div>
    )
}

const productSummary = "The Classroom Polling: Oregon State University project is an instance of the Open Source Polling Software developed as part of Oregon State University's senior capstone project."
const productUse = "The project's goal is to provide an affordable and high quality polling system for teachers to utilize in the classroom. The system provides all the features of a paid service without any of the trailing zeroes. Teachers are able to create courses and sections, to which they invite their students. Teachers create lectures and questions, which they release at their own pace for students to interact with. Teachers and students alike can look back on the lectures to assess performance on the lecture's questions and overall lecture performance."


export default Home
