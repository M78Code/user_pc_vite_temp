<!--
 * @Author: Router
 * @Date: 2020-08-20 18:35:53
 * @Description: 棒球赛事的细节比分展示
-->
<template>
  <div class='score-child-3 yb_ml12 yb_mr18 font-style row justify-between' v-if="detail_data.mmp != '0'">
    <!-- 坏球 好球 出局 上垒 -->
    <div :class="['col-7', 'row', 'items-center']">
      <div class="baseball-poi-w">
        <!--二垒-->
        <div class="poi" :class="{p:detail_data.mbtlp == 1}"></div>
        <!--一垒-->
        <div class="poi" :class="{p:detail_data.mbolp == 1}"></div>
        <!--三垒-->
        <div class="poi" :class="{p:detail_data.mbthlp == 1}"></div>
      </div>
      <div>&nbsp;
        {{i18n_t('match_info.ball')}}:<span class="score-l">{{detail_data.mbkn}}</span>&ensp;
        {{i18n_t('match_info.strike')}}:<span class="score-l">{{detail_data.mbhn}}</span>&ensp;
        {{i18n_t('match_info.strike_out')}}:<span class="score-l">{{detail_data.mbcn}}</span>&ensp;
      </div>
    </div>
    <!-- 每局的比分 -->
    <div :class="['col-5',score_array.length >=7 ? 'ms-r':'']">
      <div class="menu-s" @touchmove="touch_move($event)">
        <span v-for="(item, key) of score_array" :key="key" :ref="`score_${key}`" :class="[mmp_arr.includes(detail_data.mmp)&&(score_array.length == key + 1)?'half-s':'']">
          <!-- 棒球客队先进攻，客队先得分  只有一个数字的时候，是客队的得分。下半局是主队进攻，才是主队得分，主队的分在前面 -->
          <template v-if="mmp_arr.includes(detail_data.mmp) && score_array.length == key+1"><span :class="{'active-text': (score_array.length == key + 1 && detail_data.mo != 1)}">{{item.split(':')[1]}}</span> </template>
          <template v-else><span :class="{'active-text': (score_array.length == key + 1&&detail_data.mo != 1)}">{{item.split(':')[0]}}</span>-{{item.split(':')[1]}}</template>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from "vuex"
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
export default {
  name: 'score_child_3',
  data() {
    return {
      // 棒球比分集合
      msc_array: [],
      //详情页显示为上半局需要显示箭头的阶段
      mmp_arr: ['401', '422', '403', '424', '405', '426', '407', '428', '409', '430', '411', '432', '413', '434', '415', '436', '417', '43910', '43810', '41911', '43811', '41912',
        '43812', '41913', '43813', '41914', '43814', '41915', '43815', '41916', '43816', '41917', '43817', '41918', '43818', '41919', '43819', '41920'],
      //根据赛事阶段mmp填充比分  比如 当 mmp是424 "第二，三局间休息" 时，要将第三局比分'S122'自动填充
      //填充的比分只是临时有效，并没有存到持久化里面，所以页面刷新后也要判断处理一遍
      mmp_obj: {
        //默认9局
        '401': 'S120',
        '422': 'S121',
        '424': 'S122',
        '426': 'S123',
        '428': 'S124',
        '430': 'S125',
        '432': 'S126',
        '434': 'S127',
        '436': 'S128',
        //下面是加时赛阶段（这里写到第20局）
        '438': 'S129',
        '43810': 'S130',
        '43811': 'S131',
        '43812': 'S132',
        '43813': 'S132',
        '43814': 'S134',
        '43815': 'S135',
        '43816': 'S136',
        '43817': 'S137',
        '43818': 'S138',
        '43819': 'S139',
      }
    }
  },
  computed: {
    // ...mapGetters(['get_detail_msc_changed']),
    /**
     *@description 棒球比分集合
     *@return {Undefined} undefined
     */
    score_array() {
      return this.init_event();
    },
  },
  watch: {
    get_detail_msc_changed(curr) {
      this.init_event();
    },
    detail_data: {
      handler(n, o) {
        if (n.mmp in this.mmp_obj) {
          useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, `${this.mmp_obj[n.mmp]}|0:0`)
        }
        //mct根据这个确定第几局，第九局后如果推送了10就把第十局比分搞出来,等待加时时候，mct = 10，就追加第十局的比分，mct = 11就追加11局的比分，以此类推
        //mct变化不及时 这个逻辑有问题，先注掉
        // if (n.mct >= 10) {
        //   useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, `S${n.mct + 119}|0:0`)
        // }
      },
      deep: true,
    }
  },
  props: ['detail_data'],
  mounted() {
    //页面刷新后检查mmp的阶段，来判断是否需要填充比分
    this.$nextTick(() => {
      if(this.detail_data.mmp in this.mmp_obj){
        useMittEmit(MITT_TYPES.EMIT_SET_NATIVE_DETAIL_DATA, `${this.mmp_obj[this.detail_data.mmp]}|0:0`)
      }
    })
  },
  destroyed () {
    for (const key in this.$data) {
      this.$data[key] = null
    }
  },
  methods: {
    /**
     *@description 取出符合棒球阶段的比分 120(第一局比分)-159(第40局比分)
     *@return {Undefined} undefined
     */
    init_event() {
      for (let i = 120; i <= 159; i++) {
        this.msc_array.push(`S${i}`);
      }
      let msc = this.detail_data.msc;
      // let msc = ['S120|1:1', 'S120|3:5', 'S3011|2', 'S120|0:0', 'S121|0:0', 'S122|1:2', 'S123|0:2', 'S124|0:2', 'S125|0:2', 'S126|0:2'];
      // sortBy方法  比分升序排列 取出比分阶段后面的数字作为判断条件 返回是数组
      msc = lodash.sortBy(msc, (item) => {
        return +(item.split("|")[0]).substring(1)
      })
      let score_arr = [];
      // 循环只取出接口返回的比分里面符合棒球阶段的比分
      lodash.forEach(msc, (item, index) => {
        let num_index = item.split("|")[0]; // S120 S121 S122 S123 S124 S125 ...
        if (this.msc_array.includes(num_index)) {
          score_arr.push(item.split("|")[1]);
        }
      })
      return score_arr;
    },
    /**
     *@description 监听滚动事件，可能用不到先写着
     *@param {Object} evt 事件对象
     *@return {Undefined} undefined
     */
    touch_move(evt) {
    }
  }
}
</script>

<style lang="scss" scoped>
.font-style {
  font-size: 0.12rem;
  color: #FFFFFF;
  letter-spacing: 0;
  width:100%;
}

.active-text {
  color: #ffce63;
}

.menu-s {
  border-width: 0 4px;
  border-style: solid;
  border-color: transparent;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: auto;
  white-space: nowrap;

  & > span {
    padding-right: 0.09rem;
  }
}

// .score-l {
//   color: #D2B79C;
// }

// Bug: 52359
.score-l {
  color: var(--q-gb-t-c-1)
}

/* ************** 棒球垒位图标 ************** -S */
.baseball-poi-w {
  width: 0.14rem;
  height: 0.14rem;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  align-content: flex-start;
  transform: translateX(-0.02rem) translateY(0.04rem) rotateZ(45deg);

  .poi {
    width: 0.05rem;
    height: 0.05rem;
    margin: 0 1px 1px 0;
    flex-shrink: 0;
    background: #D8DBE6;

    &.p {
      background: var(--q-gb-t-c-25);
    }
  }
}

/* ************** 棒球垒位图标 ************** -E */
/* ************** 左右两边箭头 ************** -S */
.ms-r {
  position: relative;

  &:before, &:after {
    content: '';
    display: block;
    width: 0;
    border-width: 3px;
    border-style: solid;
    position: absolute;
    //top: 0.15rem;
    // Bug: 52641
    top: 0.06rem;
  }

  &:before {
    border-color: transparent #00D0D4 transparent transparent;
    left: -0.08rem;
  }

  &:after {
    border-color: transparent transparent transparent #00D0D4;
    right: -0.06rem;
  }
}

/* ************** 左右两边箭头 ************** -E */
/* ************** 白色三角形 ************** -S */
.half-s {
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 0;
    border-width: 0.09rem 0.03rem;
    border-style: solid;
    position: absolute;
    bottom: 0.03rem;
    right: 0;
    border-color: transparent transparent #FFFFFF transparent;
  }
}

/* ************** 白色三角形 ************** -E */
</style>
