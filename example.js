const EventEmitter = require('./EventEmitter');

const emitter = new EventEmitter();

// Подписка
const logData = (data) => console.log(data);
emitter.on('data', logData);

// Испускание события
emitter.emit('data', { message: 'Hello, world!' });

// Удаление конкретного обработчика
emitter.off('data', logData);
