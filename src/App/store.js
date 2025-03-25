import { configureStore } from '@reduxjs/toolkit';
import tareasReducer from '@/Features/Tasks/tareasSlice';
import temaReducer from '@/Features/Theme/temaSlice';

export const store = configureStore({
	reducer: {
		tareas: tareasReducer,
		tema: temaReducer,
	},
});
