var GestureWorks = function(url) {
    //initialize websocket connection, callbacks, and related variables.
    var gwInst = this;
    var ws;
    var _isConnected = false;
    var dataQueue = new Queue();

    function consumeCommands(obj) {
        if (obj.type === GestureWorks.CommandTypes.CONSUME_POINT_EVENTS) {
            gwInst.onConsumePointEvents(obj.points);
        } else if (obj.type === GestureWorks.CommandTypes.CONSUME_GESTURE_EVENTS) {
            gwInst.onConsumeGestureEvents(obj.gestures);
        } else if (obj.type === GestureWorks.CommandTypes.MULTI) {
            for (var i=0;i<obj.commands.length;i++) {
                consumeCommands(obj.commands[i]);
            }
        }
    }

    /**
     * Creates a formatted command for a series of commands in one command
     * @param {Array} args array of commands to be sent. 
     * @returns {Object} Command object formatted for the server. 
     */
    function multiCommand(args) {
        return {
            type: GestureWorks.CommandTypes.MULTI,
            commands: args
        };
    };

    /**
     * Creates a formatted command that represents calls to process frame, consume points, then consume gestures.
     * @returns {Object} Command object formatted for the server. 
     */
    function updateCommand() {
        return {
            type: GestureWorks.CommandTypes.UPDATE
        }
    }

    /**
     * Handler for opening the socket. Calls the onSocketOpen callback.
     * @param {Object} ev 
     * @returns {} 
     */
    var _onSocketOpen = function (ev) {
        _isConnected = true;
        gwInst.onSocketOpen(ev);
        window.requestAnimationFrame(_update);
    };

    /**
     * Handler for recieving data from the server. This function is responsible for triggering onConsumePointEvents and onConsumeGestureEvents, as well as emptying the message queue.
     * @param {Object} ev 
     * @returns {} nothing.
     */
    var _onSocketMessage = function(ev) {
        var obj = JSON.parse(ev.data);
        gwInst.onSocketMessage(ev);
        consumeCommands(obj);
    };

    /**
     * Handler for recieving errors from the websocket. This triggers the onSocketError event.
     * @param {} ev 
     * @returns {} 
     */
    var _onSocketError = function (ev) {
        gwInst.disconnect();
        gwInst.onSocketError(ev);
    };

    /**
     * Handler for closing the websocket. Triggers the onSocketClose event.
     * @param {} ev 
     * @returns {} 
     */
    var _onSocketClose = function (ev) {
        _isConnected = false;
        ws = null;
        gwInst.onSocketClose(ev);
    };

    /**
     * internal update function attempts to send any queued commands through the websocket connection.
     * @returns {} 
     */
    var _update = function() {
        if (!_isConnected) { return; }

        if (ws.readyState === 1) {
            var cmds = [];
            while (!dataQueue.isEmpty()) {
                cmds.push(dataQueue.dequeue());
            }

            if (cmds.length > 0) {
                cmds.push(updateCommand());
                ws.send(
                    JSON.stringify(multiCommand(cmds))
                );
            }
            else {
                ws.send(JSON.stringify(updateCommand()));
            }
            
        }

        window.requestAnimationFrame(_update);
    }

    /**
     * Queues a command to be queueCommand over the websocket.
     * @param {Object} command to be sent. Should corrispond to one of the API calls.
     * @returns {bool} true if the command was queueCommand, false otherwise. 
     */
    this.queueCommand = function(command) {
        dataQueue.enqueue(command);
    };

    /**
     * Attempts to connect to the websocket server.
     * @returns {} 
     */
    this.connect = function () {
       if (!_isConnected) {
           if (ws != null) {
               console.log("connection pending.");
           } else {
               ws = new WebSocket(url);
               ws.onopen = _onSocketOpen;
               ws.onclose = _onSocketClose;
               ws.onerror = _onSocketError;
               ws.onmessage = _onSocketMessage;
           }
       } else {
           console.log("already connected.");
       }
    };

    /**
     * Disconnects the websocket server if it is connected.
     * @returns {} 
     */
    this.disconnect = function() {
        if (_isConnected && ws != null) {
            _isConnected = false;
            ws.onopen = null;
            ws.onclose = null;
            ws.onerror = null;
            ws.onmessage = null;
            ws.close();
            ws = null;
        }
    };

    /**
    * Returns the state of the GestureWorks websocket connection.
    * @returns {bool} true if this comms instance is connected to a websocket 
    */
    this.IsConnected = function () {
        return _isConnected;
    };

    /**
     * Returns the state of the queue
     * @returns {bool} true if there is a queue of commands waiting to be sent to the server. 
     */
    this.HasQueue = function () {
        return !dataQueue.isEmpty();
    };

    /**
     * Returns the number of items waiting to be sent.
     * @returns {number} number of items that need to be sent.
     */
    this.GetQueueLength = function () {
        return dataQueue.getLength();
    };

    /**
     * Getter for the data queue.
     * @returns {Object} returns the instance of Queue used by this comms instance. 
     */
    this.GetDataQueue = function () {
        return dataQueue;
    }

    /**
     * Callback function for user applications to be notified of the socket opening.
     * @param {} ev 
     * @returns {} 
     */
    this.onSocketOpen = function (ev) { };

    /**
     * Callback function for user applications to be notified of the socket recieving a message.
     * @param {} ev 
     * @returns {} 
     */
    this.onSocketMessage = function (ev) { };

    /**
     * Callback function for user applications to be notified of the socket having an error.
     * @param {} ev 
     * @returns {} 
     */
    this.onSocketError = function (ev) { };

    /**
     * Callback function for user applications to be notified of the socket closing.
     * @param {} ev 
     * @returns {} 
     */
    this.onSocketClose = function (ev) { };

    /**
     * Callback function for user applications to recieve current point events.
     * @param {} points 
     * @returns {} 
     */
    this.onConsumePointEvents = function (points) { };

    /**
     * Callback function for user applications to recieve gesture events.
     * @param {} gestures 
     * @returns {} 
     */
    this.onConsumeGestureEvents = function (gestures) { };

    /**
     * creates and queues a formatted object to register a touch object with GestureWorks.
     * @param {string} touchObjectName unique name for this touch object.
     * @returns {}  
     */
    this.registerTouchObject = function(touchObjectName) {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.REGISTER_TOUCH_OBJECT,
            touchObjectName: touchObjectName
        });
    };

    /**
     * creates and queues a formatted object to de-register a touch object from GestureWorks.
     * @param {} touchObjectName 
     * @returns {}   
     */
    this.deregisterTouchObject = function(touchObjectName) {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.DEREGISTER_TOUCH_OBJECT,
            touchObjectName: touchObjectName
        });
    };

    /**
     * creates and queues a formatted object to add a gesture to a registered touch object.
     * @param {string} touchObjectName 
     * @param {string} gestureName 
     * @returns {}   
     */
    this.addGesture = function(touchObjectName, gestureName) {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.ADD_GESTURE,
            touchObjectName: touchObjectName,
            gestureName: gestureName
        });
    };

    /**
     * Creates and queues a formatted object representing a remove gesture command.
     * @param {string} touchObjectName 
     * @param {string} gestureName 
     * @returns {}   
     */
    this.removeGesture = function(touchObjectName, gestureName) {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.REMOVE_GESTURE,
            touchObjectName: touchObjectName,
            gestureName: gestureName
        });
    };

    /**
     * creates and queues a formatted object representing an enable gesture command.
     * @param {string} touchObjectName 
     * @param {string} gestureName 
     * @returns {}  
     */
    this.enableGesture = function(touchObjectName, gestureName) {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.ENABLE_GESTURE,
            touchObjectName: touchObjectName,
            gestureName: gestureName
        });
    };

    /**
     * creates and queues a formatted object representing a disable gesture command
     * @param {string} touchObjectName 
     * @param {string} gestureName 
     * @returns {}  
     */
    this.disableGesture = function(touchObjectName, gestureName) {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.DISABLE_GESTURE,
            touchObjectName: touchObjectName,
            gestureName: gestureName
        });
    };

    /**
     * Creates and queues a formatted object representing a resize screen command
     * @param {int} screenWidth 
     * @param {int} screenHeight 
     * @returns {} 
     */
    this.resizeScreen = function(screenWidth, screenHeight) {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.RESIZE_SCREEN,
            screenWidth: screenWidth,
            screenHeight: screenHeight
        });
    };

    /**
     * Creates and queues a formatted object for adding a touch point to an object
     * @param {string} touchObjectName 
     * @param {int} pointId 
     * @returns {} 
     */
    this.addTouchPoint = function(touchObjectName, pointId) {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.ADD_TOUCH_POINT,
            touchObjectName: touchObjectName,
            pointID: pointId
        });
    };

    /**
     * Creates and queues a formatted object representing a touch point.
     * Note: This function differs from the C++ API call in that there is no TouchPoint structure defined for JS, so pertanent fields have been used as function parameters.
     * @param {int} pointId the unique id of the touch point
     * @param {number} x the x position of the touch point
     * @param {number} y the y position of the touch point
     * @param {string} touchStatus the state of the touch point (TOUCHUPDATE,TOUCHADDED,TOUCHREMOVED)
     * @param {int} [timeStamp] the timestamp of the touch point, if not present the value will be set automatically
     * @param {number} [w] the width of the touch point
     * @param {number} [h] the height of the touch point
     * @param {number} [p] the pressure exerted by the touch point
     * @returns {} 
     */
    this.addEvent = function (pointId, x, y, touchStatus, timeStamp, w, h) {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.ADD_EVENT,
            point: {
                TouchEventID: pointId,
                Status: touchStatus,
                Timestamp: timeStamp ? timeStamp : new Date().getTime(),
                X: x,
                Y: y,
                W: w ? w : 0,
                H: h ? h : 0
            }
        });
    };

    /**
     * Queues an update command.
     * @returns {} 
     */
    this.forceUpdate = function() {
        gwInst.queueCommand({
            type: GestureWorks.CommandTypes.UPDATE
        });
    };
};

/**
 * Represents the various states a touch point can be in.
 */
GestureWorks.TouchStatus = {
    TOUCH_UPDATE: 0,
    TOUCH_ADDED: 1,
    TOUCH_REMOVED: 2
};

/**
 * Represents various API calls to the server. the contained int values correlate to the GwCommand enum on the C# server side.
 */
GestureWorks.CommandTypes = {
    REGISTER_TOUCH_OBJECT: 0,
    DEREGISTER_TOUCH_OBJECT: 1,
    ADD_GESTURE: 2,
    REMOVE_GESTURE: 3,
    ENABLE_GESTURE: 4,
    DISABLE_GESTURE: 5,
    RESIZE_SCREEN: 6,
    ADD_TOUCH_POINT: 7,
    ADD_EVENT: 8,
    CONSUME_POINT_EVENTS: 9,
    CONSUME_GESTURE_EVENTS: 10,
    MULTI: 11,
    UPDATE: 12
};