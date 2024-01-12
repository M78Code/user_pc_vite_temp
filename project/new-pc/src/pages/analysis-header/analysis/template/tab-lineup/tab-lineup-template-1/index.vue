<template>
  <div class="q-pb-md">
    <div class="lineup-bg  relative-position">
      <img :src="compute_local_project_file_path(`/image/png/analysis-lineup-${match.csid}.png`)" alt="" class="lineup-img" />
      <div class="lineup-bg-wrap" :class="{ 'basketball': match.csid == '2' }">
        <!-- 主队 -->
        <div class="home" :class="`lineup-${lodash.get(lineupData, 'home.homeFormation')}`">
          <div class="lineup-item">
            <div class="lineup-col" v-for="(item, index) in first_home_lineup" :key="index">
              <div class="player" v-for="(list, i) in item" :key="i">
                <div class="player-num">{{ list.shirtNumber }}</div>
                <span>{{ list.thirdPlayerName }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 客队 -->
        <div class="away" :class="`lineup-${lodash.get(lineupData, 'away.awayFormation')}`">
          <div class="lineup-item">
            <div class="lineup-col" v-for="(item, index) in first_away_lineup" :key="index">
              <div class="player" v-for="(list, i) in item" :key="i">
                <div class="player-num">{{ list.shirtNumber }}</div>
                <span>{{ list.thirdPlayerName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lineup-wrap">
      <!-- 主队 S -->
      <div class="lineup-item home">
        <div class="panel">
          <!-- 首发阵容 -->
          <div class="panel-title">{{ i18n_t('analysis.starting_lineup') }} {{ match.csid == '1' ? lodash.get(lineupData,
            'home.homeFormation') : '' }}</div>
          <div class="d-table">
            <div class="d-table-h">
              <!-- 位置 -->
              <div class="d-table-td">{{ i18n_t('analysis.position') }}</div>
              <!-- 姓名 -->
              <div class="d-table-td">{{ i18n_t('analysis.name') }}</div>
              <!-- 号码 -->
              <div class="d-table-td">{{ i18n_t('analysis.number') }}</div>
            </div>
            <div class="d-tabel-tr" v-for="(item, index) in lodash.get(lineupData, 'home.up')" :key="index">
              <div class="d-table-td"
                :class="{ 'multiple-pos': lodash.get(lineupData, 'home.up').filter(item => item.positionName.length > 4).length }">
                <img v-img="([item.thirdPlayerPicUrl])" alt="" class="logo">
                <span class="player-name ellipsis">{{ item.positionName }}</span>
              </div>
              <div class="d-table-td">
                <span>{{ item.thirdPlayerName }}</span>
              </div>
              <div class="d-table-td">
                <span>{{ item.shirtNumber }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="panel">
          <!-- 替补阵容 -->
          <div class="panel-title">{{ i18n_t('analysis.bench_lineup') }} {{ match.csid == '1' ? lodash.get(lineupData,
            'home.homeFormation') : '' }}</div>
          <div class="d-table">
            <div class="d-table-h">
              <!-- 位置 -->
              <div class="d-table-td">{{ i18n_t('analysis.position') }}</div>
              <!-- 姓名 -->
              <div class="d-table-td">{{ i18n_t('analysis.name') }}</div>
              <!-- 号码 -->
              <div class="d-table-td">{{ i18n_t('analysis.number') }}</div>
            </div>
            <div class="d-tabel-tr" v-for="(item, index) in lodash.get(lineupData, 'home.down')" :key="index">
              <div class="d-table-td"
                :class="{ 'multiple-pos': lodash.get(lineupData, 'home.down').filter(item => item.positionName.length > 4).length }">
                <img v-img="([item.thirdPlayerPicUrl])" alt="" class="logo">
                <span class="player-name ellipsis">{{ item.positionName }}</span>
              </div>
              <div class="d-table-td">
                <span>{{ item.thirdPlayerName }}</span>
              </div>
              <div class="d-table-td">
                <span>{{ item.shirtNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 主队 E -->

      <!-- 客队 S -->
      <div class="lineup-item away">
        <div class="panel">
          <!-- 首发阵容 -->
          <div class="panel-title">{{ i18n_t('analysis.starting_lineup') }}
            {{ match.csid == '1' ? lodash.get(lineupData, 'away.awayFormation') : '' }}</div>
          <div class="d-table">
            <div class="d-table-h">
              <!-- 位置 -->
              <div class="d-table-td">{{ i18n_t('analysis.position') }}</div>
              <!-- 姓名 -->
              <div class="d-table-td">{{ i18n_t('analysis.name') }}</div>
              <!-- 号码 -->
              <div class="d-table-td">{{ i18n_t('analysis.number') }}</div>
            </div>
            <div class="d-tabel-tr" v-for="(item, index) in lodash.get(lineupData, 'away.up')" :key="index">
              <div class="d-table-td"
                :class="{ 'multiple-pos': lodash.get(lineupData, 'away.up').filter(item => item.positionName.length > 4).length }">
                <img v-img="([item.thirdPlayerPicUrl])" alt="" class="logo">
                <span class="player-name ellipsis">{{ item.positionName }}</span>
              </div>
              <div class="d-table-td">
                <span>{{ item.thirdPlayerName }}</span>
              </div>
              <div class="d-table-td">
                <span>{{ item.shirtNumber }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="panel">
          <!-- 替补阵容 -->
          <div class="panel-title">{{ i18n_t('analysis.bench_lineup') }}
            {{ match.csid == '1' ? lodash.get(lineupData, 'away.awayFormation') : '' }}</div>
          <div class="d-table">
            <div class="d-table-h">
              <!-- 位置 -->
              <div class="d-table-td">{{ i18n_t('analysis.position') }}</div>
              <!-- 姓名 -->
              <div class="d-table-td">{{ i18n_t('analysis.name') }}</div>
              <!-- 号码 -->
              <div class="d-table-td">{{ i18n_t('analysis.number') }}</div>
            </div>
            <div class="d-tabel-tr" v-for="(item, index) in lodash.get(lineupData, 'away.down')" :key="index">
              <div class="d-table-td"
                :class="{ 'multiple-pos': lodash.get(lineupData, 'away.down').filter(item => item.positionName.length > 4).length }">
                <img v-img="([item.thirdPlayerPicUrl])" alt="" class="logo">
                <span class="player-name ellipsis">{{ item.positionName }}</span>
              </div>
              <div class="d-table-td">
                <span>{{ item.thirdPlayerName }}</span>
              </div>
              <div class="d-table-td">
                <span>{{ item.shirtNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 客队 E -->
    </div>

  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { useRegistPropsHelper } from "src/composables/regist-props/index.js"
import { component_symbol, need_register_props } from "../config/index.js"
useRegistPropsHelper(component_symbol, need_register_props)
import { api_analysis } from 'src/api/index'
import lodash from 'lodash'
import { compute_local_project_file_path } from "src/output/index.js";
const lineupData = ref({});
const first_home_lineup = ref([]); //主队首发阵容
const first_away_lineup = ref([]); //客队首发阵容
const props = defineProps(['match'])
get_lineup()

/**
* @description: 阵容数据
*/
function get_lineup() {
  api_analysis.get_lineupList({ matchInfoId: props.match.mid }).then(data => {
    if (data.code == 200) {
      let lineupInfo = data.data
      let lineup_formation = {
        home: lodash.get(data, 'data.home.homeFormation'),
        away: lodash.get(data, 'data.away.awayFormation'),
      }
      if (props.match.csid == '2') {
        lineup_formation.home = '2-2'
        lineup_formation.away = '2-2'
      }

      let home_up = lodash.get(data, 'data.home.up', [])
      let away_up = lodash.get(data, 'data.away.up', [])
      // 过滤掉教练位置
      home_up = home_up.filter(item => !item.positionEnName.toLowerCase().includes('coach'))
      away_up = away_up.filter(item => !item.positionEnName.toLowerCase().includes('coach'))

      if (lodash.get(lineupInfo, 'home.up')) {
        lineupInfo.home.up = home_up
      }
      if (lodash.get(lineupInfo, 'away.up')) {
        lineupInfo.away.up = away_up
      }

      lineupData.value = lineupInfo

      first_home_lineup.value = get_first_lineup(home_up, lineup_formation.home, 'home')
      first_away_lineup.value = get_first_lineup(away_up, lineup_formation.away, 'away')
    }
  })
}

/**
* @description: 格式化首发阵容
*/

function get_first_lineup(data, lineup, type) {
  if (!data.length || !lineup) return []

  let linup_num = lineup.split("-")
  let arr = [[data[0]]]

  if (type == 'home') {
    let i = 1
    linup_num.map(item => {
      item = parseInt(item)
      arr.push(data.slice(i, i += item))
    })
  } else {
    let i = 0
    data.reverse()
    linup_num.reverse()
    arr = []
    linup_num.map(item => {
      item = parseInt(item)
      arr.push(data.slice(i, i += item))
    })
    arr.push([data[data.length - 1]])
  }

  return arr
}

</script>

<style lang="scss" scoped>
/*  阵容图 */
.lineup-bg {
  min-width: 950px;

  .lineup-img {
    width: 100%;
    margin: 20px 0;
  }

  .lineup-bg-wrap {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: var(--q-analysis-color-13);
    padding: 20px 0;

    .home,
    .away {
      flex: 1;
      width: 50%;

      .lineup-item {
        display: flex;
        height: 100%;

        .lineup-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .player {
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .player-num {
              width: 36px;
              height: 36px;
              border-radius: 18px;
              font-size: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 6px;
            }
          }
        }
      }
    }

    .home {
      .player-num {
        background: #E93D3D;
      }
    }

    .away {
      .player-num {
        background: var(--q-analysis-color-2);
      }
    }

    &.basketball {

      .home .lineup-col:last-child,
      .away .lineup-col:first-child {
        justify-content: center;

        .player {
          flex: unset;

          &:first-child {
            margin-bottom: 50px;
          }
        }
      }
    }
  }
}

/*  阵容数据 */
.lineup-wrap {
  display: flex;
  justify-content: space-between;
  min-width: 950px;

  .lineup-item {
    flex: 1;
    min-width: 470px;

    &:first-child {
      margin-right: 20px;
    }

    .panel {
      &:first-child {
        margin-bottom: 20px;
      }

      .d-table {
        border: 1px solid #DEE4F2;
        border-top: 0;
        border-radius: 0 0 8px 8px;
        overflow: hidden;

        .d-table-h {
          display: flex;
          align-items: center;
          height: 28px;
          background: var(-q-analysis-color-17);
          color: var(--q-analysis-color-12);

          &:last-child {
            border-radius: 0 0 8px 8px;
          }
        }

        .d-tabel-tr {
          display: flex;
          align-items: center;
          height: 40px;
          border-bottom: 1px solid #DEE4F2;

          &:last-child {
            border-bottom: transparent;
          }
        }

        .d-table-td {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #DEE4F2;

          &:first-child {
            width: 100px;
          }

          &.multiple-pos {
            padding: 0 5px;
            justify-content: space-between;
          }

          &:nth-child(2) {
            width: 319px;
          }

          &:last-child {
            width: 50px;
            border-right: transparent;
          }

          .logo {
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }

          .player-name {
            min-width: 24px;
            text-align: right;
          }
        }
      }
    }
  }
}

.home {
  .panel-title:before {
    background: #E93D3D !important;
  }
}

.away {
  .panel-title:before {
    background: var(--q-analysis-color-2) !important;
  }
}

.q-pb-md {
  padding-bottom: 50px;
}
</style>