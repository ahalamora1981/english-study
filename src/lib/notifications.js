/**
 * Simple pub/sub notification system for cross-component events.
 * Currently used for localStorage quota warnings.
 */
const listeners = {};

export function on(event, fn) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
  return () => {
    listeners[event] = listeners[event].filter(f => f !== fn);
  };
}

export function emit(event, data) {
  if (!listeners[event]) return;
  for (const fn of listeners[event]) {
    fn(data);
  }
}
