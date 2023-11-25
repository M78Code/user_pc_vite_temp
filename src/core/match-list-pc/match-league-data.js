import { ref } from 'vue'

// 联赛页面操作及数据 及展示
class MatchLeagueData {
  constructor() {
    this.init()
  }

  init() {
    // 联赛列表数据
    this.league_list = ref([]);
    // 当前是否是选中联赛
    this.is_league_checked = false;
    // 当前选中的时间
    this.selectHours = 24;
    // 当前选中的区域id
    this.regionId = null;
    this.choose_league_obj = {};
    this.league_name = ref(localStorage.getItem("league_name"))
  }

  set_league_obj(payload) {
    // 当前选中的区域信息
    this.choose_league_obj = payload;
    this.regionId = payload.regionId;
    // 当前选中区域下的所有 联赛信息
    this.league_list.value = payload.tournamentList;
    localStorage.setItem("league_list", JSON.stringify(payload.tournamentList))
  }

  set_select_hours(payload) {
    this.selectHours = payload;
  }

  get_league_list() {
    if (JSON.parse(localStorage.getItem("league_list"))?.length) {
      this.league_list.value = JSON.parse(localStorage.getItem("league_list"))
    }
    return this.league_list.value
  }

  get_select_hours() {
    return this.selectHours;
  }

  set_league_name (name) {
    localStorage.setItem("league_name", name)
    this.league_name.value = name
  }
}

export default new MatchLeagueData();
