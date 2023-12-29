<template>
  <div class="flex flex-center">
    <!-- <h1> DEMO </h1> -->
    <div id="statscorewidget"  :style="widget_style" ></div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      widget: null,
      widget_style:{
        // visibility: 'hidden' ,
        // visibility: 'unset',
      }
    }
  },
  created() {
  
  },
  mounted(){
    this.init_widget();
  },
  methods: {
    init_widget() {
      //联赛查询详见网: https://www.statscore.com/products/prematchpro/coverage/
      //2915 需求  ：  http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=98967696
      // https://statscore.atlassian.net/wiki/spaces/STW/pages/2917072899/Advanced
      // https://api.statscore.com/v2/booked-events?product=livescorepro&client_id=1981&mapped_status=mapped
      // Hook up when library is loaded and ready to use.
      // You can use this method as many times as necessary - if library
      // is already loaded provided callback will fire immediately
      STATSCOREWidgets.onLoad(err => {
        if (err) {
          switch (err.type) {
            case 'NetworkError':
              // Handle network error here
              break;
            case 'BrowserNotSupported':
              // Handle unsupported browser here
              break;
          }
          return;
        }
        // Widget will be appended to this HTMLElement.
        //
        // If you are using framework then follow its documentation
        // on how to get DOM Element from your component.
        // Vue.js https://vuejs.org/v2/api/#ref
        // React https://en.reactjs.org/docs/refs-and-the-dom.html
        // Angular https://angular.io/api/core/ElementRef
        const element = document.getElementById('statscorewidget');
        // Configuration that you should receive from STATSCORE

//         For LivematchPro: 654a46b1fff2e8ee7e5cd901
// For PrematchPro: 654a46bd057e82299ed77d6c
// Your client identifier (client_id): 1981   
        // const configurationId = '654a46bd057e82299ed77d6c';
        let url_obj = new URL(location.href)
        // const configurationId = '654a46b1fff2e8ee7e5cd901';
        // https://statscore.atlassian.net/wiki/spaces/STW/pages/3102310484/Languages  
    
        let configurationId = url_obj.searchParams.get('configurationId')|| '654a46bd057e82299ed77d6c'
        let eventId = url_obj.searchParams.get('eventId')||5168463
        let lang = url_obj.searchParams.get('lang') || 'zh'
        // Input data for widget type you want to embded
        const inputData = { eventId, language: lang };
        // Optional object with options.
        // You can check available options further in the docs.
        const options = {};
        const widget = new window.STATSCOREWidgets.Widget(element, configurationId, inputData, options);
       this.   add_widget_event(widget)
      });
    },
    add_widget_event(widget){
      const someEventCallback = () => { /* .. do stuff */ };

// You can listen for event using "on" and "once" methods
widget.on('someEvent', someEventCallback);
widget.once('someEvent', someEventCallback);

// You can destroy listener by using and off method
widget.off('someEvent', someEventCallback);

// Available lifecycle events:
widget.on('beforeInsert', () => { /* Triggers when data necessary to display widget is loaded and widget is ready to be inserted into document */ });
widget.on('load', () => { /* Triggers when widget is loaded but not yet interactive */ });
widget.on('mount', () => { /* Triggers when widget is loaded and interactive */   

 this. widget_style= {
      
         visibility: 'unset',
      }

});
widget.on('error', e => { 
  /* Handle errors here */ 
console.error("widget.on('error'----",e);
this. widget_style= {
        visibility: 'hidden' ,
         
      }
});

// Event coverage:
widget.on('requiredCoverageNotSatisfied', ({ isFtOnly: boolean, statsLvl: StatsLvl}) => {
    // If given widget depends on "eventId" input data and "satisfiesCoverage" option
    // was provided this event will be triggered when given constrains weren't satisfied.
    //
    // You can find more about "satisfiesCoverage" option in "Options" section.
});
this.widget = widget

    }

  },
  async beforeUnmount() {
    await this.widget.destroy();
  },
  unmounted() {
  }
})
</script>

<style lang="scss">

#statscorewidget{
  width: 350px;
  height: 300px;
}
  
</style>