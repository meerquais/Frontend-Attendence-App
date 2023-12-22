import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
    attendenceLoading: false,
    error: null,
    attendenceData: [],
}

const AttendenceSlice = createSlice({
    name:"attendence",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(AttendenceAction.pending, (state) => {
            state.attendenceLoading = true;
        });
        builder.addCase(AttendenceAction.fulfilled, (state, action) => {
            state.attendenceLoading = false;
            state.error = null;
            state.attendenceData = action.payload.data;
            console.log(action.payload.data);
    
        });
        builder.addCase(AttendenceAction.rejected, (state, action) => {
            state.attendenceLoading = false;
            state.error = action.payload;
            state.attendenceData = [];
        });
    },
})

export const AttendenceAction = createAsyncThunk("attendence/getAttendence", async ({},{rejectWithValue}) => {
    try{
        const token = localStorage.getItem("authToken")
       
        const response = await axios.get("https://nice-gray-prawn-tutu.cyclic.app/api/v1/attendance",{ headers: { Authorization: `Bearer ${token}` } })
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.message)
    }
    
  });
  
export default AttendenceSlice.reducer
