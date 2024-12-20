import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../api/Api';

export const submitFeedback = createAsyncThunk(
  'feedback/submit',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await Api.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearFeedbackStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks.push(action.payload);
        state.success = true;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeedbackStatus } = feedbackSlice.actions;
export default feedbackSlice.reducer;