import './App.css';
import { Route, Routes } from 'react-router-dom';

/*
  Page Imports
*/
import Login from './pages/Login';
import Profile from './pages/Profile'; 
import Signup from './pages/Signup'; 
import ConfirmationCodePasswordRequest from './pages/ConfirmationCodePassword'; 
import ResetPasswordForLoginUser from './pages/ResetPassword'; 
import Confirm from './pages/Confirm'; 
import Landing from './pages/Landing'; 
import Course from './pages/Course'; 
import Lectures from './pages/Lectures';
import Lecture from './pages/Lecture'; 
import Sections from './pages/Sections'; 
import Section from './pages/Section'; 
import LectureInSection from './pages/LectureInSection'; 
import Questions from './pages/Questions';
import CreateQuestion from './pages/CreateQuestion';
import Roster from './pages/Roster'; 
import Enrollments from './pages/Enrollments';
import SingleCoursePage from './pages/SingleCoursePage'; 
import AddCourse from './pages/AddCourse';
import AddLecture from './pages/AddLecture'; 
import Home from './pages/Home'; 
import SingleQuestion from './pages/SingleQuestion';

import Navigation from './components/nav/Navigation';
import useAuth from './hooks/useAuth'; 
import { Navigate, Outlet } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

function App() {
  const [loggedIn, message, error, loading] = useAuth(); // Using custom hook to check authentication

  // Render loading spinner if loading is true
  if (loading) {
    return <TailSpin visible={true} />;
  }

  return (
    <>
      <Routes>
        {/* Main navigation component */}
        <Route element={<Navigation loggedIn={loggedIn}></Navigation>}>

          {/* Routes accessible for users not logged in */}
          {/* There are only 4 accessible pages for users who are not logged in:
            - home
            - create account
            - login
            - password reset
          */}
          <Route path='/home' element={<Home />} />
          <Route element={!loggedIn && <Outlet />}>
            <Route path='/login' element={<Login />} />
            <Route path='/create' element={<Signup />} /> {/* redirects to landing page if a user is logged in already */}
            <Route
              path='/reset'
              element={<ConfirmationCodePasswordRequest />}
            /> {/* redirects to landing page if a user is logged in already */}
            <Route
              path='/reset/password'
              element={<ResetPasswordForLoginUser />}
            />
          </Route>

          {/* Routes requiring user to be logged in */}
          {/* All routes below require a user be logged in */}
          <Route element={loggedIn ? <Outlet /> : <Navigate to='/login' />}>
            {/* General routes */}
            <Route path='/' element={<Landing />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/confirm' element={<Confirm />} />
            <Route path='/createcourse' element={<AddCourse />} />

            {/* Course-related routes */}
            <Route path='/:courseId'>
              <Route path='' element={<SingleCoursePage />} />
              <Route path='questions/*' element={<Questions />} />
              <Route path='lectures/*' element={<Lectures />} />
              <Route path='roster/*' element={<Roster />} />
              <Route path='sections/*' element={<Sections />} />
            </Route>

            {/* Nested routes */}
            <Route path='/sections/:sectionId'>
              <Route path='' element={<Section />} />
              <Route path='lectures/:lectureId' element={<LectureInSection />} />
            </Route>

            <Route path='/lectures/:lectureId'>
              <Route path='' element={<Lecture />} />
              <Route path='questions/*' element={<Questions />} />
            </Route>

            <Route path='/questions/:questionId' element={<SingleQuestion />} />
            <Route path='/addlecture' element={<AddLecture />} />
            <Route path='/questions/add' element={<CreateQuestion />} />
            <Route path='/sections/:sectionId' element={<Enrollments />} />

            {/* TODO: Add more nested routes as needed */}

          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
