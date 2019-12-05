const buildSocketFunctions = function buildSocketFunctions(io,bidDataApi){
   
    io.on('connection', function(socket) {
        console.log('A user connected');

        socket.on("bidEvent",async function(data) {
            var resdata = await bidDataApi.updateBidPrice(data.id,data.price);
             console.log(resdata);
            io.sockets.emit('broadcast',resdata);
            console.log("sent");
        });
        
        socket.on('disconnect', function () {
           console.log('A user disconnected');
        });

      });
}



module.exports = { buildSocketFunctions};