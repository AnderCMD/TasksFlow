import { beforeEach, describe, expect, it, vi } from 'vitest';
import themeReducer, { toggleTheme, setTheme } from '@/Features/Theme/themeSlice';

beforeEach(() => {
	localStorage.clear();
	document.documentElement.classList.remove('dark');
	window.matchMedia =
		window.matchMedia ||
		vi.fn().mockImplementation(() => ({
			matches: false,
			addEventListener: () => {},
			removeEventListener: () => {},
		}));
});

describe('themeSlice reducer', () => {
	it('toggles between light and dark', () => {
		const state = themeReducer({ mode: 'light' }, toggleTheme());
		expect(state.mode).toBe('dark');
	});

	it('sets an explicit theme and applies the dark class to <html>', () => {
		const state = themeReducer({ mode: 'light' }, setTheme('dark'));
		expect(state.mode).toBe('dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	it('persists the theme choice to localStorage under the namespaced key', () => {
		themeReducer({ mode: 'light' }, setTheme('dark'));
		expect(localStorage.getItem('tasksflow:theme')).toBe('dark');
	});
});
