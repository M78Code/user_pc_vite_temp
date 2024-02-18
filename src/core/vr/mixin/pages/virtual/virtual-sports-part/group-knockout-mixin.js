/*
 * @Description: 虚拟体育 小组赛淘汰赛页面 只需要传个 tid 联赛id进来
 */
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
export default {
  name: "virtual_sports_part",
  props:{
    tid:  Number|String,
    current_match:Object,
  },
  data() {
    return {
      tabIndex: 0,
      tab_list: [
        { index: 0, label: i18n_t('virtual_sports.group_matches'), value: 'group_matches' ,disable: false},
        { index: 1, label: i18n_t('virtual_sports.knockout'), value: 'knockout', disable: false }
      ],
      tabList: [
        {
          name: i18n_t('virtual_sports.group_matches'),
          component: 'group_matches'
        },
        {
          name: i18n_t('virtual_sports.knockout'),
          component: 'knockout'
        }
      ],
      currentContent: 'group_matches',
      height_change: '100%'
    }
  },
  created() {

  },
  mounted() {
  },
  watch: {
    currentContent() {
      this.height_change = '400px'

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.height_change = '100%'
      },200)
    },
    // 监听小组赛 淘汰赛的变化
    'current_batch.mmp': {
      handler(n,o){
        const key_list = ['Q8', 'Q4', 'SEMIFINAL', 'FINAL']
        if(key_list.includes(this.current_batch.mmp)){
          this.tabIndex = 1
          this.currentContent = 'knockout'
          this.tab_list[0].disable = true
          this.tab_list[1].disable = false
        }else{
          this.tabIndex = 0
          this.currentContent = 'group_matches'
          this.tab_list[0].disable = false
          this.tab_list[1].disable = true
        }
      },
      immediate: true,
      deep: true
    },
  },
  computed: {
    current_batch(){
      return VR_CTR.state.current_batch;
    }
  },
  methods: {
    // 点击菜单切换
    tab_click(tab) {
      // console.log(tab);
      // tab.disable = false;
      // console.log("============this.id++", this.tid)
      // console.log("============this.current_match===++", this.current_match)
      // console.log("=========================+++++++++++++++++++++///////////////////")
      // return
      if(tab.index==1 && tab.disable) return
      this.tabIndex = tab.index
      this.currentContent = tab.value
    }
  },
  unmounted() {
    clearTimeout(this.timer)
    this.timer = null

    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
};