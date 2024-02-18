/*
 * @Description: 虚拟体育 淘汰赛页面 只需要传个 tid 联赛id进来
 */
import { api_v_sports } from "src/api/index.js";
import { LOCAL_PROJECT_FILE_PREFIX,calc_win, project_name, i18n_t } from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js"; 

export default {
  name: "knockout",
  props:{
    tid: Number|String,
    current_match: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      tabs: [
        {name: i18n_t('virtual_sports.top_16'), key: 'Q8'},
        {name: i18n_t('virtual_sports.quarter_finals'), key: 'Q4'},
        {name: i18n_t('virtual_sports.semifinals'), key: 'SEMIFINAL'},
        {name: i18n_t('virtual_sports.finals'), key: 'FINAL'}
      ],
      tab_index: -1,
      visible: false,
      no_data: false,
      list_data: [],
      check_if_there_tab: []  //  判断tab 选项卡是不是有数据
    }
  },
  computed:{
    lang(){ return UserCtr.lang },
  },
  watch: {
    'current_match': {
      handler: 'get_list',
      immediate: true
    }
  },
  // mounted() {
  //   this.tab_index = 0;
  //   this.list_data = [{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065700105539587","awayScore":["3"],"homeName":"阿根挺少年队","homeNameCode":"125065699660943363","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":0},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125019543669067779","awayScore":["1"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065700134899720","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":1}]},{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699941961731","awayScore":["2"],"homeName":"阿拉维预备","homeNameCode":"125065699677720578","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":2},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699195375619","awayScore":["2"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065699178598404","homeScore":["0"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":3}]},{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065700524969987","awayScore":["2"],"homeName":"卡利阿美利加","homeNameCode":"125065700814376965","homeScore":["0"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":4},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699711275012","awayScore":["0"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065699199569922","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":5}]},{"list":[{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065699145043971","awayScore":["1"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125019543769731075","homeScore":["0"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":6},{"awayName":"Đua Xe Ngựa VR","awayNameCode":"125065700139094019","awayScore":["1"],"homeName":"Đua Xe Ngựa VR","homeNameCode":"125065700533358594","homeScore":["1"],"isSecond":"Y","phase":"Q8","tournamentId":"125019479991144450","ranking_index":7}]}]
  // },
  setup() {
    return {
      LOCAL_PROJECT_FILE_PREFIX,
    }
  },
  methods: {
    tabClick(item, i) {
      // console.log("this.list_data+++===", this.list_data);
      // console.log("this.check_if_there_tab===", this.check_if_there_tab);
      if(this.tab_index == i) return
      // 判断选项卡里边有没有数据
      if (!Object.keys(this.check_if_there_tab).includes(item.key)) {
        this.$toast(i18n_t('virtual_sports.no_data') + i18n_t(`${item.name}`), 1000)
        return
      }
      this.knockout_list_filter(i)
      this.tab_index = i
    },
    async get_list() {
      try {
        this.visible = true
        this.tab_index = -1
        let params = {
          tid: this.tid,
          batchNo: this.current_match.batchNo,
          lod: this.current_match.lod || 1,
          mmp: this.current_match.mmp,
          beginTime: this.current_match.mgt,
        }
        // this.json_list  调试用的, data 才是真实数据
        let {code, data} = await api_v_sports.get_match_sorce(params)
        this.visible = false
        this.check_if_there_tab = data
        // this.check_if_there_tab = this.json_list
        if (code == 200) {
          if(Object.keys(data).length > 0) {
            // if(Object.keys(this.json_list).length > 0) {
            this.tab_index = Object.keys(data).length - 1
            this.no_data = false
            this.knockout_list_filter(this.tab_index)
          } else {
            this.no_data = true
          }
        }
      } catch (error) {
        this.no_data = false
        this.visible = false
        console.error(error);
      }
    },
    // 数据格处理
    knockout_list_filter(filter_index) {
      let arr = this.check_if_there_tab[this.tabs[filter_index].key], index = 0;

      // 加工每一轮的比分
      this.processing_score(arr)

      // 清除 list_data 的数据
      this.list_data =[]
      if (arr.length >= 2) {
        for (let i = 0, len = arr.length; i < len; i += 2) {
          this.list_data[index] = {}
          this.list_data[index].list = [...arr.slice(i, 2 + i)]
          index++
        }
      } else {
        this.list_data = [...arr]
      }
      // console.log("this.list_data---knockout+++=====", JSON.stringify(this.list_data))
    },
    // 加工每一轮的比分
    processing_score(arr) {
      arr.forEach((item, i) => {
        item.ranking_index = i
        // 如果是数组，并且 里边分数数组长度超过两个，代表里边有 逗号
        if(!Array.isArray(item.homeScore) && item.homeScore.indexOf(',')){
          item.homeScore = item.homeScore.split(",");
        }
        if(!Array.isArray(item.awayScore) && item.awayScore.indexOf(',')){
          item.awayScore = item.awayScore.split(",");
        }
      })
    }
  },
  unmounted () {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
};