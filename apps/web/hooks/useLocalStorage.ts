"use client";

export const useLocalStorage = () => {
	const setLocalStorage = (key: string, value: string | object) => {
		const parsedValue = typeof value === "string" ? value : JSON.stringify(value);
		const data = JSON.stringify({ data: parsedValue });
		localStorage.setItem(key, data);
	};

	const getLocalStorage = (key: string) => {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data).data : null;
	};

	const removeLocalStorage = (key: string) => {
		localStorage.removeItem(key);
	};

	const hasLocalStorage = (key: string) => {
		return localStorage.getItem(key) !== null;
	};

	return {
		set: setLocalStorage,
		get: getLocalStorage,
		has: hasLocalStorage,
		clear: removeLocalStorage,
	};
};
