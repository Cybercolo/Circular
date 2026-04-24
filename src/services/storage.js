export const storageKeys = {
  language: 'circular-language',
  user: 'circular-user',
  accounts: 'circular-accounts',
  guides: 'circular-guides',
  circles: 'circular-circles',
  registrations: 'circular-registrations',
}

export function loadFromStorage(key, fallbackValue) {
  try {
    const storedValue = localStorage.getItem(key)

    if (!storedValue) {
      return fallbackValue
    }

    return JSON.parse(storedValue)
  } catch {
    return fallbackValue
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore localStorage write errors for this MVP.
  }
}
