// Simple state management store
let state = {
  employee: [],
  editingId: null
};

// Get the entire state or a specific property
export function getState(key = null) {
  return key ? state[key] : state;
}

// Update state with new values
export function setState(updates) {
  state = { ...state, ...updates };
}