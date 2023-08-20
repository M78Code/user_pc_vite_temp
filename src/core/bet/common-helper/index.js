

import * as CommonSportHelper from  "./module/common-sport.js"
import * as CommonHelper from  "./module/common.js"
import * as VirtualSportHelper from  "./module/virtual-sport.js"




const BetCommonHelper={
    ...CommonSportHelper,
    ...CommonHelper,
    ...VirtualSportHelper,
}

export default BetCommonHelper