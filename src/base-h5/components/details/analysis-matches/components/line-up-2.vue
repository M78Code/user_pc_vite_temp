<!--
 * @Author:
 * @Date:
 * @Description: 详情页 或者 赛果  篮球足球公共组件，阵容tab页面
-->
<template>
  <div class="line-up">

    <!--  足球背景图片 -->
    <div class="football_field" v-if="detail_data.csid == 1" >
      <!-- 球队名和队长 -->
      <div class="home-team-top">
        <!-- 球队和icon -->
        <div class="icon-name">
          <team-img
          v-if="!lodash.isEmpty(detail_data)"
          :type="0"
          :csid="detail_data.csid"
          :url="lodash.get(detail_data,'mhlu[0]')"
          :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frmhn[0]') : detail_data.frmhn"
          :size="44"
        ></team-img>
          <span>
            {{detail_data.mhn}}
            <span>{{ line_up_data_home.homeFormation }}</span>
          </span>
        </div>
        <!-- 名字 -->
        <div>
        </div>
      </div>
      <!-- 无首发数据 -->
      <div v-if="lodash.get(line_up_data_home, 'up.length') <= 0 && lodash.get(line_up_data_away, 'up.length') <= 0" class="not-data-starter">{{ i18n_t('app_h5.detail.not_data_starter') }}</div>
      <template v-else>
        <!-- 加载第一项 和 最后一项 -->
        <div class="home-team">
          <template v-for="(item, i) in line_up_data_home.up" :key="i+'f_l'">
          <div class="first_and_last"          
            :class="[
              `location${item.position}`,
              (number == 3 && item.position > 8) ? calculatelast(item) : '',
              (number == 2 && item.position > 9) ? calculatelast(item) : '',
              (number == 1 && item.position > 10 && item.position <=11) ? calculatelast(item) : '',
            ]"       
            v-if="((number == 3 && item.position > 8) || item.position == 1 || (number == 2 && item.position > 9) ||
            (number == 1 && item.position > 10)) && item.position<=11"
            
          >
            <div>
              <span>{{ item.shirtNumber || 0 }}</span>
            </div>
            <span class="ellipsis">{{ item.thirdPlayerName }}</span>
          </div>
        </template>
        <!--  加载中间的内容  -->
        <!-- 主队 -->
        <!--  如果首发阵容是两列，前面有两列 比如 4-2-4 -->
        <template v-if="number_columns.length == 2">
          <div class="two_columns four-two-four"
              v-for="(list, index) in football_filtered_data_home" :key="index+'middle'"
              :class="[
                list.data.length == 5 && calculation_radian(index) && 'five_columns',
                'two_columns-'+ index
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
          <div :class="'two_columns-'+ index "
              class="two_columns"
              v-for="(list, index) in football_filtered_data_home" :key="index"
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
        <!-- 客队 -->
        <div class="away-team">
          <template v-for="(item, i) in line_up_data_away.up" :key="i+'f_l'">
          <div class="first_and_last"          
            :class="[
              `location${item.position}`,
              (number == 3 && item.position > 8) ? calculatelast(item) : '',
              (number == 2 && item.position > 9) ? calculatelast(item) : '',
              (number == 1 && item.position > 10 && item.position <=11) ? calculatelast(item) : '',
            ]"       
            v-if="((number == 3 && item.position > 8) || item.position == 1 || (number == 2 && item.position > 9) ||
            (number == 1 && item.position > 10)) && item.position<=11"
            
          >
            <div>
              <span>{{ item.shirtNumber || 0 }}</span>
            </div>
            <span class="ellipsis">{{ item.thirdPlayerName }}</span>
          </div>
        </template>
        <!--  加载中间的内容  -->
        <!-- 客队 -->
        <!--  如果首发阵容是两列，前面有两列 比如 4-2-4 -->
        <template v-if="number_columns.length == 2">
          <div class="two_columns four-two-four"             
          v-for="(list, index) in football_filtered_data_away" :key="index+'middle'"
              :class="[
                list.data.length == 5 && calculation_radian(index) && 'five_columns',
                'two_columns-'+ index
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
          :class="'two_columns-'+ index "
              v-for="(list, index) in football_filtered_data_away" :key="index"
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
      </template>
      
      <!-- 球队名和队长 -->
      <div class="away-team-top">
        <!-- 球队和icon -->
        <div class="icon-name">
          <team-img
          v-if="!lodash.isEmpty(detail_data)"
          :type="0"
          :csid="detail_data.csid"
          :url="lodash.get(detail_data,'malu[0]')"
          :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frmhn[0]') : detail_data.frmhn"
          :size="44"
        ></team-img>
          <span>
            {{detail_data.man}}
            <span>{{ line_up_data_away.awayFormation }}</span>
          </span>
        </div>
        <!-- 名字 -->
        <div>
        </div>
      </div>
    </div>
    <!--  篮球背景图片 -->
    <div class="basket-ball-field" v-if="detail_data.csid == 2">
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
    <!--  首发阵容，替补阵容 伤停阵容-->
    <template v-if="!no_data">
      <!-- 首发名单-->
      <div class="title title-border" v-if="lodash.isEmpty(detail_data)">
        {{i18n_t('analysis_football_matches.starting_lineup') }}
      </div>
      <div class="public_form football_standings" v-if="lodash.isEmpty(detail_data)">
        <!-- 头部 -->
        <div class="header">
          <div>
            <team-img
              v-if="!lodash.isEmpty(detail_data)"
              :type="0"
              :csid="detail_data.csid"
              :url="lodash.get(detail_data,'mhlu[0]')"
              :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frmhn[0]') : detail_data.frmhn"
              :size="44"
            ></team-img>
            <span>{{detail_data.man}}</span>
          </div>
          <div>
            <team-img
              v-if="!lodash.isEmpty(detail_data)"
              :type="0"
              :csid="detail_data.csid"
              :url="lodash.get(detail_data,'malu[0]')"
              :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frmhn[0]') : detail_data.frmhn"
              :size="44"
            ></team-img>
            <span>{{detail_data.mhn}}</span>
          </div>
        </div>
        <!-- 主内容 -->
        <div class="content-item">
            <!-- 主队 -->
          <div class="home-team-item">
            <div class="team-item" v-for="(item, i) in line_up_data_home.up" :key="i+'a'">
              <div class="col1">
                <!-- 联赛icon -->
                <img class="match_logo"
                    :src=" item.thirdPlayerPicUrl ? get_server_file_path(item.thirdPlayerPicUrl) : default_url"
                    @error="league_icon_error"
                />
              </div>
              <div class="name-position">
                <div class="col3 ellipsis">
                  <template v-if="UserCtr.lang == 'en'">&ensp;</template>
                  {{ (item.thirdPlayerName.length > 6 ? item.thirdPlayerName.slice(0, 6) + '...' : item.thirdPlayerName) || '-' }}
                </div>
                <div class="col2">{{ item.positionName || '-' }}</div>
              </div>
              <div class="col4 end-btn">
                <span>{{ item.shirtNumber }}</span>
              </div>
              
            </div>
          </div>
          <!-- 客队 -->
          <div class="away-team-item">
            <div class="team-item" v-for="(item, i) in line_up_data_away.up" :key="i+'a'">
              <div class="col1">
                <!-- 联赛icon -->
                <img class="match_logo"
                    :src=" item.thirdPlayerPicUrl ? get_server_file_path(item.thirdPlayerPicUrl) : default_url"
                    @error="league_icon_error"
                />
              </div>
              <div class="name-position">
                <div class="col3 ellipsis">
                  <template v-if="UserCtr.lang == 'en'">&ensp;</template>
                  {{ (item.thirdPlayerName.length > 6 ? item.thirdPlayerName.slice(0, 6) + '...' : item.thirdPlayerName) || '-' }}
                </div>
                <div class="col2">{{ item.positionName || '-' }}</div>
              </div>
              <div class="col4 end-btn">
                <span>{{ item.shirtNumber }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 没有数据 组件 TODO: 待处理-->
        <div v-if="lodash.get(line_up_data_home, 'up.length') <= 0 && lodash.get(line_up_data_away, 'up.length') <= 0" class="no-list">{{ i18n_t('common.no_data') }}</div>
      </div>
      <!-- 替补名单-->
      <div class="title title-border">
        <span>{{i18n_t('analysis_football_matches.bench_lineup') }}</span>
      </div>
      <div class="public_form football_standings">
        <!-- 没有数据 组件 -->
        <div v-if="lodash.get(line_up_data_home, 'down.length') <= 0 && lodash.get(line_up_data_away, 'down.length') <= 0" class="no-list">
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/def_common.svg`" alt="">
          {{ i18n_t('app_h5.detail.not_data_substitute') }}
        </div>
        <template v-else>
          <div class="line-down-wrap">
            <div class="team-home item">
              <!-- 主队头部 -->
              <div class="header">
                <div>
                  <team-img
                    v-if="!lodash.isEmpty(detail_data)"
                    :type="0"
                    :csid="detail_data.csid"
                    :url="lodash.get(detail_data,'malu[0]')"
                    :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frmhn[0]') : detail_data.frmhn"
                    :size="44"
                  ></team-img>
                  <span>{{detail_data.man}}</span>
                </div>
              </div>
              <!-- 主队替补名单列表 -->
              <div class="team-item" v-for="(item, i) in line_up_data_away.down" :key="i+'b'">
                <div class="col1">
                  <!-- 联赛icon -->
                  <img class="match_logo"
                      :src=" item.thirdPlayerPicUrl ? get_server_file_path(item.thirdPlayerPicUrl) : default_url"
                      @error="league_icon_error"
                  />
                </div>
                <div class="content">
                  <div class="position-name">{{ item.positionName || '-' }}</div>
                  <div class="player-name ellipsis">
                    {{ item.thirdPlayerName}}
                  </div>
                </div>
                <div class="col4 end-btn">
                  <span>{{ item.shirtNumber }}</span>
                </div>
              </div>

            </div>
            <!-- 分隔线 -->
            <div class="separate"></div>
            <div class="team-away item">
              <!-- 客队头部 -->
              <div class="header">
                <div>
                  <team-img
                    v-if="!lodash.isEmpty(detail_data)"
                    :type="0"
                    :csid="detail_data.csid"
                    :url="lodash.get(detail_data,'mhlu[0]')"
                    :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frmhn[0]') : detail_data.frmhn"
                    :size="44"
                  ></team-img>
                  <span>{{detail_data.mhn}}</span>
                </div>
              </div>
              <!-- 客队替补名单列表 -->
              <div class="team-item" v-for="(item, i) in line_up_data_away.down" :key="i+'b'">
                <div class="col1">
                  <!-- 联赛icon -->
                  <img class="match_logo"
                      :src=" item.thirdPlayerPicUrl ? get_server_file_path(item.thirdPlayerPicUrl) : default_url"
                      @error="league_icon_error"
                  />
                </div>
                <div class="content">
                  <div class="position-name">{{ item.positionName || '-' }}</div>
                  <div class="player-name ellipsis">
                    {{ item.thirdPlayerName}}
                  </div>
                </div>
                <div class="col4 end-btn">
                  <span>{{ item.shirtNumber }}</span>
                </div>
              </div>
              
            </div>
          </div>
          
          <!-- 主内容 -->
          {{ console.log("-------------------------------------line-up-2.vue",line_up_data_home,line_up_data_away)}}
          
        </template>
        
        
      </div>
      <!-- 伤停名单-->
      <div class="title title-border">
        <span>{{i18n_t('analysis_football_matches.Injury_situation') }}</span>
      </div>
      
        
      <div class="public_form football_standings">
        <!-- 没有数据 组件 -->
      <div v-if="Object.keys(injury_situation_data).length <= 0" class="no-list">
          <img :src="`${LOCAL_PROJECT_FILE_PREFIX}/image/png/def_common.svg`" alt="">
          {{ i18n_t('app_h5.detail.not_data_Injury') }}
        </div>
        <template v-else>
           <!-- 头部 -->
          <div class="header">
          <div>
            <team-img
              v-if="!lodash.isEmpty(detail_data)"
              :type="0"
              :csid="detail_data.csid"
              :url="lodash.get(detail_data,'malu[0]')"
              :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frmhn[0]') : detail_data.frmhn"
              :size="44"
            ></team-img>
            <span>{{detail_data.man}}</span>
          </div>
          <div>
            <team-img
              v-if="!lodash.isEmpty(detail_data)"
              :type="0"
              :csid="detail_data.csid"
              :url="lodash.get(detail_data,'mhlu[0]')"
              :fr="MenuData.get_menu_type() != 3000 ? lodash.get(detail_data,'frmhn[0]') : detail_data.frmhn"
              :size="44"
            ></team-img>
            <span>{{detail_data.mhn}}</span>
          </div>
          </div>
        <!-- 主内容 -->
        <div class="content-item">
            <!-- 主队 -->
          <div class="home-team-item">
            <div class="team-item" v-for="(item, i) in injury_situation_data['1']" :key="i+'a'">
              <div class="col1">
                <!-- 联赛icon -->
                <img class="match_logo"
                    :src=" item.thirdPlayerPicUrl ? get_server_file_path(item.thirdPlayerPicUrl) : default_url"
                    @error="league_icon_error"
                />
              </div>
              <div class="name-position">
                <div class="col3 ellipsis">
                  <template v-if="UserCtr.lang == 'en'">&ensp;</template>
                  {{ (item.playerName.length > 6 ? item.playerName.slice(0, 6) + '...' : item.playerName) || '-' }}
                </div>
                <div class="col2">{{ item.positionName || '-' }}</div>
              </div>
              <div class="col4 end-btn">
                <span>{{ item.shirtNumber }}</span>
              </div>
              
            </div>
          </div>
          <!-- 客队 -->
          <div class="away-team-item">
            <div class="team-item" v-for="(item, i) in injury_situation_data['2']" :key="i+'a'">
              <div class="col1">
                <!-- 联赛icon -->
                <img class="match_logo"
                    :src=" item.thirdPlayerPicUrl ? get_server_file_path(item.thirdPlayerPicUrl) : default_url"
                    @error="league_icon_error"
                />
              </div>
              <div class="name-position">
                <div class="col3 ellipsis">
                  <template v-if="UserCtr.lang == 'en'">&ensp;</template>
                  {{ (item.playerName.length > 6 ? item.playerName.slice(0, 6) + '...' : item.playerName) || '-' }}
                </div>
                <div class="col2">{{ item.positionName || '-' }}</div>
              </div>
              <div class="col4 end-btn">
                <span>{{ item.shirtNumber }}</span>
              </div>
            </div>
          </div>
        </div>
        </template>
      </div>

    </template>
  </div>
</template>

<script setup>
import TeamImg from "src/base-h5/components/details/team-img.vue";   // 详情页蓝色背景上的大型字母图标
import { api_analysis } from "src/api/index.js";
import { ref, computed, nextTick, onUnmounted, onMounted } from "vue";
import {useMittOn, useMittEmit, MITT_TYPES} from  "src/core/mitt/"
import { useRoute } from 'vue-router'
import { i18n_t } from "src/boot/i18n.js";
import { get_server_file_path } from "src/core/file-path/file-path.js"
import UserCtr from "src/core/user-config/user-ctr.js";
import lodash from "lodash"
import { LOCAL_PROJECT_FILE_PREFIX, MenuData } from "src/output/index.js"

//国际化


// TODO: 后续修改调整
// import {mapGetters} from "vuex";
  const props = defineProps({
    detail_data: {
      type: Object,
      default: () => {}
    }
  })
  // 列表数据
  //主队首发
  const line_up_data_home = ref({
    down: [],
    up: [],
  })
  // 客队首发
  const line_up_data_away = ref({
    down: [],
    up: [],
  })
  // 伤停信息
  const injury_situation_data = ref({})
  const no_data = ref(true)
  //默认图片地址
  const default_url = (`${LOCAL_PROJECT_FILE_PREFIX}/image/png/my.png`)
  // 最后一位数
  const number = ref('')
  // 代表多少列 并且里边的数字
  const number_columns = ref([])
  // 主队
  const football_filtered_data_home = ref([
    {data:[]},
    // {data:[]},
  ])
  // 客队
  const football_filtered_data_away = ref([
    {data:[]},
    // {data:[]},
  ])
  // 篮球的 背景图的 数据
  const basketball_data = ref([])
  // 页面主题色
  const route = useRoute()
  onMounted(() => {
    //  添加监听 赛事分析刷新事件 
  useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis)
  // 触发两次接口获取主客队信息  1主2客
  get_list(1)
  get_list(2)
  // 伤停接口
  get_data_list()
  })

  const match_id = computed(() => {
    // 赛事id
    return route.params.mid || props.detail_data.mid
  })
  // computed: {
  //   ...mapGetters(["get_goto_detail_matchid",]),
  // },
  // 当首发阵容 有数值是5列的时候，
  const calculation_radian = (index) => {
    return `five_columns${index + 1 }`
  }
  const calculatelast = (item) => {
    let how_many_bits
    if(number.value == 1) {
      how_many_bits = 'how_many_bits1'
    }else if(number.value == 2){
      how_many_bits = 'how_many_bits2'
    }else if(number.value == 3){
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
  // 获取主客队信息
  const get_list = async (index = 1) => {
    no_data.value = true
    try {
      let parameter = {
        // 2079863足球测试id  2185843篮球测试id
        matchInfoId: match_id.value,
        // 主客队标识(1主队，2客队)
        homeAway: index
      }
      let {code , data} = await api_analysis.get_match_lineup_list(parameter)
      if(code == 200 && Object.keys(data).length > 0) {
        // 如果是足球赛事
        if(props.detail_data.csid == 1){
          if(index == 1){
            line_up_data_home.value = data
            filter_numbers(data.homeFormation, index)
          }else{
            line_up_data_away.value = data
            filter_numbers(data.awayFormation, index)
          }
        }else if(props.detail_data.csid == 2){
          //  如果是 篮球赛事
          basketball_data.value = data.up
        }
        no_data.value = false
      } else {
        no_data.value = true
      }
    } catch (error) {
      no_data.value = true
      console.error(error);
    }
  }
  // 获取伤停数据
  const get_data_list = async () => {
      try {
        // sonMenuId： 旧版 基本面是1 
        let parameter = {
          // standardMatchId: match_id.value, //2274159, //2274159 ,//2079863足球测试id
          standardMatchId: 2385166,
          parentMenuId: 2,
          sonMenuId: 1
        }
        let {code , data} = await api_analysis.get_match_analysise_data(parameter)
        // if(code == 200 && Object.keys(data).length > 0) {
          injury_situation_data.value = await lodash.get(data, 'basicInfoMap.sThirdMatchSidelinedDTOMap', {
    // "1": [
    //   {
    //     "homeAway": 1,
    //     "playerName": "朱利安·杜兰维尔",
    //     "positionName": "前锋",
    //     "reason": "肌肉损伤",
    //     "shirtNumber": 3
    //   },
    //   {
    //     "homeAway": 1,
    //     "playerName": "tom",
    //     "positionName": "前锋",
    //     "reason": "肌肉损伤",
    //     "shirtNumber": 8
    //   },
    //   {
    //     "homeAway": 1,
    //     "playerName": "babay",
    //     "positionName": "前锋",
    //     "reason": "肌肉损伤",
    //     "shirtNumber": 13
    //   },
    //   {
    //     "homeAway": 1,
    //     "playerName": "cats",
    //     "positionName": "前锋",
    //     "reason": "肌肉损伤",
    //     "shirtNumber": 31
    //   },
    //   {
    //     "homeAway": 1,
    //     "playerName": "gayer",
    //     "positionName": "前锋",
    //     "reason": "肌肉损伤",
    //     "shirtNumber": 21
    //   },
    //   {
    //     "homeAway": 1,
    //     "playerName": "C罗",
    //     "positionName": "前锋",
    //     "reason": "肌肉损伤",
    //     "shirtNumber": 7
    //   },
    // ],
    // "2": [{
    //     "homeAway": 2,
    //     "playerName": "亚历山大-伊萨克",
    //     "positionName": "前锋",
    //     "reason": "腹股沟受伤",
    //     "shirtNumber": 15
    // },
    // {
    //     "homeAway": 2,
    //     "playerName": "哈维-巴恩斯",
    //     "positionName": "中场",
    //     "reason": "脚趾受伤",
    //     "shirtNumber": 5
    // },
    // {
    //     "homeAway": 2,
    //     "playerName": "博特曼-斯文",
    //     "positionName": "后卫",
    //     "reason": "膝伤",
    //     "shirtNumber": 17
    // },
    // {
    //     "homeAway": 2,
    //     "playerName": "埃利奥特安德森",
    //     "positionName": "中场",
    //     "reason": "背部受伤",
    //     "shirtNumber": 18
    // },
    // {
    //     "homeAway": 2,
    //     "playerName": "马特-塔吉特",
    //     "positionName": "后卫",
    //     "reason": "腿筋拉伤",
    //     "shirtNumber": 32
    // },
    // {
    //     "homeAway": 2,
    //     "playerName": "哈维尔-曼奎洛",
    //     "positionName": "后卫",
    //     "reason": "腹股沟受伤",
    //     "shirtNumber": 2
    // }]
})
        // }
      } catch (error) {
        console.error(error);
      }
    }
  // 过滤 首发阵容的最后一位数字 和  首发阵容的队列数字
  const filter_numbers = (data, index) => {
    if(!data ) return
    number.value = data.slice(-1)
    number_columns.value = data.split('-').join('').slice(0,-1)
    let [number1, number2] = [+number_columns.value[0], +number_columns.value[1]]
    if(number_columns.value.length == 2){
      if (index == 1) {
        // 主队
        football_filtered_data_home.value = [{},{}]
        football_filtered_data_home.value[0].data = line_up_data_home.value.up.slice(1, number1 + 1)
        football_filtered_data_home.value[1].data = line_up_data_home.value.up.slice(number1 + 1, number1 + number2 + 1)
      } else {
        // 客队
        football_filtered_data_away.value = [{},{}]
        football_filtered_data_away.value[0].data = line_up_data_away.value.up.slice(1, number1 + 1)
        football_filtered_data_away.value[1].data = line_up_data_away.value.up.slice(number1 + 1, number1 + number2 + 1)
      }
      

      
    }else if(number_columns.value.length == 3){
      let [number3] = [+number_columns.value[2]]
      if (index == 1) {
        // 主队
        football_filtered_data_home.value = [{},{},{}]
        football_filtered_data_home.value[0].data = line_up_data_home.value.up.slice(1, number1+1)
        football_filtered_data_home.value[1].data = line_up_data_home.value.up.slice(number1 + 1, number1 + number2 + 1)
        football_filtered_data_home.value[2].data = line_up_data_home.value.up.slice(number1 + number2 + 1, number1 + number2 + number3 + 1)
      } else {
        // 客队
        football_filtered_data_away.value = [{},{},{}]
        football_filtered_data_away.value[0].data = line_up_data_away.value.up.slice(1, number1+1)
        football_filtered_data_away.value[1].data = line_up_data_away.value.up.slice(number1 + 1, number1 + number2 + 1)
        football_filtered_data_away.value[2].data = line_up_data_away.value.up.slice(number1 + number2 + 1, number1 + number2 + number3 + 1)
      }
      

      
    }
  }
  // 刷新 当前赛事分析信息
  const refresh_match_analysis = () => {
    get_list(1) // 传 1 是主队
    get_list(2) // 传 2 客队
    get_data_list()
  }
  onUnmounted(() => {
     //   // 移除监听 赛事分析刷新事件 TODO: 后续修改调整
    useMittOn(MITT_TYPES.EMIT_REFRESH_MATCH_ANALYSIS, refresh_match_analysis).off

  //   for (const key in $data) {
  //     $data[key] = null
  //   }
  })
</script>

<style lang="scss" scoped>
@import "../styles/line-up-list.scss";
.line-up{
  position: sticky;
  top: 0.44rem;
  z-index: 80;
  padding: 0 0.05rem;
  .icon-name {
    display: flex;
    align-items: center;
    justify-content: center;
    
  }
  .icon-name, .header {
    :deep(.team-img) {
      height: 0.24rem;
      width: 0.24rem;
      margin: 0 0.08rem 0 0;
      .img-style {
        height: 0.24rem;
        width: 0.24rem;
      }
    } 
  }
  .public_form {
    .header {
      display: flex;
      align-items: center;
      border-bottom: none;
      & > div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color:var(--q-gb-t-c-20);
        font-size: 0.12rem;
        &:first-child {
          // border-right: 0.005rem solid #f2f2f6;
          padding-right: 0;
        }
        &:nth-child(2) {
          padding-left: 0.02rem;
        }
      }
    }
    .content-item {
      display: flex;
      align-items: center;
      padding: 0 0.08rem 0.08rem;
      .home-team-item {
        padding-right: 0.08rem;
        border-right: 0.005rem solid #f2f2f6;
      }
      .away-team-item {
        padding-left: 0.08rem;
      }
      & > div {
        width: 50%;
        .team-item {
          justify-content: space-between;
          background-color: var(--q-gb-bg-c-18);
          border-radius: 0.04rem;
          margin-top: 0.06rem;
          & > div:first-child {
            width: 0.32rem;
            height: 0.32rem;
            background-color: #ffffff;
            border-radius: 50%;
            flex: unset;
            margin-right: 0.04rem;
            img {
              width: 100%;
              height: 100%;
            }
          }
          // // &:nth-child(2) {
          // //   flex: 3;
          // // }
          & > div:nth-child(3) {
            justify-content: flex-end;
            color:var(--q-gb-t-c-1);
          }
        }
        
        .name-position {
          display: block;
          text-align: left;
          div {
            justify-content: flex-start;
            &:last-child {
              font-size: 0.1rem;
              color: var(--q-gb-t-c-18);
            }
          }
        }
      }
    }
    .no-list {
      display: grid;
      align-items: center;
      justify-content: center;
      height: 2.5rem;
      color:var(--q-gb-t-c-19);
      img {
        width: 1.8rem;
        height: 1.8rem;

      }
    }
  }
  .football_field {
    height: 7.37rem;
    padding-top: 0;
    padding-bottom: 0;
    .not-data-starter {
      width: 100%;
      height: 0.5rem;
      color:var(--q-gb-t-c-14);
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(270deg, rgba(57, 80, 20, 0.00) 0%, rgba(57, 80, 20, 0.92) 34.58%, rgba(57, 80, 20, 0.92) 65.24%, rgba(57, 80, 20, 0.00) 100%);
    }
    .referee {
      color:var(--q-gb-t-c-14);
      opacity: 0.7194;
      position: absolute;
      top: 0.47rem;
      left: 0.4rem;
    }
    .home-team-top, .away-team-top {
      color:var(--q-gb-t-c-14);
      width: 100%;
      font-size: 0.12rem;
      font-weight: 400;
      padding: 0.08rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      
    }
    .home-team-top {
      top: 0;
    } 
    .away-team-top {
      bottom: 0;
    }
    .home-team {
      width: 100%;
      .first_and_last.location1 {
        top: 0.8rem;
      }
      .two_columns {
        position: absolute;        
      }
      .two_columns-0 {
          top: 1.35rem;
      }
      .two_columns-1 {
          top: 1.9rem;
      }
      .four-two-four.two_columns-1 {
        top: 2.25rem;
      }
      .two_columns-2 {
          top: 2.4rem;
      }
      // 424
      .first_and_last.location10.how_many_bits2 {
        left: 24%;
      }
      .first_and_last.location11.how_many_bits2 {
        left: 61%;
      }
      .first_and_last.location10.how_many_bits2,
      .first_and_last.location11.how_many_bits2 {
        bottom: 3.8rem;
      }
      //4321
      .first_and_last.location11.how_many_bits1 {
        bottom: 4rem;
        left: 33.9%;
      }
    }
    .away-team {
      width: 100%;
      .first_and_last.location1 {
        bottom: 0.8rem;
        top: unset;
      }
      .two_columns {
        position: absolute;        
      }
      .two_columns-0 {
          bottom: 1.4rem;
      }
      .two_columns-1 {
          bottom: 1.9rem;
      }
      .four-two-four.two_columns-1 {
        top: 2.25rem;
      }
      .two_columns-2 {
          bottom: 2.4rem;
      }
      // 424
      .first_and_last.location10.how_many_bits2 {
        left: 24%;
      }
      .first_and_last.location11.how_many_bits2 {
        left: 61%;
      }
      .first_and_last.location10.how_many_bits2,
      .first_and_last.location11.how_many_bits2 {
        top: 3.8rem;
        margin: unset;
      }
      // 4321
      .first_and_last.location11.how_many_bits1 {
        bottom: 2.8rem;
        top: unset;
        left: 33.9%;
      }
    }
  }
  .football_field {
    .first_and_last > div {
      background: url($SCSSPROJECTPATH+"/image/svg/home-team.svg") no-repeat center !important;
      border: unset;
      position: relative;
      & > span {
        font-size: 0.1rem;
        width: 0.16rem;
        height: 0.16rem;
        border-radius: 8px;
        color:var(--q-gb-t-c-14);
        background: rgba(0, 0, 0, 0.40);
        position: absolute;
        bottom: 0.02rem;
        left: 0.20rem;
      }
    }
  }
  .basket-ball-field {
    height: 6.28rem;
  }
}
.header {
  // z-index:99999 !important;
  top:0.8rem !important;
}
.line-up{
  .line-down-wrap{
    display: flex;
    padding: 0 0.08rem;
    .separate{
      width: .5px;
      margin: 0 0.04rem;
      background-color: var(--q-gb-bg-c-18); //#TODO
    }
    .item{
      flex: 1;
      .team-item{
        background-color: var(--q-gb-bg-c-18);
        padding-right: 0.08rem;
        border-radius: .04rem;
        margin-bottom: 0.06rem;
        .content{
          flex: 10;
          display: flex;
          flex-direction: column-reverse;
          align-items: flex-start;
          width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          .player-name{
            width: 100%;
            text-align: left;
            font-size: 0.12rem;
            color:var(--q-gb-t-c-20); //#TODO: css var
          }
          .position-name{
            font-size: 0.10rem;
            color:var(--q-gb-t-c-19); //#TODO: css var
          }
        }

        .end-btn{
          color:var(--q-gb-t-c-1); //#TODO: css var
          justify-content: flex-end;
          text-align: right;
          width: 0.21rem;
        }
      }
    }
  }
}
.title-border{
  border-bottom: 1px solid var(--q-gb-bd-c-4);
}
</style>
