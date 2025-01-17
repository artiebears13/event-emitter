const EventEmitter = require('../EventEmitter');

describe('EventEmitter', () => {
    let emitter;

    beforeEach(() => {
        emitter = new EventEmitter();
    });

    test('subscribe', () => {
        const mockListener = jest.fn();
        emitter.on('testEvent', mockListener);

        const payload = { data: 123 };
        emitter.emit('testEvent', payload);

        expect(mockListener).toHaveBeenCalledWith(payload);
        expect(mockListener).toHaveBeenCalledTimes(1);
    });

    test('several handlers for one event', () => {
        const mockListener1 = jest.fn();
        const mockListener2 = jest.fn();

        emitter.on('multiEvent', mockListener1);
        emitter.on('multiEvent', mockListener2);

        const payload = 'payload';
        emitter.emit('multiEvent', payload);

        expect(mockListener1).toHaveBeenCalledWith(payload);
        expect(mockListener2).toHaveBeenCalledWith(payload);
        expect(mockListener1).toHaveBeenCalledTimes(1);
        expect(mockListener2).toHaveBeenCalledTimes(1);
    });

    test('unsubscribe', () => {
        const mockListener = jest.fn();
        emitter.on('removeEvent', mockListener);
        emitter.emit('removeEvent', 'hello world');

        expect(mockListener).toHaveBeenCalledTimes(1);

        emitter.off('removeEvent', mockListener);
        emitter.emit('removeEvent', 'hello universe');

        expect(mockListener).toHaveBeenCalledTimes(1);
    });

    test('wrong event unsubscribe', () => {
        const mockListener = jest.fn();
        const anotherListener = jest.fn();

        emitter.on('event', mockListener);
        emitter.off('event', anotherListener);
        emitter.emit('event', 'vk internship');

        expect(mockListener).toHaveBeenCalledWith('vk internship');
        expect(mockListener).toHaveBeenCalledTimes(1);
        expect(anotherListener).toHaveBeenCalledTimes(0);
    });

    test('wrong event emit', () => {
        expect(() => {
            emitter.emit('nonExistentEvent', 'vk');
        }).not.toThrow();
        expect(() => {
            emitter.emit(undefined, 'vk');
        }).not.toThrow();
        expect(() => {
            emitter.emit(null, 'vk');
        }).not.toThrow();
    });

    test('wrong types', () => {
        expect(() => {
            emitter.on(123, () => {});
        }).toThrow(TypeError);

        expect(() => {
            emitter.on('event', 'function');
        }).toThrow(TypeError);

        expect(() => {
            emitter.on('event', undefined);
        }).not.toThrow(TypeError);

        expect(() => {
            emitter.on('event', null);
        }).not.toThrow(TypeError);

        expect(() => {
            emitter.emit(456);
        }).toThrow(TypeError);

        expect(() => {
            emitter.off('event', 'function');
        }).toThrow(TypeError);

    });

    test('auto delete event', () => {
        const mockListener = jest.fn();
        emitter.on('tempEvent', mockListener);
        emitter.emit('tempEvent');
        expect(emitter.events['tempEvent']).toBeDefined();

        emitter.off('tempEvent', mockListener);
        expect(emitter.events['tempEvent']).toBeUndefined();
    });

    test('callback order', () => {
        const callOrder = [];
        const listener1 = () => callOrder.push('listener1');
        const listener2 = () => callOrder.push('listener2');
        const listener3 = () => callOrder.push('listener3');

        emitter.on('orderEvent', listener1);
        emitter.on('orderEvent', listener2);
        emitter.on('orderEvent', listener3);

        emitter.emit('orderEvent');

        expect(callOrder).toEqual(['listener1', 'listener2', 'listener3']);
    });

    test('change while emit', () => {
        const mockListener1 = jest.fn(() => {
            emitter.off('dynamicEvent', mockListener2);
        });
        const mockListener2 = jest.fn();
        emitter.on('dynamicEvent', mockListener1);
        emitter.on('dynamicEvent', mockListener2);

        emitter.emit('dynamicEvent');

        expect(mockListener1).toHaveBeenCalledTimes(1);
        expect(mockListener2).toHaveBeenCalledTimes(1);

        emitter.emit('dynamicEvent');
        expect(mockListener1).toHaveBeenCalledTimes(2);
        expect(mockListener2).toHaveBeenCalledTimes(1);
    });
});
