




//通用 

import lodash from "lodash";
import { reactive, computed, onMounted, onUnmounted, toRefs, watch } from "vue";
import {i18n } from  "src/boot/i18n.js"
import { useMittOn, useMittEmit, useMittEmitterGenerator,MITT_TYPES  } from "src/core/mitt/index.js"
import {msc_array_obj} from "src/core/formart/index.js"
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import uid from "src/core/uuid/index.js"
import VrSportCtr from  "src/core/vr-sport/index.js"


// pc 

import MenuData from  "src/core/menu-pc/menu-data-class.js"
import MatchListCard from  "src/core/match-list-h5/match-card/match-list-card-class.js"
import MatchListCardData from "src/core/match-list-h5/match-card/module/match-list-card-data-class.js"
import MatchDetailCtr from  "src/core/match-detail/match-detail-class.js"
import PageSourceData  from  "src/core/page-source-pc/page-source-pc.js"
import UserCtr from  "src/core/user-config/user-ctr.js"
import {MatchDataWarehouse_PC_List_Common  } from "src/core/data-warehouse/index.js"
 


// h5 

import MenuData from  "src/core/menu-h5/menu-data-class.js"
import MatchListCard from  "src/core/match-list-pc/match-card/match-list-card-class.js"
import MatchListCardData from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js"
import MatchDetailCtr from  "src/core/match-detail/match-detail-class.js"
import PageSourceData  from  "src/core/page-source-h5/page-source-h5.js"
import UserCtr from  "src/core/user-config/user-ctr.js"
import {MatchDataWarehouse_H5_List_Common  } from "src/core/data-warehouse/index.js"

























        
