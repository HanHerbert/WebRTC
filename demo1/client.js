function onRequest(io, socket) {
    return function (data) {

        data.userId = socket.user.id;

        socket.to('User:' + data.targetId).emit('callRequest', data);

    };
}


var callAccept = function (targetId) {
            var isSupported = setupRTC(targetId);

            if (isSupported) {
                enableSelfVideo(function () {
                    $rootScope.io.emit('callRequest', {
                        type: 'video',
                        targetId: targetId
                    });
                });
            } else {
                $rootScope.io.emit('callDecline', {
targetId: targetId,
reason: 'some reason'
});
            }
        }


        function onAccept(io, socket) {
            return function (data) {
        
                data.userId = socket.user.id;
        
                socket.to('User:' + data.targetId).emit('callAccept', data);
        
            };
        }