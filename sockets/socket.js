const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Bon Jovi'));
bands.addBand( new Band('Madonna'));
bands.addBand( new Band('Michael Jackson'));

console.log(bands)

//Mensajes del socket
io.on('connection', client => {
    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('cliente desconectado')
    });

    client.on('mensaje', (payload) =>{
        console.log('mensaje', payload);
        io.emit('mensaje', { admin: "nuevo mensaje"});  
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    /* client.on('emitir-mensaje', (payload) => {
        //io.emit('nuevo-mensaje', payload); //este emite a todos
        client.broadcast.emit('nuevo-mensaje', payload); //este emite a todos menos a el
    }); */
});