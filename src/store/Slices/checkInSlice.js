import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: null,
  data: {},
};

export const checkInAction = createAsyncThunk(
  'checkIn/auth',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      // Make the necessary API call for check-in using the "/api/v1/checkin" endpoint
      const response = await axios.post('https://attendance-app-backend-alpha.vercel.app/api/v1/checkin', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Dispatch other actions as needed
      // dispatch(someOtherAction({}));

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const checkInSlice = createSlice({
    name: "checkIn",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(checkInAction.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(checkInAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Update state.data directly with the payload (no need for .data)
        state.data = action.payload;
      });
      builder.addCase(checkInAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = {};
      });
    },
  });
  
  export default checkInSlice.reducer;
  