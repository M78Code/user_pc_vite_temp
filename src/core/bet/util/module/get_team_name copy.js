
import MenuData from "src/core/menu-pc/menu-data-class.js";
import PageSourceData from "src/core/page-source-h5/page-source-h5.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import BetData from "./class/bet-data-class.js";
import { compute_value_by_cur_odd_type } from "./bet_odds_change.js";
import { get_bet_amount_param } from "./bet-amount.js";
import { http_upd_data } from "./upd_data.js";
import { set_submit_status } from "./status.js";
import mathjs from "src/core/utils/mathjs.js";
import yabo_common from "src/core/common-helper/common.js";
import { uid } from "quasar";
import { ref } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import lodash from "lodash";
import play_mapping from "src/public/config/mapping/play_mapping.js";


 
  