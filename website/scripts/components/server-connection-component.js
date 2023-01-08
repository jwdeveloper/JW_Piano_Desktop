Vue.component('server-connection-component', {
    props: ['global'],
    mounted() {
     //this.token = "ewogICJzZXJ2ZXJJUCI6ICJsb2NhbGhvc3QiLAogICJwb3J0IjogNDQzLAogICJhIjogIjQ1NTM4OTY0OTA5MjIwOTg4NjQiLAogICJiIjogIi03MzE2ODQxOTE2NjA3NjI2MDY1IiwKICAicGx1Z2luVmVyc2lvbiI6ICIxLjIuMiIKfQ=="
    },
    data: function () 
    {
       return {
           token:"",
           stauts:"disconected"
       }
   },
    methods: {
      connect()
      {

        this.status = "connecting"
        if(pianoSocket == null)
        {
          this.status = "disconected"
          return
        }
        pianoSocket.setStatusHandler(this.status)

        let isTokenValid = pianoSocket.setToken(this.token)
        if(isTokenValid == false)
        {
          this.status = "disconected"
          publichAlert("Invalid value of token!","danger")
          return
        }
        pianoSocket.connect()
      }
   },
    template: `
     <div class="input-group">
          <div class="input-group-prepend " >
              <button class="btn btn-success" style="display:flex; gap:1em" type="button" v-on:click="connect()">Connect
              </button>
          </div>
          <input type="text" class="form-control" placeholder="enter token here"  v-model="token">
      </div>
      `})
 
 