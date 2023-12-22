import React, { useState, useEffect } from 'react';
import { IoMdPerson, IoIosCalendar } from 'react-icons/io';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkInAction } from '../../store/Slices/checkInSlice'; // Update the path

function StudentDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [checkInDisabled, setCheckInDisabled] = useState(false);
 
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Check if user has already checked in today
      const lastCheckInTime = localStorage.getItem('lastCheckInTime');
      if (lastCheckInTime) {
        const currentTime = new Date().getTime();
        const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  
        if (currentTime - parseInt(lastCheckInTime) < twentyFourHoursInMilliseconds) {
          // User has already checked in today
          setCheckInDisabled(true);
        } else {
          // User can check in again
          setCheckInDisabled(false);
        }
      }
    }, 2000); // 2 seconds
  
    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const checkInState = useSelector((state) => state.checkIn);

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('authUser'));

    if (!token || !user) {
      // Redirect to the login page if not authenticated
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    console.log('Check-in state:', checkInState);
  }, [checkInState]);

  // Populate formData from authUser
  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    if (authUser) {
      setFormData({
        fullName: authUser.name || '',
        profileImg: authUser.picture || '[Profile Img URL]',
        courseName: authUser.course_name || '',
        id: authUser.roll_no || '',
      });
    }
  }, []);

  const [currentPage, setCurrentPage] = useState('My Profile');
  const [formData, setFormData] = useState({
    fullName: '',
    profileImg: '', // Replace with actual image URL or use an Image component
    courseName: '',
    id: '',
  });

  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    fullName: formData.fullName,
    profileImg: formData.profileImg,
  });

  const profileIcon = <IoMdPerson className="text-blue-500 rounded-full bg-blue-100 mx-3" />;
  const attendanceIcon = <IoIosCalendar className="text-blue-500 rounded-full bg-blue-100 mx-3" />;

  const handleUpdateModalOpen = () => {
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the UID from LocalStorage
      const uid = localStorage.getItem('uid');

      // Make an API call to update user information
      const response = await axios.put(`your-api-endpoint-for-update/${uid}`, {
        fullName: updateFormData.fullName,
        profileImg: updateFormData.profileImg,
      });

      // Assuming the API responds with the updated user data
      const updatedUserData = response.data;

      // Update the local state with the new data
      setFormData(updatedUserData);

      // Close the update modal
      handleUpdateModalClose();
    } catch (error) {
      console.error('Error updating user information:', error);
      // Handle error as needed
    }
  };

  const userName = (localStorage.getItem('authUser') && JSON.parse(localStorage.getItem('authUser')).name) || 'name';

  const handleLogout = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('user');
    localStorage.removeItem('profileImg');
    navigate('/');
  };

  const [isCheckInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkInFile, setCheckInFile] = useState(null);

  const handleCheckInModalOpen = () => {
    setCheckInModalOpen(true);
  };

  const handleCheckInModalClose = () => {
    setCheckInModalOpen(false);
  };

  const handleCheckInFileChange = (e) => {
    const file = e.target.files[0];
    setCheckInFile(file);
  };

  const handleCheckInSubmit = async () => {
    console.log('handleCheckInSubmit called');
  
    const authUser = JSON.parse(localStorage.getItem('authUser'));
  
    if (!authUser || !authUser._id) {
      console.error('Invalid user data');
      return;
    }
  
    // Check if user has already checked in today
    const lastCheckInTime = localStorage.getItem('lastCheckInTime');
    if (lastCheckInTime) {
      const currentTime = new Date().getTime();
      const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  
      if (currentTime - parseInt(lastCheckInTime) < twentyFourHoursInMilliseconds) {
        // User has already checked in today
        // Display alert
        alert("You have already checked in today. Please come back tomorrow.");
        return;
      }
    }
  
    // Display a cool-looking alert (you can use a library like SweetAlert for better styling)
    alert("You have successfully checked in for today. Please come back tomorrow.");
  
    // Update UI - Change the color of Check-In button to red and disable it
    // Example: Assuming you have a state variable to track check-in status
    // setCheckInStatus(true);
  
    // Format the check-in time
    const checkInTime = new Date().toLocaleString();
  
    // Update the attendance record
    const attendanceRecord = {
      id: authUser.roll_no,
      fullName: authUser.name,
      courseName: authUser.course_name,
      checkInTime: checkInTime,
    };
  
    // Retrieve existing records from localStorage
    const existingRecords = localStorage.getItem('attendanceRecords')
      ? JSON.parse(localStorage.getItem('attendanceRecords'))
      : [];
  
    // Add the new record to the existing records
    const updatedRecords = [...existingRecords, attendanceRecord];
  
    // Save the updated records in localStorage
    localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
  
    // Save check-in status and time in localStorage
    localStorage.setItem('lastCheckInTime', new Date().getTime().toString());
  
    // Close the Check In modal
    setCheckInModalOpen(false);
  };

  // Use useEffect to log the checkInState changes
  useEffect(() => {
    console.log('Check-in state:', checkInState);
  }, [checkInState]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/5 text-black p-6 flex flex-col justify-between md:sticky top-0 h-screen bg-white border-r">
        <div>
          <div className="mb-8">
            <h1 className="font-bold text-lg text-blue-500">Attendance App</h1>
          </div>
          <div
            className={`flex items-center cursor-pointer mb-4 ${currentPage === 'My Profile' ? 'font-bold' : ''}`}
            onClick={() => setCurrentPage('My Profile')}
          >
            {profileIcon}
            My Profile
          </div>
          <div
            className={`flex items-center cursor-pointer mb-4 ${currentPage === 'My Attendance' ? 'font-bold' : ''}`}
            onClick={() => setCurrentPage('My Attendance')}
          >
            {attendanceIcon}
            My Attendance
          </div>
        </div>
        <div className="mt-auto cursor-pointer" onClick={handleLogout}>
          Logout
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-4/5 p-6 bg-gray-100 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
        {/* Page Title */}
        <div className="text-2xl font-bold mb-6 flex items-center">
          {currentPage}
          <span className="ml-2 flex text-blue-500 mt-2">
            {currentPage === 'My Profile' ? profileIcon : attendanceIcon}
          </span>
        </div>

        {/* Add the heading with the user's name */}
        <h1 className="text-xl font-bold mb-6">Hello {userName}!</h1>

        {/* Profile Information */}
        {currentPage === 'My Profile' && (
          <div className="mb-6">
            {/* Update Info Button */}
            <button onClick={handleUpdateModalOpen} className="bg-blue-500 text-white rounded-full p-2 mb-4">
              Update Info
            </button>
            {/* Profile Information Content */}
            <div className="flex items-center mb-4">
              <div className="w-1/4">ID:</div>
              <div className="w-3/4">{formData.id}</div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-1/4">Profile Img:</div>
              <div className="w-3/4">
                <img
                  src={formData.profileImg}
                  alt="Profile Img"
                  className="rounded-full bg-blue-100 h-16 w-16 object-cover"
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-1/4">Full Name:</div>
              <div className="w-3/4">{formData.fullName}</div>
            </div>
            <div className="flex items-center">
              <div className="w-1/4">Course Name:</div>
              <div className="w-3/4">{formData.courseName}</div>
            </div>
          </div>
        )}

        {/* Update Info Modal */}
        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 max-w-md rounded-md">
              <h2 className="text-2xl font-bold mb-6">Update Info</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={updateFormData.fullName}
                    onChange={handleUpdateInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="profileImg" className="block text-sm font-medium text-gray-700">
                    Profile Img
                  </label>
                  <input
                    type="file"
                    id="profileImg"
                    name="profileImg"
                    accept="image/*"
                    onChange={(e) => handleUpdateInputChange(e)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdateModalClose}
                    className="mr-2 bg-blue-500 p-2 text-white rounded-full"
                  >
                    Close
                  </button>
                  <button type="submit" className="bg-blue-500 text-white rounded-full p-2">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentPage === 'My Attendance' && (
          <div className="mb-6">
            {/* Button for Check In */}
            <button
  className={`bg-${checkInDisabled ? 'gray' : 'blue'}-500 text-white rounded-full p-2 mr-2`}
  onClick={handleCheckInModalOpen}
  disabled={checkInDisabled}
>
  Check In
</button>
            {/* Check In Modal */}
            {isCheckInModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 max-w-md rounded-md">
                  <h2 className="text-2xl font-bold mb-6">Check In</h2>
                  <label htmlFor="checkInFile" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload a file:
                  </label>
                  <input
                    type="file"
                    id="checkInFile"
                    name="checkInFile"
                    onChange={handleCheckInFileChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full mb-4"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCheckInModalClose}
                      className="mr-2 bg-blue-500 text-white rounded-full p-2"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckInSubmit}
                      className="bg-blue-500 text-white rounded-full p-2"
                    >
                      Check In
                    </button>
                  </div>
                </div>
              </div>
            )}

              
            {/* Attendance Table */}

            <div className="mt-4">
  <h2 className="text-2xl font-bold mb-4">Attendance Table</h2>
  <table className="min-w-full border bg-white">
    <thead className="bg-blue-500 text-white">
      <tr>
        <th className="py-2 px-4">Full Name</th>
        <th className="py-2 px-4">ID</th>
        <th className="py-2 px-4">Course Name</th>
        <th className="py-2 px-4">Check-In Time</th>
      </tr>
    </thead>
    <tbody>
      {/* Retrieve attendance records from localStorage */}
      {localStorage.getItem('attendanceRecords') &&
        JSON.parse(localStorage.getItem('attendanceRecords')).map((record) => (
          <tr className="justify-center text-center" key={record.id}>
            <td className="py-2 px-4">{record.fullName}</td>
            <td className="py-2 px-4">{record.id}</td>
            <td className="py-2 px-4">{record.courseName || '-'}</td>
            <td className="py-2 px-4">{record.checkInTime}</td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
