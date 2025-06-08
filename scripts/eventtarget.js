
export class EventTarget {
    constructor() {
        this.listeners = {};
    }

    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }

        this.listeners[eventName].push(callback);
    }

    emit(eventName, data) {
        if (this.listeners[eventName]) {
            for (const cb of this.listeners[eventName]) {
                cb(data);
            }
        }
    }
}