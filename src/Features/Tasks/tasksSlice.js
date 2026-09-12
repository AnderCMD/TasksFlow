import { createSlice, createSelector } from '@reduxjs/toolkit';
import { readFromStorage, writeToStorage, removeFromStorage } from '@/Utils/storage';

const STORAGE_KEY = 'tasksflow:tasks';
const LEGACY_STORAGE_KEY = 'tareas';

// Normalizes a due date to noon in the America/Mexico_City timezone (UTC-6),
// so the stored instant renders as the same calendar day regardless of the
// viewer's own timezone.
const adjustToMexicoTimezone = (dateString) => {
	if (!dateString) return null;
	const date = new Date(dateString);
	date.setUTCHours(18, 0, 0, 0); // 18:00 UTC = 12:00 PM Mexico City
	return date.toISOString();
};

const isValidTask = (task) =>
	task !== null && typeof task === 'object' && typeof task.id === 'string' && typeof task.title === 'string';

const persistTasks = (tasks) => writeToStorage(STORAGE_KEY, JSON.stringify(tasks));

// Reads legacy Spanish-shaped tasks (from the pre-rename version of the app)
// and maps them onto the current English field names, so existing users
// don't lose their data on upgrade.
const migrateLegacyTasks = () => {
	const legacyRaw = readFromStorage(LEGACY_STORAGE_KEY);
	if (!legacyRaw) return null;

	try {
		const legacyTasks = JSON.parse(legacyRaw);
		if (!Array.isArray(legacyTasks)) return null;

		const migrated = legacyTasks
			.filter((task) => task !== null && typeof task === 'object' && typeof task.id === 'string')
			.map((task) => ({
				id: task.id,
				title: (task.titulo || '').toString(),
				description: task.descripcion || '',
				completed: Boolean(task.completada),
				priority: task.prioridad || 'medium',
				dueDate: task.fechaVencimiento || null,
				createdAt: task.fechaCreacion || new Date().toISOString(),
			}))
			.filter((task) => task.title.trim().length > 0);

		removeFromStorage(LEGACY_STORAGE_KEY);
		return migrated;
	} catch (error) {
		console.error('Failed to migrate legacy tasks from localStorage:', error);
		return null;
	}
};

const loadTasksFromStorage = () => {
	try {
		const migrated = migrateLegacyTasks();
		if (migrated) {
			persistTasks(migrated);
			return migrated;
		}

		const storedTasks = readFromStorage(STORAGE_KEY);
		if (!storedTasks) return [];

		const parsedTasks = JSON.parse(storedTasks);
		if (!Array.isArray(parsedTasks)) return [];

		const validTasks = parsedTasks.filter(isValidTask);
		if (validTasks.length !== parsedTasks.length) {
			persistTasks(validTasks);
		}
		return validTasks;
	} catch (error) {
		console.error('Failed to load tasks from localStorage:', error);
		removeFromStorage(STORAGE_KEY);
		return [];
	}
};

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
			persistTasks(state.tasks);
		},

		removeTask: (state, action) => {
			state.tasks = state.tasks.filter((task) => task !== null && task.id !== action.payload);
			persistTasks(state.tasks);
		},

		toggleTaskStatus: (state, action) => {
			const task = state.tasks.find((task) => task !== null && task.id === action.payload);
			if (task) {
				task.completed = !task.completed;
				persistTasks(state.tasks);
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
				persistTasks(state.tasks);
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

		// Drops any malformed entries (null, missing id/title) that may have
		// slipped into storage, keeping the in-memory state consistent.
		cleanupTasks: (state) => {
			state.tasks = state.tasks.filter(isValidTask);
			persistTasks(state.tasks);
		},

		// Replaces all tasks wholesale — used by Settings' data import feature.
		replaceAllTasks: (state, action) => {
			const incoming = Array.isArray(action.payload) ? action.payload.filter(isValidTask) : [];
			state.tasks = incoming;
			persistTasks(state.tasks);
		},

		clearAllTasks: (state) => {
			state.tasks = [];
			persistTasks(state.tasks);
		},
	},
});

export const {
	addTask,
	removeTask,
	toggleTaskStatus,
	updateTask,
	setFilter,
	setSearch,
	setSortBy,
	cleanupTasks,
	replaceAllTasks,
	clearAllTasks,
} = tasksSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks?.tasks || [];

export const selectFilteredTasks = createSelector(
	[
		(state) => state.tasks?.tasks || [],
		(state) => state.tasks?.filter || 'all',
		(state) => state.tasks?.search || '',
		(state) => state.tasks?.sortBy || 'createdAt:desc',
	],
	(tasks, filter, search, sortBy) => {
		let filteredTasks = tasks.filter((task) => task !== null && task !== undefined && typeof task === 'object');

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

		if (search.trim()) {
			const searchLower = search.toLowerCase().trim();
			filteredTasks = filteredTasks.filter(
				(task) =>
					task.title.toLowerCase().includes(searchLower) ||
					(task.description || '').toLowerCase().includes(searchLower)
			);
		}

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
				case 'priority': {
					const priorityRank = { high: 3, medium: 2, low: 1 };
					comparison = priorityRank[b.priority] - priorityRank[a.priority];
					break;
				}
			}
			return direction === 'asc' ? -comparison : comparison;
		});
	}
);

export const selectActiveFilter = (state) => state.tasks?.filter || 'all';

export const selectTaskCounts = createSelector([selectAllTasks], (tasks) => {
	const validTasks = (tasks || []).filter((task) => task !== null && task !== undefined);

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
