import React, { useState, useEffect } from 'react';
import { IoMdPerson, IoIosCalendar } from 'react-icons/io';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('authUser'));

    console.log('Token:', token);
    console.log('User:', user);

    if (!token || !user) {
      // Redirect to the login page if not authenticated
      navigate('/');
    }
  }, [navigate]);

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

  // Get the user's name from LocalStorage
  const userName = (localStorage.getItem('authUser') && JSON.parse(localStorage.getItem('authUser')).name) || 'name';

  // Logout function
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('uid');
    localStorage.removeItem('user');
    localStorage.removeItem('profileImg');
    // Redirect to the login page
    navigate('/');
  };

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
          <div className="mb-6 max-h-96 overflow-y-auto relative">
            {/* Button for Check In/Out */}
            <div className="flex justify-end mb-4 sticky top-0 z-10">
              <button  className="bg-blue-500 text-white rounded-full p-2 mr-2">Check In</button>
              {/* <button className="bg-blue-500 text-white rounded-full p-2">Check Out</button> */}
            </div>
            <h2 className="text-xl font-bold mb-2">Attendance Information</h2>
            <div className="flex bg-blue-500 p-3 rounded-lg">
              <div className="w-1/6">ID</div>
              <div className="w-1/6">Profile Img</div>
              <div className="w-1/6">Full Name</div>
              <div className="w-1/6">Checked In Time</div>
              <div className="w-1/6">Checked Out Time</div>
            </div>
            {/* Actual data from LocalStorage */}
            {[...Array(10)].map((_, index) => (
              <div key={index} className="flex border-b py-2">
                <div className="w-1/6">{index + 1}</div>
                <div className="w-1/6">
                  <img
                    src={localStorage.getItem('profileImg') || '[Default Image URL]'}
                    alt="Profile Img"
                    className="rounded-full bg-blue-100 h-8 w-8 object-cover"
                  />
                </div>
                <div className="w-1/6">John Doe</div>
                <div className="w-1/6">09:00 AM</div>
                <div className="w-1/6">05:00 PM</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
