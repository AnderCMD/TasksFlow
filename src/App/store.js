import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '@/Features/Tasks/tasksSlice';
import themeReducer from '@/Features/Theme/themeSlice';

export const store = configureStore({
	reducer: {
		tasks: tasksReducer,
		theme: themeReducer,
	},
});
