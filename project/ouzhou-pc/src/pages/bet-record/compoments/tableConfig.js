/*
 * @Author: cooper cooper@123.com
 * @Date: 2023-06-27 16:21:30
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-07-12 15:29:58
 * @FilePath: \user-pc-vue3\src\project-ouzhou\pages\bet-record\compoments\tableConfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref, onMounted,computed } from 'vue'
import { api_betting } from 'src/api'
import { responseData } from './mock'
import { i18n_t, } from 'src/output/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import GlobalSwitchClass from 'src/core/global/global.js'
export function useGetOrderList () {
  const { post_getOrderList } = api_betting // 接口
  // const userInfo = state.userReducer?.userInfo || {}; // 用户数据
  const { user_info: userInfo } = UserCtr // 用户数据
  const tableData = ref([])
  const records = ref({})
  const total = ref(0)
  const loading = ref(false)
  const columns = [
    {
      name: 'sn',
      label: computed(()=>{ return i18n_t("bet_record.number")}),
      align: 'center',
      field: 'sn',
      headerStyle: 'width: 18px',
      //   format: (val) => `${val}`,
      sortable: true
    },
    {
      name: 'datails',
      align: 'left',
      label: computed(()=>{ return i18n_t("ouzhou.record.datails")}),
      field: 'datails',
      sortable: true
    },
    {
      name: 'bettingType',
      label: computed(()=>{ return i18n_t("bet_record.betting_play")}),
      align: 'left',
      field: 'bettingType'
    },
    { name: 'detail', 
      label: computed(()=>{ return i18n_t("bet_record.options")}) , 
      align: 'left', 
      field: 'detail' 
    },
    {
      name: 'totalStake',
      label: computed(()=>{ return i18n_t("bet_record.bets_forehead")}),
      align: 'left',
      field: 'totalStake'
    },
    {
      name: 'highestWin',
      label: computed(()=>{ return i18n_t("common.maxn_amount_val")}),
      align: 'left',
      field: 'highestWin'
    },
    {
      name: 'status',
      label: computed(()=>{ return i18n_t("bet_record.status")}),
      align: 'left',
      field: 'status'
      // sortable: true,
    }
  ]
  /**
   * 获取数据
   */
  const handle_fetch_order_list = async (obj) => {
    try {
      loading.value = true
      // tableData.value = responseData.data.records;
      const params = {
        enablePreSettle: false,
        orderBy: 2,
        orderStatus: 0,
        page: 1,
        size: 50,
        userId: userInfo.userId,
        // timeType: 1,
        ...obj
      }
      let res = await post_getOrderList(params)
      if(res.code !== '200'){
        if(res.code === '0401038'){
          GlobalSwitchClass.set_tip_show_state(true, {
            // 当前访问人数过多，请稍后再试
            text: i18n_t('common.limited')
          })
          return ;
        }
        return;
        // GlobalSwitchClass.set_tip_show_state(true, {
        //   text: res.message
        // })
        // return;
      }
      tableData.value = res.data?.records || []
      records.value = res.data || {}
      total.value = res.data?.total
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  // onMounted(() => {
  //   handle_fetch_order_list()
  // })
  return {
    columns,
    tableData,
    total,
    loading,
    records,
    handle_fetch_order_list
  }
}
