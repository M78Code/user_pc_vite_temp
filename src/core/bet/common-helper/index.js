

import * as CommonSportHelper from  "./module/common-sport.js"
import * as CommonHelper from  "./module/common.js"
import * as VirtualSportHelper from  "./module/virtual-sport.js"
import * as BetCountjointNumber from  "./module/bet-countjoint-number.js"



const BetCommonHelper={
    ...CommonSportHelper,
    ...CommonHelper,
    ...VirtualSportHelper,
    ...BetCountjointNumber,
}

export default BetCommonHelper