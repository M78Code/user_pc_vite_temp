<template>
    <!-- <h1> DEMO </h1> -->
    <div  id="statscorewidget" v-if="!no_data"  :style="widget_style" ></div>
    <!-- loading -->
    <div v-else-if="loading" class="loading-wrap" :style="{'background':theme == 'day' ? '#fff' : '#1f222b'}" >
        <div class="img-loading custom-format-img-loading"></div>
        <div class="text-center loading-text flex items-end justify-center">
          <span :style="{'color':theme == 'night' ? '#fff' : '#1f222b'}">{{i18n_t('common.loading')}}</span>
          <!-- 右侧详情内容加载中... -->
        </div>
      </div>
    <!-- loading -->
    <!-- 动画播放失败 -->
    <animation_no_video v-else></animation_no_video>
</template>
<script>
import { defineComponent } from 'vue'
import  animation_no_video  from "../components/animation_no_video.vue";
export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      widget: null,
      widget_style:{
        // visibility: 'hidden' ,
        // visibility: 'unset',
      },
      no_data:false,
      loading:true,
      theme:'day'
    }
  },
  created() {
  
  },
  components:{
    animation_no_video
  },
  mounted(){
    let url_obj = new URL(location.href)
    console.log(url_obj,'url_obj');
    this.theme  = url_obj.searchParams.get('style')
    console.log(this.theme,'theme');
    this.init_widget();
  },
  methods: {
    init_widget() {
      //联赛查询详见网: https://www.statscore.com/products/prematchpro/coverage/
      //2915 需求  ：  http://lan-confluence.sportxxxr1pub.com/pages/viewpage.action?pageId=98967696
      // 对接文档  https://statscore.atlassian.net/wiki/spaces/STW/pages/2917072899/Advanced
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
      //http://test-topic.sportxxxifbdxm2.com/animation-page/common/?configurationId=configurationId&eventId=eventId&language=zh   
        let configurationId = url_obj.searchParams.get('configurationId')|| '654a46bd057e82299ed77d6c'
        let eventId = url_obj.searchParams.get('eventId')||0
        let language = url_obj.searchParams.get('language') || 'zh'
        // Input data for widget type you want to embded
        // http://test-lsport-animation.sportxxxifbdxm2.com/getAnimation?configurationId=654a46b1fff2e8ee7e5cd901&eventId=5326781&language=zh
        const inputData = { eventId, language  };

        console.error('inputData--',{
          configurationId,
          inputData
        });
        // Optional object with options.
        // You can check available options further in the docs.
        const options = {loader:{
           enabled: false, size: 60, color1: 'red', color2: 'blue' 
        }};
        // const widget = new window.STATSCOREWidgets.Widget(element, configurationId, inputData, options);
        const widget = new window.STATSCOREWidgets.WidgetGroup(element, configurationId, inputData, options);
       this.add_widget_event(widget)
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
widget.on('beforeInsert', () => { /* Triggers when data necessary to display widget is loaded and widget is ready to be inserted into document */ 
  console.log(1111,'beforeInsert');
});
widget.on('load', () => { /* Triggers when widget is loaded but not yet interactive */
  this.loading = false
  console.log(2222,'load');
});
widget.on('mount', () => { /* Triggers when widget is loaded and interactive */   
  console.log(3333,'mount');
 this.widget_style= {
      
         visibility: 'unset',
      }

});
widget.on('error', e => { 
  /* Handle errors here */ 
console.error("widget.on('error'----",e);
this.widget_style= {
        visibility: 'hidden' ,
         
      }
this.no_data = true      
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
  width: 100%;
  height: 100%;
}  
.loading-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.custom-format-img-loading {
  width: 50px;
  height: 50px;
  background-image: url($SCSSPROJECTPATH+"/img/loading.gif");
  background-size: 100%;
  margin: 10px 0;
}
.loading-text {
  font-size: 12px;
}
</style>