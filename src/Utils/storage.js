// Thin wrapper around localStorage that never throws, so a full/disabled
// storage (quota exceeded, private browsing, browser lockdown) degrades
// gracefully instead of crashing a Redux reducer.

export const readFromStorage = (key) => {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.error(`Failed to read "${key}" from localStorage:`, error);
		return null;
	}
};

export const writeToStorage = (key, value) => {
	try {
		localStorage.setItem(key, value);
		return true;
	} catch (error) {
		console.error(`Failed to write "${key}" to localStorage:`, error);
		return false;
	}
};

export const removeFromStorage = (key) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Failed to remove "${key}" from localStorage:`, error);
	}
};
