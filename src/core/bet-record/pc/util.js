
import { i18n_t } from "src/boot/i18n.js";

export const columns = [
    {
      name: 'sn',
      label:  i18n_t("bet_record.number"),
      align: 'center',
      field: 'sn',
      headerStyle: 'width: 18px',
      sortable: true
    },
    {
      name: 'datails',
      align: 'left',
      label:  i18n_t("ouzhou.record.datails"),
      field: 'datails',
      sortable: true
    },
    {
      name: 'bettingType',
      label:  i18n_t("bet_record.betting_play"),
      align: 'left',
      field: 'bettingType'
    },
    { name: 'detail', 
      label:  i18n_t("bet_record.options"), 
      align: 'left', 
      field: 'detail' 
    },
    {
      name: 'totalStake',
      label:  i18n_t("bet_record.bets_forehead"),
      align: 'left',
      field: 'totalStake'
    },
    {
      name: 'highestWin',
      label:  i18n_t("common.maxn_amount_val"),
      align: 'left',
      field: 'highestWin'
    },
    {
      name: 'status',
      label:  i18n_t("bet_record.status"),
      align: 'left',
      field: 'status'
      // sortable: true,
    }
  ]

  export const o_params = [
  {
    orderStatus: 0,
    timeType: 5  
  },
  {
    orderStatus: 1,
    timeType: 5  
  },
  {
    jumpFrom: 1,
    preOrderStatusList: [1]
  }
]