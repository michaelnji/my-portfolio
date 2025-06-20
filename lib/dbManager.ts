/**
 * LocalStorage wrapper with type safety and error handling
 * @template T - Type of the value to be stored/retrieved
 */
export class LocalStorageError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'LocalStorageError';
	}
}

/**
 * Checks if localStorage is available and functioning in the current environment.
 * Caches the result for better performance.
 */
let isLocalStorageAvailableCache: boolean | null = null;

function isLocalStorageAvailable(): boolean {
	if (isLocalStorageAvailableCache !== null) {
		return isLocalStorageAvailableCache;
	}

	try {
		const testKey = "__ls_test__";
		localStorage.setItem(testKey, testKey);
		localStorage.removeItem(testKey);
		isLocalStorageAvailableCache = true;
	} catch {
		isLocalStorageAvailableCache = false;
	}

	return isLocalStorageAvailableCache;
}

/**
 * Wrapper function for localStorage operations with error handling
 */
function withLocalStorage<T>(operation: () => T): T {
	if (!isLocalStorageAvailable()) {
		throw new LocalStorageError('Local storage not available');
	}
	return operation();
}

/**
 * Retrieves an item from localStorage by key or sets it if it doesn't exist.
 * 
 * @template T - Type of the value to be stored/retrieved
 * @param key - The key to retrieve or set in localStorage
 * @param value - The value to set if the key does not exist
 * @returns The parsed value from localStorage if the key exists, otherwise the provided value
 * @throws {LocalStorageError} If localStorage is not available
 */
export function getOrSetItem<T>(key: string, value: T): T {
	return withLocalStorage(() => {
		if (!key) {
			throw new LocalStorageError('Key cannot be null or empty');
		}

		const item = localStorage.getItem(key);
		if (item === null) {
			localStorage.setItem(key, JSON.stringify(value));
			return value;
		}
		return JSON.parse(item) as T;
	});
}

/**
 * Retrieves the value associated with the specified key from localStorage.
 * 
 * @template T - Type of the value to be retrieved
 * @param key - The key of the item to retrieve
 * @returns The parsed value if the key exists, or null otherwise
 * @throws {LocalStorageError} If localStorage is not available
 */
export function getItemValue<T>(key: string): T | null {
	return withLocalStorage(() => {
		if (!key) {
			throw new LocalStorageError('Key cannot be null or empty');
		}
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) as T : null;
	});
}

/**
 * Stores a value in localStorage under the specified key.
 * 
 * @template T - Type of the value to be stored
 * @param key - The key under which the value will be stored
 * @param value - The value to store
 * @returns The stored value
 * @throws {LocalStorageError} If localStorage is not available or key is invalid
 */
export function setItemValue<T>(key: string, value: T): T {
	return withLocalStorage(() => {
		if (!key) {
			throw new LocalStorageError('Key cannot be null or empty');
		}
		localStorage.setItem(key, JSON.stringify(value));
		return value;
	});
}

/**
 * Stores multiple items in localStorage in a single operation.
 * 
 * @param items - Record of key-value pairs to store
 * @throws {LocalStorageError} If localStorage is not available
 */
export function setMultipleItems(items: Record<string, unknown>): void {
	withLocalStorage(() => {
		for (const [key, value] of Object.entries(items)) {
			if (!key) {
				throw new LocalStorageError('Key cannot be null or empty');
			}
			localStorage.setItem(key, JSON.stringify(value));
		}
	});
}

/**
 * Clears all data from the local storage.
 * 
 * @throws {LocalStorageError} If localStorage is not available
 */
export function clearDB(): void {
	withLocalStorage(() => {
		localStorage.clear();
	});
}

/**
 * Gets the total size of data stored in localStorage in bytes
 * 
 * @returns The total size in bytes
 * @throws {LocalStorageError} If localStorage is not available
 */
export function getStorageSize(): number {
	return withLocalStorage(() => {
		let total = 0;
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key) {
				const value = localStorage.getItem(key);
				if (value) {
					total += key.length + value.length;
				}
			}
		}
		return total;
	});
}

/**
 * Checks if adding a new item would exceed localStorage quota
 * 
 * @param key - The key to check
 * @param value - The value to check
 * @returns True if the item can be stored without exceeding quota
 * @throws {LocalStorageError} If localStorage is not available
 */
export function canStoreItem(key: string, value: unknown): boolean {
	return withLocalStorage(() => {
		const currentSize = getStorageSize();
		const newItemSize = key.length + JSON.stringify(value).length;
		return currentSize + newItemSize < 5 * 1024 * 1024; // 5MB limit
	});
}