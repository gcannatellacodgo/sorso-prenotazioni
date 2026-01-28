const bus = new EventTarget();

export function emit(name: string) {
    bus.dispatchEvent(new Event(name));
}

export function on(name: string, handler: () => void) {
    const fn: EventListener = () => handler();
    bus.addEventListener(name, fn);
    return () => bus.removeEventListener(name, fn);
}