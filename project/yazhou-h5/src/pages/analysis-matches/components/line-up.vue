<!--
 * @Author: 
 * @Date: 
 * @Description: 详情页 或者 赛果  篮球足球公共组件，阵容tab页面
-->
<template>
  <div class="line-up">
    <!--  头部 -->
    <div class="header">
      <div class="tab-radio-button"
           v-for="(item, index) in tab_radio_button" :key="index+'tb'"
           :class="{active: radio_button_index == index}"
           @click="radioButton(item, index)"
      >
        <span class="ellipsis">{{ item }}</span>
      </div>
    </div>
    <!--  足球背景图片 -->
    <div class="football_field" v-if="get_detail_data.csid == 1">
      <!-- 加载第一项 和 最后一项-->
      <div class="first_and_last"
           :class="[
             `location${item.position}`,
             (number == 3 && item.position > 8) ? calculatelast(item) : '',
             (number == 2 && item.position > 9) ? calculatelast(item) : '',
             (number == 1 && item.position > 10 && item.position <=11) ? calculatelast(item) : '',
           ]"
           v-for="(item, i) in line_up_data.up"
           v-if="((number == 3 && item.position > 8) || item.position == 1 || (number == 2 && item.position > 9) ||
           (number == 1 && item.position > 10)) && item.position<=11"
           :key="i+'f_l'"
      >
        <div>
          <span>{{ item.shirtNumber || 0 }}</span>
        </div>
        <span class="ellipsis">{{ item.thirdPlayerName }}</span>
      </div>
      <!--  加载中间的内容  -->
      <!--  如果首发阵容是两列，前面有两列 比如 4-2-4 -->
      <template v-if="number_columns.length == 2">
        <div class="two_columns "
             v-for="(list, index) in football_filtered_data" :key="index+'middle'"
             :class="[
               list.data.length == 5 && calculation_radian(index) && 'five_columns'
             ]"
        >
          <div class="first_and_last"
               v-for="(item, index) in list.data" :key="index+'l_f'"
               :class="[
               (index == 0 || index ==4) && list.data.length == 5 ? calculation_radian(index): ''
             ]"
          >
            <div>
              <span>{{ item.shirtNumber || 0 }}</span>
            </div>
            <span class="ellipsis">{{ item.thirdPlayerName }}</span>
          </div>
        </div>
      </template>
      <!--  如果首发阵容是三列，前面有两列  4-2-3-1 -->
      <template v-if="number_columns.length == 3">
        <div class="two_columns "
             v-for="(list, index) in football_filtered_data" :key="index"
        >
          <div class="first_and_last" v-for="(item, index) in list.data" :key="index+'s'">
            <div>
              <span>{{ item.shirtNumber || 0 }}</span>
            </div>
            <span class="ellipsis">{{ item.thirdPlayerName }}</span>
          </div>
        </div>
      </template>
    </div>
    <!--  篮球背景图片 -->
    <div class="basket-ball-field" v-if="get_detail_data.csid == 2">
      <div class="basket-ball-item"
           v-for="(item, index) in basketball_data" :key="index+'s'"
           :class="[
             `location${index+1}`,
           ]"
      >
        <div>
          <span>{{ item.shirtNumber || 0 }}</span>
        </div>
        <span class="ellipsis">{{ item.thirdPlayerName }}</span>
      </div>
    </div>
    <!--  首发阵容，替补阵容 -->
    <template v-if="!no_data">
      <!-- 首发阵容-->
      <div class="title" >
        {{$root.$t('analysis_football_matches.starting_lineup') }}
        <template v-if="get_detail_data.csid == 1">
          {{radio_button_index == 0 ? line_up_data.homeFormation : line_up_data.awayFormation}}
        </template>
      </div>
      <div class="public_form football_standings">
        <!-- 头部 -->
        <div class="header">
          <div class="col1"></div>
          <div class="col2">{{$root.$t('analysis_football_matches.position') }}</div>
          <div class="col3" v-html="$root.$t('analysis_football_matches.name')"></div>
          <div class="col4">{{$root.$t('analysis_football_matches.number') }}</div>
        </div>
        <!-- 主内容 -->
        <div class="team-item" v-for="(item, i) in line_up_data.up" :key="i+'a'">
          <div class="col1">
            <!-- 联赛icon -->
            <img class="match_logo"
                 :src=" item.thirdPlayerPicUrl ? get_file_path(item.thirdPlayerPicUrl) : default_url"
                 @error="league_icon_error"
            />
          </div>
          <div class="col2">{{ item.positionName || '-' }}</div>
          <div class="col3 ellipsis">
            <template v-if="get_lang == 'en'">&ensp;</template>
            {{ item.thirdPlayerName || '-' }}
          </div>
          <div class="col4 end-btn">
            <span>{{ item.shirtNumber }}</span>
          </div>
        </div>
        <!-- 没有数据 组件 -->
        <div v-if="line_up_data.up.length <= 0" class="no-list">{{ $root.$t('common.no_data') }}</div>
      </div>
      <!-- 替补阵容-->
      <div class="title">
        <span>{{$root.$t('analysis_football_matches.bench_lineup') }}</span>
      </div>
      <div class="public_form football_standings">
        <!-- 头部 -->
        <div class="header">
          <div class="col1"></div>
          <div class="col2">{{$root.$t('analysis_football_matches.position') }}</div>
          <div class="col3" v-html="$root.$t('analysis_football_matches.name')"></div>
          <div class="col4">{{$root.$t('analysis_football_matches.number') }}</div>
        </div>
        <!-- 主内容 -->
        <div class="team-item" v-for="(item, i) in line_up_data.down" :key="i+'b'">
          <div class="col1">
            <!-- 联赛icon -->
            <img class="match_logo"
                 :src=" item.thirdPlayerPicUrl ? get_file_path(item.thirdPlayerPicUrl) : default_url"
                 @error="league_icon_error"
            />
          </div>
          <div class="col2">{{ item.positionName || '-' }}</div>
          <div class="col3 ellipsis">
            {{ item.thirdPlayerName || '-' }}
          </div>
          <div class="col4 end-btn">
            <span>{{ item.shirtNumber }}</span>
          </div>
        </div>
        <!-- 没有数据 组件 -->
        <div v-if="line_up_data.down.length <= 0" class="no-list">{{ $root.$t('common.no_data') }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { api_result } from "src/project/api";
import { computed, nextTick, onUnmounted } from "vue";
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
import { useRoute } from 'vue-router'

// TODO: 后续修改调整
// import {mapGetters} from "vuex";

  const radio_button_index = ref(0)
  const tab_radio_button = ref(['曼联', '德联'])
  // 列表数据
  const line_up_data = ref([])
  const no_data = ref(true)
  //默认图片地址
  const default_url = ref("image/bw3/png/my.png")
  // 最后一位数
  const number = ref('')
  // 代表多少列 并且里边的数字
  const number_columns = ref('')
  const football_filtered_data = ref([
    {data:[]},
    // {data:[]},
  ])
  // 篮球的 背景图的 数据
  const basketball_data = ref([])
  const route = useRoute()

  //  添加监听 赛事分析刷新事件 TODO: $root get_detail_data 后续修改调整
  useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis)
  get_list()
  tab_radio_button = [get_detail_data.mhn, get_detail_data.man]
  const match_id = computed(() => {
    // 赛事id
    return route.params.mid || get_detail_data.mid
  })
  // computed: {
  //   ...mapGetters(["get_goto_detail_matchid", 'get_detail_data','get_lang']),
  // },
  // 当首发阵容 有数值是5列的时候，
  const calculation_radian = (index) => {
    return `five_columns${index + 1 }`
  }
  const calculatelast = (item) => {
    let how_many_bits
    if(number == 1) {
      how_many_bits = 'how_many_bits1'
    }else if(number == 2){
      how_many_bits = 'how_many_bits2'
    }else if(number == 3){
      how_many_bits = 'how_many_bits3'
    }
    return how_many_bits
  }
  /**
   * @description: 图标出错时
   * @param {Object} $event 错误事件对象
   */
  const league_icon_error = ($event) => {
    $event.target.src = default_url;
    $event.target.onerror = null
  }
  const radioButton = (item, index) => {
    if(radio_button_index == index) return
    radio_button_index = index
    basketball_data = []
    get_list()
  }
  const get_list = async () => {
    no_data = true
    try {
      let parameter = {
        // 2079863足球测试id  2185843篮球测试id
        matchInfoId: match_id, 
        // 主客队标识(1主队，2客队)
        homeAway: radio_button_index + 1 
      }
      let {code , data} = await api_result.get_match_lineup_list(parameter)
      if(code == 200 && Object.keys(data).length > 0) {
        // 如果是足球赛事
        line_up_data = data
        if(get_detail_data.csid == 1){
          if(radio_button_index == 0){
            filter_numbers(line_up_data.homeFormation)
            // filter_numbers('4-2-3-1')
          }else{
            filter_numbers(line_up_data.awayFormation)
          }
        }else if(get_detail_data.csid == 2){
          //  如果是 篮球赛事
          basketball_data = data.up
        }
        no_data = false
      } else {
        no_data = true
      }
    } catch (error) {
      no_data = true
      console.error(error);
    }
  }
  // 过滤 首发阵容的最后一位数字 和  首发阵容的队列数字
  const filter_numbers = (data) => {
    if(!data ) return
    number = data.slice(-1)
    number_columns = data.split('-').join('').slice(0,-1)
    let [number1, number2] = [+number_columns[0], +number_columns[1]]
    if(number_columns.length == 2){
      football_filtered_data = [{},{}]
      football_filtered_data[0].data = line_up_data.up.slice(1, number1 + 1)
      football_filtered_data[1].data = line_up_data.up.slice(number1 + 1, number1 + number2 + 1)
    }else if(number_columns.length == 3){
      football_filtered_data = [{},{},{}]
      let [number3] = [+number_columns[2]]
      football_filtered_data[0].data = line_up_data.up.slice(1, number1+1)
      football_filtered_data[1].data = line_up_data.up.slice(number1 + 1, number1 + number2 + 1)
      football_filtered_data[2].data = line_up_data.up.slice(number1 + number2 + 1, number1 + number2 + number3 + 1)
    }
  }
  // 刷新 当前赛事分析信息
  const refresh_match_analysis = () => {
    const clone_radio_button_index = radio_button_index
    radio_button_index = -1

    nextTick(() => {
      radioButton(tab_radio_button[clone_radio_button_index], clone_radio_button_index)
    })
  }
  onUnmounted(() => {
     //   // 移除监听 赛事分析刷新事件 TODO: 后续修改调整
  //   $root.$off(emit_cmd.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis)

  //   for (const key in $data) {
  //     $data[key] = null
  //   }
  })
</script>

<style lang="scss" scoped>
@import "../styles/line-up.scss"
</style>
