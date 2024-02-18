/*
 * @Description: 虚拟体育 小组赛页面 只需要传个 tid 联赛id进来
 */
import { api_v_sports } from "src/api/index.js";
import UserCtr from "src/core/user-config/user-ctr.js"; 

export default {
  name: "group_matches",
  props:{
    tid: Number|String,
    current_match: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      group_stage_list: [],
      no_data: false,
    }
  },
  computed:{
    lang(){ return UserCtr.lang },
  },
  mounted() {
  },
  watch: {
    tid: {
      handler: 'get_list',
      immediate: true,
    }
  },
  methods: {
    async get_list() {
      try {
        let {code , data} = await api_v_sports.get_virtual_sport_XZ_team_ranking({tid: this.tid})
        if(code == 200) {
          if(data && data.length > 0){
            this.group_stage_list = data
          }else {
            this.no_data = true
          }
        }
      } catch (error) {
        this.no_data = true
        console.error(error);
      }
    },
  },
  unmounted () {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
};
