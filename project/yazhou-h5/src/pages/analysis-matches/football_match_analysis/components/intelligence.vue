<!--
 * @Author:Router
 * @Date: 2021-04-27
 * @Description: 详情页足球赛事分析情报页面
-->
<template>
  <div class="intelligence">
    <!--  头部 -->
    <div class="header">
      <div class="tab-radio-button" v-for="(item, index) in tab_radio_button" :key="index+'b'" :class="{active: radio_button_index == index}" @click="radioButton(index)">
        <span class="ellipsis">{{ item }}</span>
      </div>
    </div>
    <div class="content yb_mt10" v-for="(item,index) in data_list" :key="index">
      <p class="tittle"><span :class="{'color0':item.label == 0,'color1':item.label == 1,'color2':item.label == 2}"></span>&ensp;
        <template v-if="item.label == 0">{{ $root.$t('analysis_football_matches.Neutral_Information') }}</template>
        <template v-if="item.label == 1">{{ $root.$t('analysis_football_matches.Favorable_information') }}</template>
        <template v-if="item.label == 2">{{ $root.$t('analysis_football_matches.Unfavorable_information') }}</template>
      </p>
      <template v-for="(item2,index2) in item.msg">
        <p class="item" :key="index2">{{item2}}</p>
      </template>
    </div>
    <div v-if="!data_list.length && is_done" class="yb_py18 text-center no-list">{{ $root.$t('common.no_data') }}</div>
  </div>
</template>

<script>
import { api_result } from "src/project/api";
import { mapGetters } from "vuex";

export default {
  name: "intelligence",
  data() {
    return {
      radio_button_index: 0,  //按钮下标
      tab_radio_button: ['曼联', '德联'], //主客队名称
      data_list: [], //详细情报数据
      is_done: false,  //数据加载完成
    }
  },
  created() {
    // 添加监听 赛事分析刷新事件
    this.$root.$on(this.emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, this.refresh_match_analysis)

    this.tab_radio_button = [this.get_detail_data.mhn, this.get_detail_data.man]
    this.get_list()

  },
  computed: {
    ...mapGetters(['get_detail_data', 'get_goto_detail_matchid']),
    // 赛事id
    match_id() {
      return this.$route.params.mid || this.get_detail_data.mid
    },
  },
  methods: {
    radioButton(index) {
      if(this.radio_button_index == index) return
      this.radio_button_index = index
      this.data_list = []
      this.get_list()
    },
    async get_list() {
      try {
        this.is_done = false
        let parameter = {
          standardMatchId: this.match_id,
          parentMenuId: 4,  //父菜单类型:(2数据;3阵容4情报;5赔率)
          sonMenuId: this.radio_button_index + 1
        }
        let { code, data } = await api_result.get_match_analysise_data(parameter)
        if (code == 200 && data.sThirdMatchInformationDTOList && data.sThirdMatchInformationDTOList.length) {
          let msg0 = { label: 0, msg: [] }, msg1 = { label: 1, msg: [] }, msg2 = { label: 2, msg: [] };
          data.sThirdMatchInformationDTOList.forEach(item => {
            if (item.benefit == 0 || item.benefit == 1) {
              msg0.msg.push(item.content) //中立情报
            } else if (item.benefit == 2 && this.radio_button_index == 0 || item.benefit == 3 && this.radio_button_index == 1) {
              msg1.msg.push(item.content) //有利情报
            } else if (item.benefit == 4 && this.radio_button_index == 0 || item.benefit == 5 && this.radio_button_index == 1) {
              msg2.msg.push(item.content) //不利情报
            }
          });
          this.data_list.push(msg0, msg1, msg2)
          this.data_list = this.data_list.filter(item => {
            return item.msg.length
          })
        }
        this.is_done = true
      } catch (error) {
        console.error(error);
      }
    },
    // 刷新 当前赛事分析信息
    refresh_match_analysis() {
      const radio_button_index = this.radio_button_index
      this.radio_button_index = -1

      this.$nextTick(() => {
        this.radioButton(radio_button_index)
      })
    }
  },
  destroyed() {
    // 移除监听 赛事分析刷新事件
    this.$root.$off(this.emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, this.refresh_match_analysis)

    for (const key in this.$data) {
      this.$data[key] = null
    }
  }
}
</script>

<style lang="scss" scoped>
.intelligence {

  height: calc(100% - 0.4rem);

  .header {
    display: flex;
    justify-content: center;
    padding: 0.15rem 0;
    width: 100%;

    z-index: 100;

    .tab-radio-button {
      width: 1.4rem;
      height: 0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;


      letter-spacing: 0;
      text-align: center;
      font-size: 0.14rem;

      .ellipsis {

        font-weight: unset;
      }

      &.active {

        border: unset;

        .ellipsis {

          font-weight: bold;
        }
      }

      &:nth-child(1) {
        border-right: unset;
        border-radius: 0.08rem 0 0 0.08rem;
        padding: 0 0.15rem;
      }

      &:nth-child(2) {
        border-left: unset;
        border-radius: 0 0.08rem 0.08rem 0;
        padding: 0 0.15rem;
      }
    }
  }

  .content {
    .tittle {
      line-height: 0.4rem;
      padding: 0 0.2rem;

      span {
        display: inline-block;
        width: 0.08rem;
        height: 0.08rem;

        border-radius: 50%;
      }
    }

    .item {
      padding: 0.1rem 0.2rem;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
