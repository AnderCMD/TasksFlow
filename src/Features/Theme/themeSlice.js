import { createSlice } from '@reduxjs/toolkit';
import { readFromStorage, writeToStorage } from '@/Utils/storage';

const STORAGE_KEY = 'tasksflow:theme';
const LEGACY_STORAGE_KEY = 'tema';

const applyThemeClass = (mode) => {
	document.documentElement.classList.toggle('dark', mode === 'dark');
};

const loadThemeFromStorage = () => {
	try {
		const legacyTheme = readFromStorage(LEGACY_STORAGE_KEY);
		if (legacyTheme) {
			const migrated = legacyTheme === 'oscuro' ? 'dark' : 'light';
			writeToStorage(STORAGE_KEY, migrated);
			return migrated;
		}

		const storedTheme = readFromStorage(STORAGE_KEY);
		if (storedTheme) {
			return storedTheme;
		}

		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}

		return 'light';
	} catch (error) {
		console.error('Failed to load theme preference from localStorage:', error);
		return 'light';
	}
};

const initialState = {
	mode: loadThemeFromStorage(),
};

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		toggleTheme: (state) => {
			state.mode = state.mode === 'dark' ? 'light' : 'dark';
			writeToStorage(STORAGE_KEY, state.mode);
			applyThemeClass(state.mode);
		},
		setTheme: (state, action) => {
			state.mode = action.payload;
			writeToStorage(STORAGE_KEY, state.mode);
			applyThemeClass(state.mode);
		},
	},
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export const selectTheme = (state) => state.theme.mode;

export default themeSlice.reducer;
