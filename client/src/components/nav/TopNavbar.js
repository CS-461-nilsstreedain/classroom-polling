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
                    <div className='navbarItem main'><NavLink className='navbarItem' to='/home'>{process.env.REACT_APP_NAME}</NavLink></div>
                    { props.loggedIn && <NavLink className='navbarItem' to='/'>Courses</NavLink> }
                </div>
                <div className="navbarRightContainer">
                    <div className="dropdown">
                        <div><FontAwesomeIcon className="dropdownIcon" icon={faUser}/></div>
                        <UserMenu loggedIn={props.loggedIn}/>
                    </div>
                </div>
            </div>
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