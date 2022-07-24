Vue.component('server-connection-component', {
    props: ['global'],
    mounted() {
  
    //  this.token = "ewogICJzZXJ2ZXJJUCI6ICIxNTIuMjI4LjE4Ny4yNDAiLAogICJwb3J0IjogODA2OSwKICAiYSI6ICItODkwMDE5ODE5NjIzMDE0MTk0NCIsCiAgImIiOiAiLTcyMzY5NTQ3Mjc0MDExNzc5NDAiCn0="
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

        let result = pianoSocket.setToken(this.token)
        if(result == false)
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
 
 