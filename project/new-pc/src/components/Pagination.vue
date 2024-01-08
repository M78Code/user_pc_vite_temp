<!--
 * @Author: Cooper
 * @Date: 2023-06-29 17:13:55
 * @Description: 翻页功能
 * @params count(分页总数量)
 * @触发事件：pageChange(limit, offset, page) (每页显示数量,偏移量,当前页码)
-->
<template>
  <div>
    <div class="pagination-wrap" :style="results_table">
      <q-pagination v-model="current" color="basic" :max="max" size="sm" :max-pages="9" direction-links ellipses
        icon-prev="icon-triangle2" icon-next="icon-triangle3" />
      <div class="pagination-select">
        <q-select class="select" :class="{ 'select-page-input': icon_name == 'icon-triangle' }" outlined
          v-model="perPageNum" :options="perPageNumOptions" popup-content-style="border:1px solid #d0d8de;background:#fff"
          @popup-show="icon_name = 'icon-triangle'" @popup-hide="icon_name = 'icon-triangle1'">
          <template v-slot:option="scope">
            <div class="select-item" v-bind="scope.itemProps" v-on="scope.itemEvents">
              {{ scope.opt.value }}
            </div>
          </template>
          <!-- <template v-slot:append>
            <icon :name="icon_name" color="#99A3B1" size="14px" />
          </template> -->
        </q-select>
        <span style="color:#8A8986">
          {{ i18n_t('bet_record.pagination.np') }}
          <!-- 条/页 -->
        </span>
      </div>

      <div class="pagination-link">
        <span>
          {{ i18n_t('bet_record.pagination.go') }}
          <!-- 跳转至 -->
        </span>
        <input class="go-input" type="text" v-model="goPage" @blur="goToPage(goPage)" @keyup.enter="goToPage(goPage)" :max="max" />
        <span style="color:#8A8986">
          {{ i18n_t('bet_record.pagination.page') }}
          <!-- 页 -->
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import { defineComponent, ref, reactive, toRefs, onMounted, watch, computed, defineProps } from 'vue'
import { defineComponent, ref, reactive, toRefs, onMounted, watch, computed } from 'vue'
export default defineComponent({
  name: "CPagination",
  props: {
    // 当前列表数量
    count: {
      type: null,
    },
    effectiveFlow: {
      type: String,
      default: '',
    },
    recordType: {
      type: Number,
      default: 0,
    },
    random: {
      type: Number,
      default: 0,
    },
    toolSelected: {
      type: Number,
      default: 0,
    },
    is_bet_record: {
      type: Boolean,
      default: false,
    },
    results_table: {
      type: Object,
      default: ()=>{},
    },
    reset_pagination: {
      type: [ Number, String ],
      default: 1,
    },
    page: {
      type: Object,
      default: ()=>{},
    },
  },
  filters: {
    format_balance(num) {
  		if(num) {
  			let _split = num.toString().match(/^(-?\d+)(?:\.(\d{0,2}))?/)

  			// 保留两位小数
  			let decimal = _split[2] ? _split[2].padEnd(2, "0") : "00"

  			let _num = _split[1] + '.' + decimal
  			return _num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  		}
  		return '';
    },
  },
  setup(props, context) {
    const state = reactive({
      goPage: 1,
      pagination: {
        offset: 0, //偏移量
        limit: 50, //显示数量
      },
      perPageNumOptions: [
        {
          label: "50",
          value: 50,
        },
        {
          label: "100",
          value: 100,
        },
        {
          label: "150",
          value: 150,
        },
        {
          label: "200",
          value: 200,
        },
      ],
      pageChangeFlag: false,
      current: 1,
      icon_name: "icon-triangle1",
    })
    // 监听页码变化
    watch(() => state.current, (newVal) => {
      context.emit('pageChange', {
        ...state,
        current: newVal || 1
      })
    })
    watch(() => props.reset_pagination, (newVal) => {
      if(newVal == 1) {
        state.current = 1;
      }
    })


    const perPageNum = computed({
      get: function () {
      //如果父组件传递页面长度来则接受
        if (props.page){
          return props.page.size;
        }else {
          return state.pagination.limit;
        }
      },
      set: function (val) {
        context.emit('pageSizeChange', val)
        if (val !== perPageNum) {
          state.pagination.limit = val.value;
          // 进行每页显示数量切换时，判断当前偏移量是否大于改变后的偏移量，如果是，则不触发limit改变的事件，因为偏移量的改变也会触发
          if (
            state.pagination.offset >
            Math.floor(state.pagination.offset / val) * val
          ) {
            state.pageChangeFlag = true;
          }
        }
      }
    })
    const max = computed(() => {
      return Math.ceil(props.count / perPageNum.value);
    })

    const goToPage = (v) => {
      let num = Math.ceil(props.count / perPageNum.value)
      if(v<=num){
      state.current = +v || 1
      state.goPage = +v || 1
      context.emit('goPageChange',  +v || 1)
      }
      else{
        state.goPage = state.current
      }
   
    }

    onMounted(() => {
    })
    return {
      ...toRefs(state),
      perPageNum,
      goToPage,
      // page,
      max,
      
    }
  }


  //   /**
  //    * @切换记录改变偏移量
  //    */
  //   recordType(val) {
  //     this.pagination.offset = 0;
  //   },

  //   /**
  //    * @查询时间切换改变偏移量
  //    * 今天 、昨日 、七日内、一月内
  //    */
  //   random(val) {
  //     this.pagination.offset = 0;
  //   },

  //   /**
  //    * @赛果页面切换球种改变偏移量
  //    */
  //   reset_pagination: {
  //     handler(res) {
  //       this.pagination.offset = 0;
  //     },
  //     immediate: true,
  //   },
  // },

  // computed: {
  //    ...mapGetters({
  //     lang: "get_lang"
  //   }),
  //   page: {
  //     get: function () {
  //       if (this.count === 0) {
  //         return 0;
  //       }
  //       // 偏移量/每页显示数量 向下取整 + 1
  //       return Math.floor(this.pagination.offset / this.pagination.limit) + 1;
  //     },
  //     set: function (val) {
  //       // 页码改变动态的更新偏移量
  //       this.pagination.offset = (val - 1) * this.perPageNum;
  //     },
  //   },
  //   perPageNum: {
  //     get: function () {
  //       return this.pagination.limit;
  //     },
  //     set: function (val) {
  //       if (val !== this.perPageNum) {
  //         this.pagination.limit = val.value;
  //         // 进行每页显示数量切换时，判断当前偏移量是否大于改变后的偏移量，如果是，则不触发limit改变的事件，因为偏移量的改变也会触发
  //         if (
  //           this.pagination.offset >
  //           Math.floor(this.pagination.offset / val) * val
  //         ) {
  //           this.pageChangeFlag = true;
  //         }
  //       }
  //     },
  //   },
  //   max: function () {
  //     // 最大页数，总数/每页显示数量，向上取整
  //     return Math.ceil(this.count / this.perPageNum);
  //   },
  // },

  // methods: {
  //   /**
  //    * @跳转页码
  //    * @param val：页码
  //    */
  //   goToPage(val) {
  //     if (this.page != val && val <= this.max && val > 0) this.page = val;
  //     else if (val > this.max || val <= 0) this.goPage = "";
  //   },

  //   /**
  //    * @重置分页条
  //    * @param
  //    */
  //   setInitPage() {
  //     this.page = 1; //当前第一页
  //     this.goPage = 1; //跳转第一页
  //   },
  //   setPageSize(val) {
  //     this.pagination.limit = val;
  //   }
  // },
});
</script>
<style lang="scss" scoped>
.go-input{
  border-radius: 2px;
  border: 1px solid #D0D8DE;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  height: 60px;
  font-size: 12px;
  z-index: 1100;

  .pagination-select {
    display: flex;
    align-items: center;
    margin: 0 30px 0 18px;

    :deep(.q-field--focused .q-field__control):after {
      transform: scale3d(0, 1, 1);
    }

    .select {
      margin-right: 5px;
      padding: 0;
      width: 60px;
      height: 24px;
      border-radius: 2px;
    }
  }

  .pagination-link {
    display: flex;
    align-items: center;

    input {
      margin: 0 6px;
      padding: 0 5px;
      width: 32px;
      height: 24px;
      border-radius: 2px;
      text-align: center;
      font-weight: 500;
      font-size: 12px;
      outline: medium;
    }
  }

  :deep(.q-field--auto-height) {
    .q-field__control {
      padding: 0;
      min-height: 0px;
      height: 24px;

      &:before {
        border-radius: 2px;
      }

      .q-field__native {
        padding: 0;
        min-height: 0px;
      }

      .q-field__marginal {
        margin-right: 6px;
        padding: 2px 0 0 0;
        height: auto;

        &.q-anchor--skip {
          display: none;
        }
      }
    }
  }

  :deep(.q-field--auto-height .q-field__native span) {
    margin: 0 auto;
    font-weight: 500;
    font-size: 12px;
  }
}

.q-pagination {
  :deep(.q-btn) {
    margin: 0 3px;
    width: 24px;
    height: 24px;
    line-height: 1;

    .q-btn__wrapper {
      min-height: 0px;

      &:before {
        box-shadow: none;
      }
    }
  }
}

.select-item {
  height: 24px;
  text-align: center;
  line-height: 24px;
  cursor: pointer;
}

.select-page-input {
  .q-field__control {
    &:before {
      border: 1px solid var(--qq--y0-text-color1);
    }
  }
}
</style>
