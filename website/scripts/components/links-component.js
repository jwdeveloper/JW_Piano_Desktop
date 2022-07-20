Vue.component('links-component', {
    props: ['global'],
    mounted() {
    this.addLink("contact.png",
    "https://www.spigotmc.org/resources/piano.103490/",
    "Contant me")
    
    this.addLink("support.png",
    "https://streamlabs.com/jackfreeman_/tip",
    "Support me")


    this.addLink("bug.png",
    "https://github.com/jwdeveloper/JW_Piano/issues",
    "report bug")

   

    },
    data: function () {
        return {
            links :[]
        }
    },
    methods: {
      addLink(img,url, description)
      {
        img = this.global.url +"resources/"+img;
        this.links.push(
            {
                img:img,
                url:url,
                description
            }
        )
      },
      openLink(url)
      {
        window.open(url,'_blank');
      }
      
    },
    template: `
        <div class="links">
             <a  v-on:click="openLink(link.url)" class= "link" v-for="link in links" >
             <img  :src =link.img   :title=link.description height = "100px" width="400px" type = "image">
             </a>
        </div>
      `})

