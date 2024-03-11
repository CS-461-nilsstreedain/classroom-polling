import { React, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './components.css'
import useAuth from '../../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import apiUtil from '../../utils/apiUtil'
import { useNavigate } from 'react-router';

//NavBar for the whole website.
function TopNavbar(props) {
    
    return (
            <div className='navbarMain' expand="lg">
                <div className='navbarLeftContainer'>
                    {/*Image attr: Unknown, need to ask*/}
                    <span><NavLink className='navbarItem' id='classroomLink' to='/home'><img id="classroomIcon" src="classroomIcon.png" />{process.env.REACT_APP_NAME}</NavLink></span> {/* Why not hard code??*/}
                    {/*{ props.loggedIn && <NavLink className='navbarItem' to='/'>Courses</NavLink> }*/}
                </div>

                {/*TODO: Finish obvious improvements, add functionality to read name of user*/}
                <div className="navbarCenterContainer">
                    {props.loggedIn ?
                        <LoggedInButtons />
                        :
                        <p className='navbarItem smallText'> placeholder not logged in </p>
                    }

                </div>
                <div className="navbarRightContainer">
                    {props.loggedIn ?
                        <LoggedInRight loggedIn={props.loggedIn} />
                        :
                        <LoggedOutRight />
                    }

                </div>
            </div>
    );
}

function LoggedOutRight(){
    return(
        <span className="navButtons rightButtons">
            <a href="/login" className="navLogin"> Log In </a>
            <a href="/create" className="navSignup"> Get Started </a>
        </span>
    )
}

function LoggedInRight(props){
    return(
        <div className="navbarItem dropdown">
            <FontAwesomeIcon className="dropdownIcon" icon={faUser}/>
            <UserMenu loggedIn={props.loggedIn}/>
        </div>
    )
}

function LoggedInButtons(){
    return(
        <>
            <span className="navButtons">
                <a href="/home" className="navHome"> Home </a>
                <a href="/" className="navCourses"> Courses </a>
            </span>
        </>
    );
}

function UserMenu(props) {
    const navigate = useNavigate();
    async function logoutUser() { 
        try {
            const response = await apiUtil("get", `/users/logout`);
            if (response.status === 200) {
                location.reload();
            }
        } catch (error) {
            console.error("Error occurred during logout:", error);
        }
    }

    return <>{ 
        props.loggedIn === true ? 
                        <div className="dropdownMenu">
                            <div className="dropdownItem"><NavLink className='dropdownLink' to='/profile'>Profile</NavLink></div>
                            <div className="dropdownItem"><NavLink onClick={logoutUser} className='dropdownLink' to='/login'>Logout</NavLink></div> {/* TODO: attach logout functionality (i.e. API request trigger)*/}
                        </div>
                        : <div className="dropdownMenu">
                            <div className="dropdownItem"><NavLink className='dropdownLink' to='/create'>Sign Up</NavLink></div>
                            <div className="dropdownItem"><NavLink className='dropdownLink' to='/login'>Login</NavLink></div>
                        </div>
    }</>
}

export default TopNavbar;