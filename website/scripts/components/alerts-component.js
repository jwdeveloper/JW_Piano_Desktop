Vue.component('alerts-component', {
    props: ['global'],
    mounted() {
        setAlertsHandler(this)
    },
    data: function () {
        return {
            alerts: [],
        }
    },
    methods: {
        remove(value) {
            var index = this.alerts.indexOf(value);
            if (index !== -1) {
                this.alerts.splice(index, 1);
            }
        },
        add(message, type, timeout = 5000) {

            const alert =    {
                message: message,
                type: "alert-" + type
            };

            timeout = timeout+this.alerts.length*1000;
            this.alerts.push(alert);
            setTimeout(e => { this.remove(alert); }, timeout);
        }
    },
    template: `
        <div class="alerts-box">
           <div class="alert" role="alert"  v-for="alert in alerts"  :class=alert.type>
                {{alert.message}}
                <span class="closebtn" v-on:click="remove(alert)">&times;</span>
            </div>
        </div>
      `})

