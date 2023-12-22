import { configureStore } from '@reduxjs/toolkit'
import loginSlice from "./Slices/loginSlice.js";
import createUserSlice from './Slices/createUserSlice.js'
import getUsersSlice from './Slices/getUserSlice.js'
import AttendenceSlice from './Slices/getAttendanceSlice.js'
import checkInReducer from './Slices/checkInSlice.js'

const store = configureStore({
    reducer: {
        loginSlice,
        createUserSlice,
        getUsersSlice,
        AttendenceSlice,
        checkIn: checkInReducer,
    },
  })
  
  export default store