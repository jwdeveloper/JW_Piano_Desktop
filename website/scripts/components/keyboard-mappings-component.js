Vue.component('keyboard-mappings', {
    props: ['global'],
    mounted() {
        this.pressTracker()
        this.loadMappings()
    },
    data: function () {
        return {
            noteMouseOverIndex: -1,
            currentPianoKey: null,
            isHide: true
        }
    },
    methods: {

        pressTracker() {
            window.addEventListener('keydown', (e) => {

                if (this.isHide) {
                    return
                }
                if (this.currentPianoKey == null) {
                    return
                }
                this.currentPianoKey.mapping = e.code;
                this.currentPianoKey = null;
            });

            window.addEventListener('note-mouse-click', (e) => {
                if (this.isHide) {
                    return
                }
                this.currentPianoKey = e.detail.pianoKey;
            });

            $(function () {
                $('[data-toggle="popover"]').popover()
            })
        },

        displayKeyboardMappings() {
            this.isHide = !this.isHide
            setDisplayMappings(this.isHide)
            if (this.isHide == false) {
                publichAlert("Move mouse over piano key to see Mapping", "success")
                publichAlert("To Edit click piano key and then keyboard key", "success")
            }
            if (this.isHide == true) {
                this.saveMappings(this.createExportContent(this, true))
                publichAlert("Saved", 'success')
            }
        },

        createExportContent(instnace, ignoreEmpty) {
            var input = ""
            for (var key of instnace.global.keyboard) {
                if (key.mapping == null || key.mapping == undefined || key.mapping == "" || key.mapping == " ") {
                    if(ignoreEmpty)
                    {
                        continue;
                    }
                }
                input += key.index + ":" + key.mapping + "\n"
            }
            return input;
        },

        exportMappings() {
            const content = createExportContent(this, false);
            const link = document.createElement("a");
            const file = new Blob([content], { type: "text/plain;charset=utf-8" });
            link.href = URL.createObjectURL(file);
            link.download = "sample.txt";
            link.click();
            URL.revokeObjectURL(link.href);
        },
        importMappings() {
            var file = document.querySelector('input[id=mapping-import]').files[0];
            if (file == null) {
                publichAlert("unable to load file", 'danger')
                return;
            }
            var reader = new FileReader();
            const instance = this;
            reader.onload = function (progressEvent) {
                instance.loadMappingsFromFile(reader.result, instance)
            };
            reader.readAsText(file);
        },
        loadMappingsFromFile(content, instance) {
            let mappings = parseImportedMappings(content);
            if (mappings == null) {
                return
            }
            console.log("=================== LOADING MAPPINGS ==============================")
            for (const pianoKey of instance.global.keyboard) {
                const mapping = mappings[pianoKey.index]
                if (mapping == null || mapping == undefined || mapping == "" || mapping == " ") {
                    continue
                }
                pianoKey.mapping = mapping;
                console.log("Mapping loaded ", "NodeId: " + pianoKey.index, "Mapping: " + mapping)
            }
            console.log("========================================================================================")

            publichAlert("keyboard mappings loaded", 'success')
            this.saveMappings(content)
        },
        saveMappings(data) {
            console.log("mapping saved")
            window.localStorage.setItem("keyboard_mapping", data);
        },
        loadMappings() {

            let mappingData = window.localStorage.getItem("keyboard_mapping");
            if (mappingData != null) {
                console.log("Loading mappings From loacal storage")
                this.loadMappingsFromFile(mappingData, this)
                return;
            }

            console.log("Loading deafult mappings")
            var url = 'resources/example_keyboard_mapping.txt'
            const global = this.global;
            if (global.localFile == false) {
                url = global.url + url;
            }
            const instnace = this;
            fetch(url).then(response => response.text())
                .then(e => {
                    this.loadMappingsFromFile(e, instnace)
                });
        },
        resetMappings()
        {
            console.log("Mapping reset")
            console.log("Loading deafult mappings")
            var url = 'resources/example_keyboard_mapping.txt'
            const global = this.global;
            if (global.localFile == false) {
                url = global.url + url;
            }
            const instnace = this;
            for (const pianoKey of instnace.global.keyboard) {
                pianoKey.mapping = null;
            }
            publichAlert("Reseting keyboard mappings", 'success')
            
            fetch(url).then(response => response.text())
                .then(e => {
                    this.loadMappingsFromFile(e, instnace)
                });
        }
    },
    template: `
    <div class="keyboard-mappings">
          <h4 class="keyboard-mappings-title">Keyboard mappings</h4>
 
          <div class="btn-group d-flex" role="group" aria-label="Basic example">
           <button type="button" @click="displayKeyboardMappings()" class="btn  btn-success  w-100 no-border">
           <h v-if="isHide">Edit</h>
           <h v-if="!isHide">Save</h>
           </button>

           <button type="button" v-if="!isHide" @click="resetMappings()" class="btn btn-success no-border w-100">Reset</button>
           <button type="button" @click="exportMappings()" class="btn btn-success no-border w-100">Export</button>
        
           <label class="mapping-import-button no-border w-100">
           <input type="file" id="mapping-import"  v-on:change="importMappings()"  />
             Import
           </label> 
         </div>
         </div>
  
      `})



function parseImportedMappings(text) {
    var lines = text.split('\n');
    var mappings = {};
    for (var i = 0; i < lines.length; i++) {
        let line = lines[i]
        if (line.length == 0) {
            continue
        }
        var lineSplit = line.split(':');
        if (lineSplit.length != 2) {
            publichAlert("Bad formatting: " + line, 'danger')
            publichAlert("Format should look like: note_id:key  ", 'warning')
            publichAlert("Example: 60:a  ", 'warning')
            return null;
        }

        const key = parseInt(lineSplit[0]);
        const value = lineSplit[1];
        mappings[key] = value
    }
    return mappings;
}