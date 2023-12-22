import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
    loading: false,
    error: null,
    data: {},
}

const loginSlice = createSlice({
    name:"login",
    initialState,
    reducers:{},
    extraReducers : (builder) =>{
        builder.addCase(loginAction.pending,(state,action)=>{
                state.loading = true
        })
        builder.addCase(loginAction.fulfilled,(state,action)=>{
                state.loading = false
                state.error = null
                state.data = action.payload.data
        })
        builder.addCase(loginAction.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload
                alert(action.payload)
                state.data = {}
        })
    }
})

export const loginAction = createAsyncThunk("login/auth", async ({email , password , navigate},{rejectWithValue}) => {
    
    try{
        const response = await axios.post("https://nice-gray-prawn-tutu.cyclic.app/api/v1/userlogin",{email,password})
        localStorage.setItem("authToken",response.data.token)
        localStorage.setItem("authUser",JSON.stringify(response.data.data))
        navigate("/admin")
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.message)
    }
    
  });
  
export default loginSlice.reducer