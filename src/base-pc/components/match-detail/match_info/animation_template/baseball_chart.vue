<!--
 * @
 * @Author: Yellow
 * @Description: 棒球统计面板
 * @Date: 2020-09-17 13:38:43
-->
<template>
    <div class="baseball">
			<!-- 上部分 S-->
      <div class="wrap-up">
				<div class="chart-round">
					<div class="item-warp">
						<div class="round-item" :class="{'is_get':lodash.get(match_info,'mbkn')>=1}"></div>
						<div class="round-item" :class="{'is_get':lodash.get(match_info,'mbkn')>=2}"></div>
						<div class="round-item" :class="{'is_get':lodash.get(match_info,'mbkn')>=3}"></div>
						<div class="round-item" :class="{'is_get':lodash.get(match_info,'mbkn')>=4}"></div>
					</div>
					<!-- 坏球 S3012-->
					<div class="desc">{{ i18n_t('common.worse')}} {{lodash.get(match_info,"mbkn")}}</div>
				</div>

				<!-- 菱形 -->
				<div class="chart-rhombus">
					<div class="wrap-rhombus">
						<!-- 二垒 -->
						<div class="rhombus-item" :class="{'is_get':lodash.get(match_info,'mbtlp')*1}"></div>
						<!-- 一垒 -->
						<div class="rhombus-item" :class="{'is_get':lodash.get(match_info,'mbolp')*1}"></div>
						<!-- 三垒 -->
						<div class="rhombus-item" :class="{'is_get':lodash.get(match_info,'mbthlp')*1}"></div>
					</div>
					<!-- 上垒 S3013-->
					<div class="desc">{{ i18n_t('common.on_base')}}</div>
				</div>

				<div class="chart-round">
					<div class="item-warp">
						<div class="round-item" :class="{'is_get':lodash.get(match_info,'mbhn')>=1}"></div>
						<div class="round-item" :class="{'is_get':lodash.get(match_info,'mbhn')>=2}"></div>
						<div class="round-item" :class="{'is_get':lodash.get(match_info,'mbhn')>=3}"></div>
					</div>
					<!-- 好球 S3011-->
					<div class="desc">{{ i18n_t('common.good_shot')}} {{lodash.get(match_info,"mbhn")}}</div>
				</div>
			</div>
			<!-- 上部分 E-->

			<!-- 下部分 S-->
			<div class="wrap-down">
				<div class="wrap-line">
					<div class="line-item" :class="{'is_get':lodash.get(match_info,'mbcn')>=1}"></div>
					<div class="line-item" :class="{'is_get':lodash.get(match_info,'mbcn')>=2}"></div>
					<div class="line-item" :class="{'is_get':lodash.get(match_info,'mbcn')>=3}"></div>
				</div>
				<!-- 出局 S3014-->
				<div class="desc">{{ i18n_t('common.out')}} {{lodash.get(match_info,"mbcn")}}</div>
			</div>
			<!-- 下部分 E-->
    </div>
</template>

<script>
  export default {
		props: {
			match_info: {
				type: Object,
				default: {}
			},
		}
  }
</script>

<style lang="scss" scoped>
.baseball {
  height: 192px;
  width: 100%;
  padding: 30px 50px;
  /*************** 上部分 *************** -S*/
  .wrap-up {
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    /*************** 圆点 *************** -S*/
    .chart-round {
      flex: 1;
      display: flex;
      flex-flow: column;
      align-items: center;
      .item-warp {
        height: 48px;
        display: flex;
        align-items: center;
        .round-item {
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background: #c1c4c7;
          margin-right: 10px;
          &.is_get {
            background: var(--q-gb-bg-c-1);
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    /*************** 圆点 *************** -S*/

    /*************** 菱形 *************** -S*/
    .chart-rhombus {
      flex: 1;
      height: 66px;
      display: flex;
      flex-flow: column;
      justify-content: flex-end;
      align-items: center;
      .wrap-rhombus {
        display: flex;
        flex-wrap: wrap;
        transform: rotateZ(45deg);
        width: 33px;
        height: 33px;
        .rhombus-item {
          width: 14px;
          height: 14px;
          background: #c1c4c7;
          &.is_get {
            background: var(--q-gb-bg-c-1);
          }
          &:nth-child(odd) {
            margin-right: 3px;
          }
        }
      }
    }
    /*************** 菱形 *************** -E*/
  }
  /*************** 上部分 *************** -E*/

  /*************** 下部分 *************** -S*/
  .wrap-down {
    display: flex;
    flex-flow: column;
    align-items: center;
    .wrap-line {
      margin-bottom: 10px;
      width: 100%;
      display: flex;
      .line-item {
        height: 6px;
        background: #c1c4c7;
        flex: 1;
        margin-right: 5px;
        &.is_get {
          background: var(--q-gb-bg-c-1);
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  /*************** 下部分 *************** -E*/
  .desc {
    color: #99a3b1;
  }
}
</style>