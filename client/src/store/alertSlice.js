import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../config/api';

// Send alert
export const sendAlert = createAsyncThunk('alerts/send', async (alertData) => {
  const res = await API.post('/alerts', alertData);
  return res.data.alert;
});

// Fetch all alerts
export const fetchAlerts = createAsyncThunk('alerts/fetchAll', async () => {
  const res = await API.get('/alerts');
  return res.data.alerts;
});

const alertSlice = createSlice({
  name: 'alerts',
  initialState: { list: [], loading: false, error: null },
  reducers: {
    // Real-time: add incoming socket alert
    addAlert: (state, action) => {
      state.list.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(sendAlert.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const { addAlert } = alertSlice.actions;
export default alertSlice.reducer;