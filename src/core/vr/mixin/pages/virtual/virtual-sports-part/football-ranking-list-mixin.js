/*
 * @Description: 球类 排行榜页面 只需要传个 tid 联赛id进来
 */
import {api_v_sports} from "src/api/index.js";
import { LOCAL_PROJECT_FILE_PREFIX, useMittOn, MITT_TYPES } from 'src/output/index.js'

let off = ''
export default {
  name: "ranking_list",
  props:{
    tid: Number|String
  },
  data() {
    return {
      ranking_data: [],
      no_data: false,
      LOCAL_PROJECT_FILE_PREFIX
    }
  },
  mounted() {
    off= useMittOn(MITT_TYPES.EMIT_LANG_CHANGE,()=> {
      this.get_list()
    }).off
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
        let {code , data} = await api_v_sports.get_virtual_sport_team_ranking({tid: this.tid})
        if(code == 200) {
          if (data && data.length > 0) {
            this.ranking_data = data
          }else {
            this.no_data = true
          }
        }
      } catch (error) {
        this.no_data = true
        console.error(error);
      }
    }
  },
  unmounted () {
    for (const key in this.$data) {
      this.$data[key] = null
    }
    if (off) {
      off()
    }
  },

};