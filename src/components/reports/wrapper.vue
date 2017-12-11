<template>
	<div class="col">
			<!--<h2 class="text-white">Report for {{ $route.params.week }}</h2>-->
			<div class="stepwizard col">
				<div class="stepwizard-row setup-panel row">
					<div class="stepwizard-step col" v-for="(child, index) in children">
						<b-btn :to="child.path || child.name" :variant="$route.name === child.name ? 'primary' : 'dark'" class="btn-circle" v-text="index+1"></b-btn>
						<p>
							<b-link :to="child.path || child.name" :class="$route.name === child.name ? 'text-primary' : 'text-dark'" v-text="child.name"></b-link>
						</p>

					</div>
				</div>
			</div>
			<div class="container">

				<transition @enter="enter" @leave="leave" :css="false" appear>
					<router-view></router-view>
				</transition>
			</div>
		</div>
</template>
<style>
	.stepwizard-step p {
		margin-top: 10px;
	}

	.stepwizard-row {
		/*display: table-row;*/
	}

	.stepwizard {
		/*display: table;*/
		width: 100%;
		position: relative;
	}

	.stepwizard-step button[disabled] {
		opacity: 1 !important;
		filter: alpha(opacity=100) !important;
	}

	.stepwizard-row:before {
		top: 14px;
		bottom: 0;
		position: absolute;
		content: " ";
		width: 100%;
		height: 1px;
		background-color: #ccc;
		z-order: 0;

	}

	.stepwizard-step {
		/*display: table-cell;*/
		text-align: center;
		position: relative;
	}

	.btn-circle {
		width: 30px;
		height: 30px;
		text-align: center;
		padding: 6px 0;
		font-size: 12px;
		line-height: 1.428571429;
		border-radius: 15px;
	}
</style>
<script type="text/javascript">
  import { TimelineMax, TweenMax, Power4 } from 'gsap';

  export default {
    name: 'wrapper',
    data() {
      return {
        children: [
          { name: 'WoWs' },
          { name: 'Objectives' },
          { name: 'Opportunities' },
          { name: 'Status Reports', path: 'status-reports' },
          { name: 'Review' },
        ],
      };
    },
    methods: {
      enter(el, done) {
        const tl = new TimelineMax({
          // id: 'Page Enter',
          onComplete: done,
        });

        tl.set(el, {
          x: window.innerWidth * 1.5,
          // transformOrigin: '50% 50%',
        });

        tl.to(el, 1, {
          x: 0,
          ease: Power4.easeOut,
        });
      },
      leave(el, done) {
        TweenMax.fromTo(el, 1, {
          autoAlpha: 1,
          position: 'absolute',
        }, {
          autoAlpha: 0,
          ease: Power4.easeOut,
          onComplete: done,
        });
      },
    },
    mounted() {
    },
  };
</script>
