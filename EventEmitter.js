class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * @param {string} eventName
     * @param {Function} listener - callback
     */
    on(eventName, listener) {
        if (typeof eventName !== 'string') {
            throw new TypeError('eventName must be a string');
        }
        if (typeof listener !== 'function') {
            if (listener === undefined || listener === null) {return}
            throw new TypeError('listener must be a function');
        }

        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    /**
     * @param {string} eventName
     * @param  {...any} args
     */
    emit(eventName, ...args) {
        if (typeof eventName !== 'string') {
            if (eventName === undefined || eventName === null) {return}
            throw new TypeError('eventName must be a string');
        }

        if (!this.events[eventName]) {
            return;
        }
        const listeners = [...this.events[eventName]];
        listeners.forEach(listener => {
            listener(...args);
        });
    }

    /**
     * @param {string} eventName
     * @param {Function} listener - callback
     */
    off(eventName, listener) {
        if (typeof eventName !== 'string') {
            throw new TypeError('eventName must be a string');
        }
        if (typeof listener !== 'function') {
            if (listener === undefined || listener === null) {return}
            throw new TypeError('listener must be a function');
        }

        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName] = this.events[eventName].filter(
            registeredListener => registeredListener !== listener
        );
        if (this.events[eventName].length === 0) {
            delete this.events[eventName];
        }
    }
}

module.exports = EventEmitter;
