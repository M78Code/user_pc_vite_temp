/*
 * @Description: 赛狗类 排行榜页面  只需要传个 mid 赛事id进来
 */
import { api_v_sports } from "src/api/index.js";
import VR_CTR from "src/core/vr/vr-sports/virtual-ctr.js"
import { LOCAL_PROJECT_FILE_PREFIX } from "src/output/index.js";

export default {
  name: "ranking_list_start",
  props:{
    mid: [Number, String],
  },
  data() {
    return {
      ranking_data:[],
      no_data: false,
      LOCAL_PROJECT_FILE_PREFIX
    }
  },
  watch: {
    'get_current_mid': {
      handler: 'get_list',
      immediate: true
    },
  },
  methods: {
    /**
     *@description 计算类名
     *@param {Number} rank_i 编号
     *@param {Number} sportId 球类id
     *@return {String} 类名
     */
    get_rank_background(rank_i,sportId){
      let s_type = 'dog';//赛马horse或赛狗dog
      let virtual_sports_1= ''
      if(sportId == 1011){  // 赛马
        s_type = 'horse'
      }
      else if([1002, 1010, 1009].includes(+sportId)){ // 赛狗 摩托车
        s_type = 'dog'
      } else {
        return null
      }
      if([1010].includes(+sportId)){
        virtual_sports_1 = `motorcycle${rank_i}`
      }
      if([1009].includes(+sportId)){
        virtual_sports_1 = `dirt_motorcycle${rank_i}`
      }
      return `match-horse${virtual_sports_1}`;
    },
    async get_list() {
      try {
        let {code , data} = await api_v_sports.get_virtual_match_detail_count({mid: this.get_current_mid})
        if(code == 200 && data.length > 0) {
          this.ranking_data = lodash.forEach(data, (item, index)=> {
            if(!item.star){
              item.star = 0
            }
          })
          // this.results_filter(this.ranking_data)
        } else {
          this.no_data = true
        }
      } catch (error) {
        this.no_data = true
        console.error(error);
      }
    },
  },
  computed: {
    // ...mapGetters([
    //   "get_theme"
    // ]),
    get_current_mid(){
      return VR_CTR.state.current_match_mid;
    },
    get_curr_sub_menu_type(){
      return VR_CTR.state.curr_sub_menu_type
    },
    get_theme(){
      return 'theme01';
    },
  },
  unmounted () {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
};