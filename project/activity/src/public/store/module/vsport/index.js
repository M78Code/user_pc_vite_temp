/*
 * @Author: Cable
 * @Date: 2020-08-04 17:13:55
 * @Description: 虚拟体育相关
 */

export default {
    state: {
        // 虚拟体育右侧参数
        vsport_params: {
            mid:0,
            tid:0,
            csid:0,
            batchNo:0
        },  
    },
    getters: {
        //获取虚拟体育右侧参数
        get_vsport_params(state) {
            return state.vsport_params
        }
    },
    actions: {
        // 设置虚拟体育右侧
        set_vsport_params({ commit }, data) {
            commit("set_vsport_params", data)
        },
        //设置虚拟体育赛事id
        set_vsport_params_mid({ commit }, data) {
            commit("set_vsport_params_mid", data)
        },
    },
    mutations: {
        // 设置虚拟体育右侧
        set_vsport_params(state, data) {
            if(data.csid == 1001){
                data.id = data.tid + (data.batchNo || '')
            }else{
                data.id = data.tid + (data.mid || '')
            }
			state.vsport_params = data
        },
         //设置虚拟体育赛事id
        set_vsport_params_mid(state, data) {
			state.vsport_params.mid = data
        },
    }
}