/*
 * @Author: cooper cooper@123.com
 * @Date: 2023-07-09 16:21:30
 * @LastEditors: cooper cooper@123.com
 * @LastEditTime: 2023-07-11 15:29:00
 * @FilePath: \user-pc-vue3\src\project-ouzhou\pages\detail\index.js
 * @Description: 详情分析页相关接口数据处理
 */
import { ref, onMounted, computed, onUnmounted,defineProps } from "vue";

export function useMscData(detail_info) {

  const statsList = ref([
    {
      value: "Assault",
      value_key: "S104",
    },
    {
      value: "dangerous attack",
      value_key: "S8",
    },
    {
      value: "ball right",
      value_key: "S105",
    },
  ]);
  const sliderList = ref([
    {
      title: "Shot On Goal",
      value_key: "S18",
    },
    {
      title: "Shot Wide Goal",
      value_key: "S17",
    },
  ]);
    // 详情数据处理
const detailInfo = computed(()=>{
    const obj = detail_info
    let result = {}
    if (obj.msc&&obj.msc.length>0) {
      for (const item of obj.msc) {
        const list = item.split('|')
        const score_list = list[1].split(':')
        console.log(list)
        result[list[0]] = {
          home:score_list[0],
          away:score_list[1],
          percentage:(Number (score_list[0]) / (Number (score_list[0]) + Number (score_list[1])).toFixed(2)) * 100||0,
          away_percentage:(Number (score_list[1]) / (Number (score_list[0]) + Number (score_list[1])).toFixed(2)) * 100||0,
        }
      }
      
    }
  
     return result
  })

  onMounted(() => {

  });
  onUnmounted(() => {});

  return {
    statsList,
    sliderList,
    detailInfo,  
  };
}
