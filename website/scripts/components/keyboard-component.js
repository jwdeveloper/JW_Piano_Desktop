Vue.component('keyboard-component', {
    props: ['global'],
    mounted() {
        this.global.keyboard = create_keyboard()
        setNoteHanlder(this)
        this.handle_keyboard_click()
    },
    data: function () {
        return {
            hideMappings: true
        }
    },
    methods: {
        refresh() {
            for (const key of this.global.keyboard.values()) {
                key.className = key.className.replace(" note-on", "");
            }
        },
        displayMappings(state) {
            this.hideMappings = state
        },
        handle_keyboard_click() {
            window.addEventListener('keydown', (e) => {
                if(this.hideMappings == false)
                {
                  return
                }

                for (const key of this.global.keyboard.values()) {
                 
                    if (key.mapping === e.code) {
                       
                        this.handle_click(key.index)
                        this.handle_note_event(key.index, 100)
                        publichNodeEvent(0, key.index, 100,0); 
                        setTimeout(e => { 
                            this.handle_note_event(key.index, 0); 
                            publichNodeEvent(0, key.index, 0,0); 
                        }, 100);
                    }
                }
            });
        },
        handle_click(key) {
            const index = key.index;
            publichNodeEvent(0, index, 100,0);
            window.dispatchEvent(new CustomEvent('note-mouse-click', {
                detail: {
                    pianoKey: key
                }
            }));
            setTimeout(e => { publichNodeEvent(0, index, 0,0); }, 100);
        },
        handle_mouse_over(key) {
            key.isMapping = true
        },
        handle_mouse_leave(key) {
            key.isMapping = false
        },
        handle_note_event(nodeIndex, velocity) {
            for (const key of this.global.keyboard.values()) {
                if (nodeIndex === key.index) {

                    if (velocity > 0) {
                        key.className = key.activeName
                    }
                    else {
                        key.className = key.inactiveName
                    }
                    return
                }
            }
        }
    },
    template: `
    <ul class="keys">
    <li v-for="key in global.keyboard" :id="key.index" v-on:click="handle_click(key)"  @mouseover="handle_mouse_over(key)"  @mouseleave="handle_mouse_leave(key)"    :class=key.className>
    <div v-if="key.isMapping && !hideMappings" id="circle">{{key.mapping}}</div>
    </li>
    </ul>
      `})

function create_keyboard() {

    var result = []
    var key = 1;
    var octave = 0;
    for (let i = 1; i <= 88; i++) {
        if (i > 3 && i < 88) {
            key = (i - 4) % 12;
            octave = 1 + (i - 4) / 12;
        }
        if (i <= 3) {
            key = i + 8;
        }
        if (i == 88) {
            key = 0;
        }
        let className = mapKey(key);
        if (key == 1 || key == 3 || key == 6 || key == 8 || key == 10) {
            className = "black " + className;
        }
        else {
            className = "white " + className;
        }

        let index = i + 20
        className = className + " " + index
        result.push(
            {
                index: index,
                className: className,
                inactiveName: className,
                activeName: className + " note-on",
                isMapping: false,
                mapping: ""
            }
        );
    }
    return result;
}

function mapKey(index) {
    switch (index) {
        case 0:
            return "c";
        case 1:
            return "c#";
        case 2:
            return "d";
        case 3:
            return "d#";
        case 4:
            return "e";
        case 5:
            return "f";
        case 6:
            return "f#";
        case 7:
            return "g";
        case 8:
            return "g#";
        case 9:
            return "a";
        case 10:
            return "a#";
        case 11:
            return "h";
    }
}