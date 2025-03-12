import { createSlice, nanoid } from '@reduxjs/toolkit';

// Recuperar tareas del localStorage si existen
const loadTasksFromStorage = () => {
	try {
		const storedTasks = localStorage.getItem('tasks');
		if (!storedTasks) return [];

		// Parsear los datos del localStorage
		const parsedTasks = JSON.parse(storedTasks);

		// Validar que sea un array
		if (!Array.isArray(parsedTasks)) return [];

		// Filtrar elementos nulos y asegurarse de que tengan la estructura correcta
		const validTasks = parsedTasks.filter(
			(task) =>
				task !== null &&
				typeof task === 'object' &&
				typeof task.id === 'string' &&
				typeof task.title === 'string'
		);

		// Si hay diferencia entre las tareas almacenadas y las válidas, actualizar localStorage
		if (validTasks.length !== parsedTasks.length) {
			localStorage.setItem('tasks', JSON.stringify(validTasks));
		}

		return validTasks;
	} catch (error) {
		console.error('Error al cargar tareas del localStorage:', error);
		// En caso de error, limpiar el localStorage para evitar problemas futuros
		localStorage.removeItem('tasks');
		return [];
	}
};

// Estado inicial
const initialState = {
	tasks: loadTasksFromStorage(),
	filter: 'all', // 'all', 'active', 'completed'
	status: 'idle',
	error: null,
};

export const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		// Agregar tarea
		addTask: {
			reducer: (state, action) => {
				state.tasks.push(action.payload);
				localStorage.setItem('tasks', JSON.stringify(state.tasks));
			},
			prepare: (title, description = '') => {
				return {
					payload: {
						id: nanoid(),
						title,
						description,
						completed: false,
						createdAt: new Date().toISOString(),
						priority: 'medium', // 'low', 'medium', 'high'
					},
				};
			},
		},

		// Eliminar tarea
		removeTask: (state, action) => {
			state.tasks = state.tasks.filter((task) => task !== null && task.id !== action.payload);
			localStorage.setItem('tasks', JSON.stringify(state.tasks));
		},

		// Cambiar estado de la tarea (completada/pendiente)
		toggleTaskStatus: (state, action) => {
			const task = state.tasks.find((task) => task !== null && task.id === action.payload);
			if (task) {
				task.completed = !task.completed;
				localStorage.setItem('tasks', JSON.stringify(state.tasks));
			}
		},

		// Editar tarea
		updateTask: (state, action) => {
			const { id, ...changes } = action.payload;
			const existingTask = state.tasks.find((task) => task !== null && task.id === id);
			if (existingTask) {
				Object.assign(existingTask, changes);
				localStorage.setItem('tasks', JSON.stringify(state.tasks));
			}
		},

		// Cambiar filtro
		setFilter: (state, action) => {
			state.filter = action.payload;
		},

		// Limpiar tareas inválidas
		cleanTasks: (state) => {
			state.tasks = state.tasks.filter(
				(task) =>
					task !== null &&
					typeof task === 'object' &&
					typeof task.id === 'string' &&
					typeof task.title === 'string'
			);
			localStorage.setItem('tasks', JSON.stringify(state.tasks));
		},
	},
});

// Acciones
export const { addTask, removeTask, toggleTaskStatus, updateTask, setFilter, cleanTasks } = tasksSlice.actions;

// Selectores
export const selectAllTasks = (state) => state.tasks.tasks;
export const selectFilteredTasks = (state) => {
	const tasks = state.tasks.tasks;
	const filter = state.tasks.filter;

	// Filtrar tareas nulas o indefinidas primero
	const validTasks = tasks.filter((task) => task !== null && task !== undefined);

	switch (filter) {
		case 'all':
			return validTasks;
		case 'active':
			return validTasks.filter((task) => !task.completed);
		case 'completed':
			return validTasks.filter((task) => task.completed);
		default:
			return validTasks;
	}
};
export const selectTaskById = (state, taskId) => state.tasks.tasks.find((task) => task !== null && task.id === taskId);
export const selectActiveFilter = (state) => state.tasks.filter;

export default tasksSlice.reducer;
