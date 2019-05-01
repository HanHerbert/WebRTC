//invalid js， NO USE
function setupRTC(targetId) {

    var isSupported = false;

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    window.PeerConnection = window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;

    window.IceCandidate = window.RTCIceCandidate ||
        window.mozRTCIceCandidate ||
        window.webkitRTCIceCandidate;

    window.SessionDescription = window.RTCSessionDescription ||
        window.mozRTCSessionDescription ||
        window.webkitRTCSessionDescription;

    isSupported = navigator.getUserMedia && window.PeerConnection && window.SessionDescription;

    if (isSupported) {
        var configuration = {
            "iceServers": [
                {url: 'stun server url'},
                {
                    url: 'turn server url',
                    username: 'turn server username',
                    credential: 'turn server key'
                }
            ]
        };
        //save Peer connection object to angular $rootScope to global access.
        $rootScope.pc = new PeerConnection(configuration);


        //add events handlers
        $rootScope.pc.onicecandidate = function (e) {
            if (e.candidate) {
                $rootScope.io.emit('rtc', {
                    targetId: targetId,
                    type: 'candidate',
                    label: e.candidate.sdpMLineIndex,
                    id: e.candidate.sdpMid,
                    candidate: e.candidate.candidate
                });
            }
        };

        $rootScope.pc.onaddstream = function (e) {
            // here should be code for processing successful connection
            // for example save stream url to variable and insert it to HTML5 video player

            $rootScope.stream = e.stream
        };

        $rootScope.pc.oniceconnectionstatechange = function () {
            //if interrupted connection
            if ($rootScope.pc && $rootScope.pc.iceConnectionState == 'disconnected') {
                console.log('peer connection interrupted');
                // here should be code for handler of interrupted connection
                // for example hide video player
            }
        };
    }

    return isSupported;
}



startCall = function (targetId) {

    var isSupported = setupRTC(targetId);

    if (isSupported) {
        enableSelfVideo(function () {
            $rootScope.io.emit('callRequest', {
                type: 'video',
                targetId: targetId
            });
        });
    } else {
        alert('UserMedia or WebRTC is not supported');
    }
};

function enableSelfVideo(callback) {

        navigator.getUserMedia({audio: true, video: true}, function (stream) {

            $rootScope.pc.addStream(stream);
            callback();
            
        }, function (err) {
            alert(err)
        });
    }
