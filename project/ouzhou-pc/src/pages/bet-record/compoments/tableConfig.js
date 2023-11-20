/*
 * @Author: cooper cooper@123.com
 * @Date: 2023-06-27 16:21:30
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-07-12 15:29:58
 * @FilePath: \user-pc-vue3\src\project-ouzhou\pages\bet-record\compoments\tableConfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref, onMounted } from 'vue'
import { api_match_list } from 'src/api'
import { responseData } from './mock'
import { UserCtr } from 'src/core/index.js'
export function useGetOrderList () {
  const { get_order_list } = api_match_list // 接口
  // const userInfo = state.userReducer?.userInfo || {}; // 用户数据
  const { user_info: userInfo } = UserCtr // 用户数据
  const tableData = ref([])
  const total = ref(0)
  const loading = ref(false)
  const columns = ref([
    {
      name: 'sn',
      label: i18n_t("bet_record.number"),
      align: 'center',
      field: 'sn',
      headerStyle: 'width: 18px',
      //   format: (val) => `${val}`,
      sortable: true
    },
    {
      name: 'datails',
      align: 'left',
      label: i18n_t("ouzhou.record.datails"),
      field: 'datails',
      sortable: true
    },
    {
      name: 'bettingType',
      label: i18n_t("bet_record.betting_play"),
      align: 'left',
      field: 'bettingType'
    },
    { name: 'detail', label: i18n_t("bet_record.options"), align: 'left', field: 'detail' },
    {
      name: 'totalStake',
      label: i18n_t("bet_record.bets_forehead"),
      align: 'left',
      field: 'totalStake'
    },
    {
      name: 'highestWin',
      label: i18n_t("common.maxn_amount_val"),
      align: 'left',
      field: 'highestWin'
    },
    {
      name: 'status',
      label: i18n_t("bet_record.status"),
      align: 'left',
      field: 'status'
      // sortable: true,
    }
  ])
  /**
   * 获取数据
   */
  const handle_fetch_order_list = async (obj) => {
    try {
      loading.value = true
      // tableData.value = responseData.data.records;
      const params = {
        enablePreSettle: false,
        orderBy: 1,
        orderStatus: 0,
        page: 1,
        size: 50,
        userId: userInfo.userId,
        // timeType: 1,
        ...obj
      }
      let res = await get_order_list(params)
      tableData.value = res.data?.records || []
      total.value = res.data?.total
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  onMounted(() => {
    handle_fetch_order_list()
  })
  return {
    columns,
    tableData,
    total,
    loading,
    handle_fetch_order_list
  }
}
