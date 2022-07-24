
 var AudioContext = window.AudioContext || window.webkitAudioContext || false; 
 var ac = new AudioContext || new webkitAudioContext;

 var ic = null
Vue.component('midi-player-component', {
  props: ['global'],
  mounted() {
    this.timeline = document.getElementById("timeline");


    setInterval(() => {
      if (this.player == null)
        return
        const last = this.progress;
        this.progress = 100 - this.player.getSongPercentRemaining();
      if (this.progress == 100) {
        refreshKeyboard()
      }
    }, 700)
  },
  data: function () {
    return {
      progress: 0,
      fileName: "",
      isPlaying: false,
      timeline: null,
      player: null
    }
  },
  methods: {
    changeState() {
      this.isPlaying = !this.isPlaying
      if(this.player == null)
      {
        publichAlert('you need to open midi file', 'warning')
          return
      }

      if(this.isPlaying == false)
      {
        this.player.pause()
      }
      else
      {
        this.player.play()
      }
      

    },

    stopPlaying() {
      console.log('stop')
      if(this.player != null)
       {
        this.player.stop()
        this.isPlaying = false;
        refreshKeyboard()
       }
    },


    startPlaying()
    {
      this.player.play();
      this.isPlaying = true;
    },


    withSound()
    {
     
      Soundfont.instrument(ac, 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/acoustic_guitar_nylon-mp3.js').then( (instrument) => {
        this.loadFile(instrument,ac)
        ic = instrument
      });
    },

    changeTime()
    {
       if(this.player == null)
       {
        this.progress = 0
        return
       }
      
       

      console.log('time',this.progress)
      this.player.skipToPercent(this.progress)
      refreshKeyboard()
      if(this.isPlaying == false)
      {
       return
      }
      this.player.play()
    },
    loadFile() {
      console.log("loadfile")
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader();
      if (file) reader.readAsArrayBuffer(file);

      reader.addEventListener("load", () => {

        this.player = new MidiPlayer.Player((event) => {

        
         /* if(event.name != "Controller Change" && 
            event.name != "Note on" && 
            event.name != "Note off")
            {
              console.log(event.name, event)
            }*/

            if(event.name == "MIDI port" || event.name == "End of Track" ||  event.name == "Sequence/Track Name")
            {
              publishRefreshEvent();
            }

          if(event.name == "Controller Change")
          {
            if(event.value == 0)
            {
              
              publichNodeEvent(1,event.number,0)
            }
            if(event.value == 127)
            {
              alreaduRelese = false;
              publichNodeEvent(1,event.number,1)
            }
          }
          if (event.name == 'Note on') {
           
          //  instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
            publichNodeEvent(0, event.noteNumber, event.velocity);
          }

          if (event.name == 'Note off') {
            publichNodeEvent(0, event.noteNumber, 0);
          }
         
        });
        try {
          this.player.loadArrayBuffer(reader.result);
          this.startPlaying()
          publichAlert('File loaded', 'success')
        }
        catch (e) {
          publichAlert(e, 'danger')
        }


      }, false);
    },

  },
  template: `
        <div class = "midi-player">

        <div style = "display:flex; gap: 1em; margin-bottom:1em;">
        <label class="custom-file-upload">
        <input type="file"  v-on:change="withSound()" v-on:click="stopPlaying()" accept=".midi,.mid"/>
        open MIDI
        </label> 
        <midi-devices-component v-bind:global="global"></midi-devices-component>
        </div>
      
         <div class ="play-box" >
         <button type="button" class="btn btn-success btn-sm"  v-on:click ="changeState()">
           <i v-if="isPlaying === false"  class="fa fa-play" ></i>
           <i v-if="isPlaying === true"  class="	fa fa-pause"></i>
         </button>
          <input id ="timeline"  type="range" class="custom-range" v-on:change="changeTime(this.value)" min="0" max="100"  v-model="progress">
         </div>
      
   </div>
</div>

      
      `})

    