<!--
 * @Author:
 * @Date: 2022-04-06 13:08:57
 * @Description: 视频全屏模式顶部比分信息---只有足球和篮球展示小节比分，其他赛种只展示队伍名和总分
-->
<template>
  <div class="header-top-wrap">
    <div class="header_left">
		<div v-if="!replayInfo" class="card-wrap">
			<!-- 足球上半场 -->
			<div class="item" v-if="match_info.csid == 1" :class="{high_light:match_info.mmp == 6 || match_info.mmp == 41}">
				<div class="icon-wrap">
					<div class="name">{{$root.$t('common.up_half')}}</div>
				</div>
				<div class="number">{{match_info.msc.S2.home != '' && match_info.msc.S2.away !=''  ? `${match_info.msc.S2.home}-${match_info.msc.S2.away}` : `&nbsp;`}}</div>
			</div>
			<!-- 足球下半场 -->
			<div class="item high_light" v-if="match_info.csid == 1 && match_info.mmp > 6 && match_info.mmp != 41">
				<div class="icon-wrap">
					<div class="name">{{$root.$t('results.second_half')}}</div>
				</div>
				<div class="number">{{match_info.msc.S3.home != '' && match_info.msc.S3.away !=''  ? `${match_info.msc.S3.home}-${match_info.msc.S3.away}` : `&nbsp;`}}</div>
			</div>
			<div class="item" v-for="(val,key) in match_info.score_full_screen[0]" :key="key" :class="[val.class, {'high_light':val.current_mmp == match_info.mmp}]">
				<div class="icon-wrap">
					<div class="name">{{val.name}}</div>
				</div>
				<div class="number" :class="{zero:match_info.msc[val.score].home == 0}">{{match_info.msc[val.score].home != '' && match_info.msc[val.score].away !=''  ? `${match_info.msc[val.score].home}-${match_info.msc[val.score].away}` : `&nbsp;`}}</div>
			</div>
		</div>
		<div v-else class="btn-back-live" @click.stop="backLive">{{ replay_event_id ? $root.$t('common.back') : $root.$t('video.back_live') }}</div>
	</div>
	<!-- 对阵比分 -->
    <div v-if="!replayInfo" class="header_center">
			<!-- 战队名称 -->
      <div class="name-wrap left-name">
        <div class="name relative-position">
          <div class="ellipsis yb-absolute">{{match_info.mhn}}</div>
          <q-tooltip anchor="top middle" self="center middle" :content-style="tooltip_style+'transform:translateY(3px);'">
            {{match_info.mhn}}
          </q-tooltip>
        </div>
        <div class="score active">
          <template v-if="match_info.ms != 110">{{main_score.home}}</template>
        </div>
      </div>
			&nbsp;&nbsp;{{match_info.csid == 2 ? 'V' : ':'}}&nbsp;&nbsp;
      <div class="name-wrap right-name">
        <div class="score active">
          <template v-if="match_info.ms != 110">{{main_score.away}}</template>
        </div>
        <div class="name relative-position">
          <div class="ellipsis yb-absolute">{{match_info.man}}</div>
          <q-tooltip anchor="top middle" self="center middle" :content-style="tooltip_style+'transform:translateY(3px);'">
            {{match_info.man}}
          </q-tooltip>
        </div>
      </div>
	</div>
	<div v-else class="header_center replay-header-info">
		{{ replayInfo.titleInfo }}
	</div>
    <div class="header_right">
			<template v-if="!replayInfo">
				<!-- 足球 -->
				<div class="card-wrap" v-if="match_info.csid == 1">
					<div class="item" v-for="(val,key) in match_info.score_full_screen[1]" :key="key">
						<div class="icon-wrap">
							<div class="img" :class="val.class"></div>
							<q-tooltip anchor="top middle" self="center middle" :content-style="tooltip_style">{{val.tooltip}}</q-tooltip>
						</div>
						<div class="number" :class="{zero:match_info.msc[val.score].home == 0}">{{match_info.msc[val.score].home}}-{{match_info.msc[val.score].away}}</div>
					</div>
				</div>
				<!-- 篮球 -->
				<div class="card-wrap basketball_card" v-if="match_info.csid == 2">
					<div class="item" v-for="(val,key) in match_info.score_full_screen[1]" :key="key" :class="val.class">
						<div class="icon-wrap">
							{{val.name}}
						</div>
						<div class="number" :class="{zero:match_info.msc[val.score].home == 0}">{{match_info.msc[val.score].home}}-{{match_info.msc[val.score].away}}</div>
					</div>
				</div>
			</template>
    </div>
  </div>
</template>

<script>
export default {
	name:"full-video-header",
	props:{
		match_info: {
			type: Object,
			default: {}
		},
		replayInfo: {
			type: Object,
			default: null
		},
		replay_event_id: {
			type: [Number,String],
			default: 0
		}
	},
	computed:{
		// 比分队伍名称
		main_score(){
		let key = "S1"
		// 足球
		if (this.match_info.csid == 1) {
			// S7:加时赛比分
			if ([32, 33, 41, 42, 110].includes(this.match_info.mmp*1)) {
			key = "S7"
			}
			// S170:点球大战比分
			else if ([34, 50, 120].includes(this.match_info.mmp*1)) {
			key = "S170"
			}
		}
		return this.match_info.msc[key]
		}
	},
	methods: {
		backLive() {
			if(this.replay_event_id){
				this.$root.$emit('IFRAME_VIDEO_VOLUME', {volume: 0, src:'muted'});
			}
			clearTimeout(this.back_live_timer)
			this.back_live_timer = setTimeout(() => {
				this.$emit('backLive')
			}, 500);
		}
	},
	destroyed () {
		clearTimeout(this.back_live_timer);
	},
}
</script>

<style lang="scss" scoped>
.header-top-wrap{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 60px;
    background-color: rgba($color: #000, $alpha: .6);
    z-index: 1001;
    display: flex;
    justify-content: center;
		.card-wrap {
			display: flex;
			.item {
				display: flex;
				text-align: center;
				margin-right: 25px;
				& > div {
					display: inline-block;
				}
				.icon-wrap {
					margin-right: 5px;
					font-size: 12px;
					.img {
						width: 14px;
						height: 100%;
						background-size: contain;
					}
				}
				.number {
					font-size: 13px;
				}
			}
		}
		.header_left {
			display: flex;
			justify-content: left;
			flex: 1;
			.btn-back-live {
				background: rgba(51, 51, 51, 0.4);
				border: 0.5px solid rgba(255, 255, 255, 0.5);
				border-radius: 80px;
				height: 32px;
				line-height: 32px;
				padding: 0 13px;
				font-weight: 400;
				font-size: 12px;
				color: #fff;
				cursor: pointer;
				margin: 14px 0 0 30px;
			}
			.card-wrap {
				margin-left: 30px;
				.item {
					display: block;
					padding-top: 14px;
					margin-right: 30px;
					min-width: 45px;
					& > div {
						display: block;
					}
					.icon-wrap {
						margin-bottom: 6px;
						margin-right: 0;
						font-weight: 400;
					}
					.number {
						font-weight: 500;
					}
				}
			}
		}
		// 中间对阵比分
		.header_center {
			flex: 1;
			display: flex;
			justify-content: center;
			line-height: 60px;
			font-size: 16px;
			font-family: HelveticaNeue-Bold;
			&.replay-header-info {
				color: #FFFFFF;
				font-weight: 500;
				font-size: 16px;
			}
			.name-wrap {
				display: flex;
				&.left-name {
					.name {
						margin-right: 10px;
					}
				}
				&.right-name {
					.name {
						margin-left: 10px;
					}
				}
			}
			.yb-absolute {
				width: auto;
				position: static;
			}
		}
		// 右侧比分
		.header_right {
			padding-right: 65px;
			display: flex;
			justify-content: right;
			align-items: center;
			flex: 1;
			.rs_huang {
				background: url('~public/image/yabo/svg/analysis-yellow_card.svg') no-repeat center;
				background-size: contain;
			}
			.rs_hong {
				background: url('~public/image/yabo/svg/analysis-red_card.svg') no-repeat center;
				background-size: contain;
			}
			.rs_jiao_quan {
				background: url('~public/image/yabo/svg/analysis-corner.svg') no-repeat center;
			}
			.rs_quan {
				background: url('~public/image/yabo/svg/full_screen_quan.svg') no-repeat center;
			}
			.basketball_card {
				.item {
					display: block;
					padding-top: 3px;
					min-width: 45px;
					& > div {
						display: block;
					}
					.icon-wrap {
						font-weight: 400;
						margin-bottom: 6px;
						margin-right: 0;
					}
					.number {
						font-family: HelveticaNeue-Medium;
						// font-size: 13px;
						font-weight: 500;
					}
				}
			}
		}
}
</style>
