const buildSocketFunctions = function buildSocketFunctions(io,bidDataApi){
   
    io.on('connection', function(socket) {
        console.log('A user connected');

        socket.on("bidEvent",async function(data) {
            var resdata = await bidDataApi.addNewBid(data.id,data.price,data.user_id);
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