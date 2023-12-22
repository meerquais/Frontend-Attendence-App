import React, { useEffect, useState } from 'react';
import { IoMdPerson, IoIosCalendar } from 'react-icons/io';
import uploadImage from '../../services/uploadimg';
import { useDispatch, useSelector } from 'react-redux';
import { createUserAction } from '../../store/Slices/createUserSlice';
import { getUserAction } from '../../store/Slices/getUserSlice';
import { AttendenceAction } from '../../store/Slices/getAttendanceSlice';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { usersLoading, usersData } = useSelector((state) => state.getUsersSlice)

  useEffect(() => {
    dispatch(getUserAction({}))
  }, [])

  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Students');
  const { loading } = useSelector((state) => state.createUserSlice)
  const { attendenceLoading, attendenceData } = useSelector((state) => state.AttendenceSlice)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    file: null,
    phoneNumber: '',
    courseName: '',
  });

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    // Reset the form data on modal close
    setFormData({
      fullName: '',
      email: '',
      password: '',
      file: null,
      phoneNumber: '',
      courseName: '',
    });
  };

  // Define the icons for Student and Attendance
  const studentIcon = <IoMdPerson className="text-blue-500 rounded-full bg-blue-100 mx-3" />;
  const attendanceIcon = <IoIosCalendar className="text-blue-500 rounded-full bg-blue-100 mx-3" />;

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    // If the input is a file input, use the first file from the selected files
    const file = name === 'file' ? files[0] : null;

    setFormData({
      ...formData,
      [name]: name === 'file' ? file : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, phoneNumber, courseName, fullName, file } = formData

    if (!email || !password || !phoneNumber || !courseName || !fullName || !file) {
      alert("fill all the required fields")
      return
    }

    const imgUrl = await uploadImage(file)

    dispatch(createUserAction({ email, password, phoneNumber, courseName, fullName, imgUrl }))
    closeModal();
  };

  // Logout function
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // Redirect to the login page
    navigate('/');
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/5 text-black p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h1 className="font-bold text-lg text-blue-500">Attendance App</h1>
          </div>
          <div
            className={`flex items-center cursor-pointer mb-4 ${currentPage === 'Students' ? 'font-bold' : ''}`}
            onClick={() => setCurrentPage('Students')}
          >
            {studentIcon}
            Students
          </div>
          <div
            className={`flex items-center cursor-pointer mb-4 ${currentPage === 'Attendance' ? 'font-bold' : ''}`}
            onClick={() => {
              dispatch(AttendenceAction({}));
              setCurrentPage('Attendance');
            }}
          >
            {attendanceIcon}
            Attendance
          </div>
        </div>
        <div className="mt-auto cursor-pointer" onClick={handleLogout}>
          Logout
        </div>
      </div>

      {/* Right Content */}
      <div className="w-4/5 p-6 bg-gray-100">
        {/* Page Title */}
        <div className="text-2xl font-bold mb-6 flex items-center">
          {currentPage}
          <span className="ml-2 flex text-blue-500 mt-2">
            {currentPage === 'Students' ? studentIcon : attendanceIcon}
          </span>
        </div>

        {/* Add Button */}
        <div className="flex justify-between mb-6 items-center">
          <div></div>
          <button onClick={openModal} className="p-2 bg-blue-500 text-white rounded-full">
            Add Student
          </button>
        </div>

        {/* Table-like Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">
            {currentPage === 'Students' ? 'Student Information' : 'Attendance Information'}
          </h2>
          <div className="flex  bg-blue-500 p-3 rounded-lg">
            <div className="w-1/6">ID</div>
            <div className="w-1/6">Profile Img</div>
            <div className="w-1/6">Full Name</div>
            {currentPage === 'Students' ? (
              <div className="w-1/6">Course Name</div>
            ) : (
              <>
                <div className="w-1/6">Checked In Time</div>
                <div className="w-1/6">Checked Out Time</div>
              </>
            )}
          </div>

          {currentPage === "Students" ? (usersData?.map((x) => {
            const { picture, name, _id, course_name, roll_no } = x
            return <div key={_id} className="flex border-b py-2">
              <div className="w-1/6">{roll_no}</div>
              <div className="w-1/6"><img width={100} src={picture} alt="pic" /></div>
              <div className="w-1/6">{name}</div>
              <div className="w-1/6">{course_name}</div>
            </div>
          })) : attendenceData?.map((x) => {
            return <div key={x._id} className="flex border-b py-2">
              <div className="w-1/6">{x.roll_no}</div>
              <div className="w-1/6"><img width={100} src={x.picture} alt="pic" /></div>
              <div className="w-1/6">{x.name}</div>
              <div className="w-1/6">{x.course_name}</div>
            </div>
          })}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 max-w-md rounded-md">
              <h2 className="text-2xl font-bold mb-6">Add {currentPage}</h2>
              <form onSubmit={loading ? null : handleSubmit}>

                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                    File
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={closeModal} className="mr-2 bg-blue-500 p-2 text-white rounded-full">
                    Close
                  </button>
                  <button type="submit" className={`bg-blue-500 text-white rounded-full p-2 ${loading ? "cursor-not-allowed" : "cursor-pointer"} `}>
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
