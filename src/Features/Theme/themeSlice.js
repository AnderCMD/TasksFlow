import { createSlice } from '@reduxjs/toolkit';

// Función para cargar la preferencia de tema del localStorage
const loadThemeFromStorage = () => {
	try {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			return storedTheme;
		}

		// Si no hay tema guardado, detectar preferencia del sistema
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}

		return 'light';
	} catch (error) {
		console.error('Error al cargar tema del localStorage:', error);
		return 'light';
	}
};

// Estado inicial
const initialState = {
	mode: loadThemeFromStorage(),
};

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		toggleTheme: (state) => {
			state.mode = state.mode === 'dark' ? 'light' : 'dark';
			localStorage.setItem('theme', state.mode);

			// Aplicar clase al elemento HTML para el tema oscuro
			if (state.mode === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		},
		setTheme: (state, action) => {
			state.mode = action.payload;
			localStorage.setItem('theme', state.mode);

			// Aplicar clase al elemento HTML para el tema oscuro
			if (state.mode === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		},
	},
});

// Acciones
export const { toggleTheme, setTheme } = themeSlice.actions;

// Selectores
export const selectTheme = (state) => state.theme.mode;

export default themeSlice.reducer;
