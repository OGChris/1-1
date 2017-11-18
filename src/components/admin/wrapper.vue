<template>
	<div class="col-xs-12 align-self-center mt-5">
			<main id="dashboard" role="main" class="inner cover">
				<b-card no-body>
					<b-card-header class="text-left">
						Admin Dashboard: {{$route.name}}
					</b-card-header>
					<b-row>
						<b-col></b-col>
					</b-row>
					<b-row>
						<b-col cols="3">
							<b-nav pills vertical fill class="text-left">
								<b-nav-item :active="$route.path === '/admin'"><i class="fa fa-th-large"></i> Dashboard</b-nav-item>
								<b-nav-item disabled><hr></b-nav-item>
								<b-nav-item to="/admin/wows" :active="$route.path === '/admin/wows'">WOWs</b-nav-item>
								<b-nav-item to="/admin/objectives" :active="$route.path === '/admin/objectives'">Objectives</b-nav-item>
								<b-nav-item to="/admin/opportunities" :active="$route.path === '/admin/opportunities'">Opportunities</b-nav-item>
								<b-nav-item to="/admin/status-reports" :active="$route.path === '/admin/status-reports'">Status Reports</b-nav-item>
								<!--<b-nav-item>WOWs</b-nav-item>-->
							</b-nav>
						</b-col>
						<b-col cols="9">
							<transition @enter="enter" @leave="leave" :css="false" appear>
								<router-view></router-view>
							</transition>
						</b-col>
					</b-row>
				</b-card>
			</main>
		</div>
</template>
<script type="text/javascript">
  import { TimelineMax, TweenMax, Power4 } from 'gsap';

  export default {
    name: 'wrapper',
    beforeRouteEnter(to, from, next) {
      next(() => {
        // if (!vm.$root.isAdmin) next('/');
      });
    },
    data() {
      return {};
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
    mounted() {},
  };
</script>
