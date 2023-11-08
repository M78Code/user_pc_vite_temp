/*
 * @Author: cooper cooper@123.com
 * @Date: 2023-06-27 16:21:30
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-07-12 15:29:58
 * @FilePath: \user-pc-vue3\src\project-ouzhou\pages\bet-record\compoments\tableConfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref, onMounted } from "vue";
import { api_match_list } from "src/api";
import store from "src/store-redux-vuex/index.js";
import { responseData } from "./mock";
export function useGetOrderList() {
  const { get_order_list } = api_match_list; // 接口

  let state = store.getState();

  const userInfo = state.userReducer.userInfo; // 用户数据
  const tableData = ref([]);
  const total = ref(0)
  const loading = ref(false)
  const columns = ref([
    {
      name: "sn",
      label: "Sn",
      align: "center",
      field: "sn",
      headerStyle: 'width: 18px',
      //   format: (val) => `${val}`,
      sortable: true,
    },
    {
      name: "datails",
      align: "left",
      label: "Datails",
      field: "datails",
      sortable: true,
    },
    {
      name: "bettingType",
      label: "Betting Type",
      align: "left",
      field: "bettingType",
    },
    { name: "detail", label: "Detail", align: "left", field: "detail" },
    {
      name: "totalStake",
      label: "Total Stake",
      align: "left",
      field: "totalStake",
    },
    {
      name: "highestWin",
      label: "Highest Win",
      align: "left",
      field: "highestWin",
    },
    {
      name: "status",
      label: "Status",
      align: "left",
      field: "status",
      // sortable: true,
    },
  ]);

  /**
   * 获取数据
   */
  const handle_fetch_order_list = async (obj) => {
    try {
      loading.value = true
      // tableData.value = responseData.data.records;
      const params = {
          enablePreSettle: false,
          orderBy:1,
          orderStatus:0,
          page:1,
          size:50,
          userId:userInfo.userId,
          ...obj
      }
       let res = await get_order_list(params);
       tableData.value = res.data.data?.records||[]
     
       total.value = res.data.data.total
       loading.value = false
    } catch (error) {}
  };


  

  onMounted(() => {
    handle_fetch_order_list();
  });

  return {
    columns,
    tableData,
    total,
    loading,
    handle_fetch_order_list
  };
}
