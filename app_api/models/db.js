const mongoose = require('mongoose');
require('./customers');
require('./products');

let dbURI = 'mongodb://localhost/aqis';
if(process.env.NODE_ENV === 'production') {
    dbURI = 'mongodb+srv://accsight:K%40stx8909@cluster0.hvixj0e.mongodb.net/aqisv3';
}
mongoose.connect(dbURI, {useNewUrlParser: true});

mongoose.connection.on('connected', ()=>{
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', ()=>{
    console.log('Mongoose disconnected');
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(()=>{
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

process.once('SIGUSR2', ()=>{
    gracefulShutdown('nodemon restart', ()=>{
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', ()=>{
    gracefulShutdown('app termination', ()=>{
        process.exit(0);
    });
});

process.on('SIGTERM', ()=>{
    gracefulShutdown('Heroku app shutdown', ()=>{
        process.exit(0);
    });
});
