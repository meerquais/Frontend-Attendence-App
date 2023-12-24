import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
    usersLoading: false,
    error: null,
    usersData: [],
}

const getUsersSlice = createSlice({
    name:"getUsers",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(getUserAction.pending, (state) => {
            state.usersLoading = true;
        });
        builder.addCase(getUserAction.fulfilled, (state, action) => {
            state.usersLoading = false;
            state.error = null;
            state.usersData = action.payload.data;
    
        });
        builder.addCase(getUserAction.rejected, (state, action) => {
            state.usersLoading = false;
            state.error = action.payload;
            state.usersData = [];
        });
    },
})

export const getUserAction = createAsyncThunk("getUsers/gettingUsers", async ({},{rejectWithValue}) => {
    
    try{
        const token = localStorage.getItem("authToken")
       
        const response = await axios.get("https://attendance-app-backend-alpha.vercel.app/api/v1/users",{ headers: { Authorization: `Bearer ${token}` } })
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.message)
    }
    
  });
  
export default getUsersSlice.reducer
