import { ref, reactive, toRefs, computed, onMounted, onUnmounted } from "vue";
import { useMittEmit, useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
export const useGetValue = ({ count }) => {
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
    icon_name: "icon-triangle1",
  });

  const page = computed({
    get: function () {
      if (count === 0) {
        return 0;
      }
      // 偏移量/每页显示数量 向下取整 + 1
      return Math.floor(state.pagination.offset / state.pagination.limit) + 1;
    },
    set: function (val) {
      // 页码改变动态的更新偏移量
      state.pagination.offset = (val - 1) * perPageNum.value;
    },
  });
  const perPageNum = computed({
    get: function () {
      // console.error(state);
      return state.pagination.limit;
    },
    set: function (val) {
      if (val !== perPageNum.value) {
        state.pagination.limit = val;
        // 进行每页显示数量切换时，判断当前偏移量是否大于改变后的偏移量，如果是，则不触发limit改变的事件，因为偏移量的改变也会触发
        if (
          state.pagination.offset >
          Math.floor(state.pagination.offset / val) * val
        ) {
          state.pageChangeFlag = true;
        }
      }
    },
  });
  const max = computed(() => {
    // 最大页数，总数/每页显示数量，向上取整
    return Math.ceil(count / perPageNum.value);
  });

  /**
   * @重置分页条
   * @param
   */
  const setInitPage = () => {
    page.value = 1; //当前第一页
    state.goPage = 1; //跳转第一页
  };
  const setPageSize = (val) => {
    state.pagination.limit = val;
  };
  const { off } = useMittOn(MITT_TYPES.EMIT_RECODES_QUERY_BUT_CMD, setInitPage);
  const { off: offSize } = useMittOn(
    MITT_TYPES.EMIT_RECORD_CHANGE_PAGE_SIZE_CMD,
    setPageSize
  );
  onUnmounted(off);
  onUnmounted(offSize);
  onMounted(() => {});

  return {
    ...toRefs(state),
    page,
    max,
    perPageNum,
  };
};
