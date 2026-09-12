import { beforeEach, describe, expect, it } from 'vitest';
import tasksReducer, {
	addTask,
	removeTask,
	toggleTaskStatus,
	updateTask,
	setFilter,
	setSearch,
	clearAllTasks,
	selectFilteredTasks,
	selectTaskCounts,
} from '@/Features/Tasks/tasksSlice';

const baseTask = { id: '1', title: 'Buy milk', priority: 'high' };

describe('tasksSlice reducer', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('returns the initial state with no tasks', () => {
		const state = tasksReducer(undefined, { type: 'unknown' });
		expect(state.tasks).toEqual([]);
		expect(state.filter).toBe('all');
	});

	it('adds a task with trimmed title and default fields', () => {
		const state = tasksReducer(undefined, addTask({ ...baseTask, title: '  Buy milk  ' }));
		expect(state.tasks).toHaveLength(1);
		expect(state.tasks[0].title).toBe('Buy milk');
		expect(state.tasks[0].completed).toBe(false);
		expect(state.tasks[0].priority).toBe('high');
	});

	it('ignores adding a task with an empty title', () => {
		const state = tasksReducer(undefined, addTask({ id: '1', title: '   ' }));
		expect(state.tasks).toHaveLength(0);
	});

	it('removes a task by id', () => {
		let state = tasksReducer(undefined, addTask(baseTask));
		state = tasksReducer(state, removeTask('1'));
		expect(state.tasks).toHaveLength(0);
	});

	it('toggles a task completion status', () => {
		let state = tasksReducer(undefined, addTask(baseTask));
		state = tasksReducer(state, toggleTaskStatus('1'));
		expect(state.tasks[0].completed).toBe(true);
		state = tasksReducer(state, toggleTaskStatus('1'));
		expect(state.tasks[0].completed).toBe(false);
	});

	it('updates an existing task', () => {
		let state = tasksReducer(undefined, addTask(baseTask));
		state = tasksReducer(state, updateTask({ id: '1', title: 'Buy oat milk', priority: 'low' }));
		expect(state.tasks[0].title).toBe('Buy oat milk');
		expect(state.tasks[0].priority).toBe('low');
	});

	it('clears all tasks', () => {
		let state = tasksReducer(undefined, addTask(baseTask));
		state = tasksReducer(state, clearAllTasks());
		expect(state.tasks).toHaveLength(0);
	});

	it('persists tasks to localStorage under the namespaced key', () => {
		tasksReducer(undefined, addTask(baseTask));
		expect(localStorage.getItem('tasksflow:tasks')).toContain('Buy milk');
	});
});

describe('tasksSlice selectors', () => {
	const state = {
		tasks: {
			tasks: [
				{ id: '1', title: 'Alpha', completed: false, priority: 'high', createdAt: '2024-01-01T00:00:00Z' },
				{ id: '2', title: 'Beta', completed: true, priority: 'low', createdAt: '2024-01-02T00:00:00Z' },
			],
			filter: 'all',
			search: '',
			sortBy: 'createdAt:desc',
		},
	};

	it('selectTaskCounts tallies tasks by status and priority', () => {
		const counts = selectTaskCounts(state);
		expect(counts).toEqual({ all: 2, active: 1, completed: 1, high: 1, medium: 0, low: 1 });
	});

	it('selectFilteredTasks applies the active filter', () => {
		const filteredState = { tasks: { ...state.tasks, filter: 'completed' } };
		const result = selectFilteredTasks(filteredState);
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('2');
	});

	it('selectFilteredTasks applies search across title', () => {
		const searchState = { tasks: { ...state.tasks, search: 'alp' } };
		const result = selectFilteredTasks(searchState);
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('1');
	});
});

describe('setFilter / setSearch reducers', () => {
	it('update filter and search state', () => {
		let state = tasksReducer(undefined, setFilter('active'));
		expect(state.filter).toBe('active');
		state = tasksReducer(state, setSearch('milk'));
		expect(state.search).toBe('milk');
	});
});
