import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { getUserAction } from "./getUserSlice";

const initialState = {
    loading: false,
    error: null,
    data: {},
}

const createUserSlice = createSlice({
    name:"login",
    initialState,
    reducers:{},
    extraReducers : (builder) =>{
        builder.addCase(createUserAction.pending,(state,action)=>{
                state.loading = true
        })
        builder.addCase(createUserAction.fulfilled,(state,action)=>{
                state.loading = false
                state.error = null
                state.data = action.payload.data
        })
        builder.addCase(createUserAction.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload
                alert(action.payload)
                state.data = {}
        })
    }
})

export const createUserAction = createAsyncThunk("login/auth", async ({email , password,phoneNumber,courseName,fullName,imgUrl },{rejectWithValue, dispatch}) => {
    
    try{
        const token = localStorage.getItem("authToken")
       
        const response = await axios.post("https://nice-gray-prawn-tutu.cyclic.app/api/v1/createuser",{email , password, phoneNo : phoneNumber, courseName, name :fullName, picture:imgUrl},{ headers: { Authorization: `Bearer ${token}` } })
        dispatch(getUserAction({}))
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.message)
    }
    
  });
  
export default createUserSlice.reducer