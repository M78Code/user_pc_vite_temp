/*
 * @Date: 2023-12-14 
 * @Description: 虚拟体育详情tab
 */
export default {
  name: 'virtual_sports_detail_tab',
  props: {
    current_match :Object,
  },
  data() {
    return {
      viewTab: 'bet',
      tab_list: [
        { label_i18n_key: 'virtual_sports.match_detail.historical_results', id: 1, name: 'lszj' },
        { label_i18n_key: 'virtual_sports.match_detail.bet', id: 2, name: 'bet' },
        { label_i18n_key: 'virtual_sports.match_detail.leaderboard', id: 3, name: 'rank' }
      ]
    }
  },
  methods: {
    change_tab (val){
      this.viewTab =val
      this.$emit('change_tab',val)
    }
  },
  watch: {
    // 赛马类的详情，不显示排行榜，只展示历史战绩
    "current_match.csid": {
      handler(new_csid){
        if(new_csid && (new_csid !== "1001" && new_csid !== "1004")){
          this.tab_list = [
          { label_i18n_key: 'virtual_sports.match_detail.bet', id: 2, name: 'bet' },
          { label_i18n_key: 'virtual_sports.match_detail.historical_results', id: 1, name: 'rank' },
          ]
        }
      },
      immediate: true
    }
  },
}