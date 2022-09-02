

Vue.component('keyboard-input-component', {
  props: ['global'],
  mounted() {
   console.log(this.global.keyboard_mapping)
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
    reload_mappings()
    {
         console.log('siema')
         this.loadFile()
    },
    loadFile() {
      console.log("loadfile")
      var file = document.querySelector('input[id=mapping]').files[0];
      if(file == null)
      {
        publichAlert("unable to load file", 'danger')
        return;
      }
      var reader = new FileReader();
      const global = this.global;
      reader.onload = function(progressEvent){
        let mappings = parseKeyboardMappings(this.result);
        if(mappings == null)
        {
            return
        }
        global.keyboard_mapping = mappings;
        window.localStorage.setItem("keyboard_mapping",JSON.stringify(mappings));
        publichAlert("file loaded", 'success')
      };
      reader.readAsText(file);
 
    },

  },
  template: `
      <div class = "midi-player">
      <label class="custom-file-upload">
      <input type="file" id="mapping"  v-on:change="reload_mappings()"  />
         Keyboard mapping
      </label> 
      </div>
      `})

    