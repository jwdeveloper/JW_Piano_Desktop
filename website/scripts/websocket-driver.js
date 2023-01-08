class PianoSocket {

  constructor() {
    this.connection = null
    this.token = null
    this.buffer = new ArrayBuffer(23);
    this.view = new DataView(this.buffer, 0);
    this.statusHandler = "disconnected";

    //window.requestAnimationFrame(this);
  }
  setToken(token) {
    try
    {
      var decoded = atob(token);
      console.log(decoded)
      var payload = JSON.parse(decoded)
      this.url = "ws://" + payload.serverIP + ":" + payload.port;
      this.aKey = BigInt(payload.a);
      this.bKey = BigInt(payload.b);
      this.pluginVersion = payload.pluginVersion;


      if(this.pluginVersion == undefined)
      {
        this.pluginVersion = "1.0.0"
      }



      if(this.pluginVersion == "1.0.0")
      {
        this.buffer = new ArrayBuffer(23);
        this.view = new DataView(this.buffer, 0);
      }
      if(this.pluginVersion != "1.0.0")
      {
        this.buffer = new ArrayBuffer(24);
        this.view = new DataView(this.buffer, 0);
      }

      console.log("Plugin Version",this.pluginVersion)
      return true;
    }
    catch(e)
    {
      return false;
    }
  }

  setStatusHandler(handler)
  {
    this.statusHandler = handler;
  }

  connect() {

    if (this.connection != null) {
      this.connection.close()
    }

    this.connection = new WebSocket(this.url);
    this.connection.onopen = function (e) {
      console.log("[open] websocket");
      this.statusHandler = "connected"
      console.log(this.statusHandler)
      publichAlert("Connected to server!","success")
    };

    this.connection.onmessage = function (event) {
      //console.log(`[message] Data received from server: ${event.data}`);

    };
    this.connection.onclose = function (event) {
      this.statusHandler = "disconnected"
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        publichAlert("Disconnected with server!","warning")
      } else {
        console.log('[close] Connection died');
        publichAlert("Can't connect to server","danger")
      }
    };
    this.connection.onerror = function (error) {
      this.statusHandler = "disconnected"
      console.log(`[error] ${error.message}`);
    };
  }

  sendDetailsRequest() {
    var buffer = new ArrayBuffer(20);
    var view = new DataView(buffer, 0);
    view.setInt32(0, 1);
    view.setBigUint64(4, this.aKey )
    view.setBigUint64(12,this.bKey )
    console.log(view);
    this.connection.send(buffer);
  }

    sendRefreshRequest() {
       if(this.connection == null)
        {
         return
        }
        this.view.setInt32(0, 0);
        this.view.setBigUint64(4, this.aKey )
        this.view.setBigUint64(12, this.bKey )
        this.view.setInt8(20, 2);
        this.view.setInt8(21, 0);
        this.view.setInt8(22, 0);

        this.connection.send(this.buffer);
    }

  sendNoteRequest(midiEvent, noteNumber, velocity, track) {

    
    
    if(this.connection == null)
    {
     return
    }

    if(ic != null)
    {
      ic.play("Ab2", ac.currentTime, {gain:0.01});
    }



    if(this.pluginVersion === "1.0.0")
    {
      this.view.setInt32(0, 0);
      this.view.setBigUint64(4, this.aKey )
      this.view.setBigUint64(12, this.bKey )
      this.view.setInt8(20, midiEvent);
      this.view.setInt8(21, noteNumber);
      this.view.setInt8(22, velocity);
   
      this.connection.send(this.buffer);
    }
    if(this.pluginVersion !== "1.0.0")
    {
    
      this.view.setInt32(0, 0);
      this.view.setBigUint64(4, this.aKey )
      this.view.setBigUint64(12, this.bKey )
      this.view.setInt8(20, midiEvent);
      this.view.setInt8(21, noteNumber);
      this.view.setInt8(22, velocity);
      this.view.setInt8(23, track);
      this.connection.send(this.buffer);
    }

  
  }
}

pianoSocket = new PianoSocket()






