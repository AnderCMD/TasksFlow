import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '@/Features/Tasks/tasksSlice';

export const store = configureStore({
	reducer: {
		tasks: tasksReducer,
	},
});
