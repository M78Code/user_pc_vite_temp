/*
 * @Author: success
 * @Date: 2020-08-04 17:13:55
 * @Description: 公共方法对象定义
 */
import uid from "src/core/uuid/index.js";
import lodash from 'lodash'
import { date } from "quasar";
import { api_common, api_account } from 'src/api/index';
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { DateForMat } from "src/core/format/common/index.js"



//模块之间通信 ，去耦合化的一个 键值对 仓库
export { GLOBAL_CONSTANT } from "src/core/constant/global/index.js";

 

 