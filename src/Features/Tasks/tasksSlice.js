import { createSlice, createSelector } from '@reduxjs/toolkit';

// Función auxiliar para ajustar la fecha a la zona horaria de México
const adjustToMexicoTimezone = (dateString) => {
	if (!dateString) return null;
	const date = new Date(dateString);
	// Ajustamos la fecha a mediodía en la zona horaria de México (UTC-6)
	date.setUTCHours(18, 0, 0, 0); // 18 UTC = 12 PM Mexico
	return date.toISOString();
};

// Recuperar tareas del localStorage si existen
const loadTasksFromStorage = () => {
	try {
		// Obtener las tareas del localStorage
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
	filter: 'all',
	search: '',
	sortBy: 'createdAt:desc',
	status: 'idle',
	error: null,
};

export const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		addTask: (state, action) => {
			if (!action.payload?.title?.trim()) {
				return;
			}

			state.tasks.push({
				...action.payload,
				title: action.payload.title.trim(),
				description: action.payload.description?.trim() || '',
				completed: action.payload.completed || false,
				priority: action.payload.priority || 'medium',
				dueDate: adjustToMexicoTimezone(action.payload.dueDate),
				createdAt: new Date().toISOString(),
			});
			localStorage.setItem('tasks', JSON.stringify(state.tasks));
		},

		removeTask: (state, action) => {
			state.tasks = state.tasks.filter((task) => task !== null && task.id !== action.payload);
			localStorage.setItem('tasks', JSON.stringify(state.tasks));
		},

		toggleTaskStatus: (state, action) => {
			const task = state.tasks.find((task) => task !== null && task.id === action.payload);
			if (task) {
				task.completed = !task.completed;
				localStorage.setItem('tasks', JSON.stringify(state.tasks));
			}
		},

		updateTask: (state, action) => {
			const { id, ...changes } = action.payload;
			if (!id || !changes.title?.trim()) {
				return;
			}

			const existingTask = state.tasks.find((task) => task?.id === id);
			if (existingTask) {
				Object.assign(existingTask, {
					...existingTask,
					...changes,
					title: changes.title.trim(),
					description: changes.description?.trim() || existingTask.description,
					priority: changes.priority || existingTask.priority,
					dueDate: adjustToMexicoTimezone(changes.dueDate),
				});
				localStorage.setItem('tasks', JSON.stringify(state.tasks));
			}
		},

		setFilter: (state, action) => {
			state.filter = action.payload;
		},

		setSearch: (state, action) => {
			state.search = action.payload;
		},

		setSortBy: (state, action) => {
			state.sortBy = action.payload;
		},

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
export const { 
    addTask, 
    removeTask, 
    toggleTaskStatus, 
    updateTask, 
    setFilter, 
    setSearch,
    setSortBy,
    cleanTasks 
} = tasksSlice.actions;

// Selectores
export const selectAllTasks = (state) => state.tasks?.tasks || [];

// Selector optimizado para rendimiento
export const selectFilteredTasks = createSelector(
	[
		(state) => state.tasks?.tasks || [],
		(state) => state.tasks?.filter || 'all',
		(state) => state.tasks?.search || '',
		(state) => state.tasks?.sortBy || 'createdAt:desc',
	],
	(tasks, filter, search, sortBy) => {
		let filteredTasks = tasks.filter((task) => task !== null && task !== undefined && typeof task === 'object');

		// Aplicar filtro por estado/prioridad
		switch (filter) {
			case 'active':
				filteredTasks = filteredTasks.filter((task) => !task.completed);
				break;
			case 'completed':
				filteredTasks = filteredTasks.filter((task) => task.completed);
				break;
			case 'high':
			case 'medium':
			case 'low':
				filteredTasks = filteredTasks.filter((task) => task.priority === filter);
				break;
		}

		// Aplicar búsqueda
		if (search.trim()) {
			const searchLower = search.toLowerCase().trim();
			filteredTasks = filteredTasks.filter(
				(task) =>
					task.title.toLowerCase().includes(searchLower) ||
					(task.description || '').toLowerCase().includes(searchLower)
			);
		}

		// Aplicar ordenamiento
		const [field, direction] = sortBy.split(':');
		return [...filteredTasks].sort((a, b) => {
			let comparison = 0;
			switch (field) {
				case 'createdAt':
					comparison = new Date(b.createdAt) - new Date(a.createdAt);
					break;
				case 'dueDate':
					comparison = new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999');
					break;
				case 'priority':
					const priorityOrder = { high: 3, medium: 2, low: 1 };
					comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
					break;
			}
			return direction === 'asc' ? -comparison : comparison;
		});
	}
);

export const selectActiveFilter = (state) => state.tasks?.filter || 'all';

// Contador de tareas por filtro para mostrar badges
export const selectTaskCounts = createSelector([selectAllTasks], (tasks) => {
	// Aseguramos que tasks sea un array incluso si viene undefined
	const tasksArray = tasks || [];
	const validTasks = tasksArray.filter((task) => task !== null && task !== undefined);

	return {
		all: validTasks.length,
		active: validTasks.filter((task) => !task.completed).length,
		completed: validTasks.filter((task) => task.completed).length,
		high: validTasks.filter((task) => task.priority === 'high').length,
		medium: validTasks.filter((task) => task.priority === 'medium').length,
		low: validTasks.filter((task) => task.priority === 'low').length,
	};
});

export const selectTaskById = (state, taskId) => {
	const tasks = state.tasks?.tasks || [];
	return tasks.find((task) => task !== null && task.id === taskId);
};

export default tasksSlice.reducer;
