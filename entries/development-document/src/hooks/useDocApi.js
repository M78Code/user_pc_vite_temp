/*
 * @Description: doc文档hooks
 * @FilePath: \user-pc-vite\entries\development-document\src\hooks\usedocapi.js
 * @Date: 2023-08-02 17:22:17
 */

import { ref, reactive, computed } from "vue"

export const useDocApi = (docData) => {
    // const docApis = computed(()=> Array.isArray(docData) && docData[0] || {})

    const fileData = ref([])

    const tableFile = reactive(new Map());
    const initdata = () => {
    }

    const formatdata = () => {
        // console.log('----docApis.value--', docApis.value);
        // for(let key in docApis.value){
        // console.log('---docApis---logs----', docApis.value[key]);
        // 排除的参数
        // if(!["file_path","meta", "leftmenu"].includes(key)){
        // }
        // }
    }
    return {
        fileData,
        initdata
    }
}


