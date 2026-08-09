const inFlight = new Map();

export async function submitOnce(key, operation) {
    if (inFlight.has(key)) return inFlight.get(key);
    const pending = Promise.resolve().then(operation).finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
    return pending;
}
