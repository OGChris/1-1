<template>
	<div class="wrapper">
		<div v-if="ready" id="fullpage">
			<wows :preloaded="preloaded"></wows>
			<opportunities></opportunities>
			<objectives></objectives>
		</div>
		<b-container class="avatar-overlay ml-5">
			<b-row style="display: table-cell;vertical-align: middle;">
				<div class="col-xs-12 align-self-center">
					<b-img :src="user && user.photoURL ? user.photoURL : $root.defaultAvatar" center fluid rounded="circle" alt="Avatar" />
				</div>
			</b-row>
		</b-container>

	</div>
</template>
<style>
	.wrapper {
		min-height: 100%;
		height: -webkit-fill-available;
		height: -moz-fill-available;
	}
	.inner-wrapper row {
		z-index: 10;
	}
	.avatar-overlay  {
		width: 25%;
		min-height: 100%;
		min-height: -webkit-fill-available;
		min-height: -moz-fill-available;
		position: fixed;
		display: table;
		top: 0
	}
	.inner-wrapper h4, .inner-wrapper h6 { text-align: left; font-weight: 300; color: #333333 !important; }
	.inner-wrapper h4 {
		color: #3c4488 !important;
		font-size: 3rem;
	}
</style>
<script type="text/javascript">
  /* eslint-disable no-unused-vars,no-param-reassign */
  import $ from 'jquery';
  import { mapState } from 'vuex';

  import { TimelineMax, TweenMax, Power4 } from 'gsap';
  import wows from './Wows';
  import opportunities from './Opportunities';
  import objectives from './Objectives';


  export default {
    name: 'wrapper',
    components: { wows, opportunities, objectives },
    data() {
      return {
        ready: false,
        preloaded: false,
      };
    },
    computed: mapState(['user', 'week']),
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
      initFullPage() {
        const self = this;
        $('#fullpage').fullpage({
          // Navigation
          anchors: ['WOWs', 'Serendipity', 'Priorities'],
          navigation: true,
          navigationPosition: 'right',
          navigationTooltips: ['WOWs', 'Serendipity', 'Priorities'],
          // Scrolling
          css3: true,
          scrollbar: true,
          scrollOverflow: true,
          // normalScrollElements: '.card-body',
          // autoScrolling: false,
          // Accessibility
          keyboardScrolling: true,
          animateAnchor: true,
          recordHistory: true,
          // Events
          // eslint-disable-next-line no-unused-vars
          onLeave(index, nextIndex, direction) {
            if (nextIndex === 1) {
              self.$root.$emit('header:type', 'light');
            }
            // if (index === 3) {
            //   $.fn.fullpage.setAutoScrolling(true);
            // }
          },
          // eslint-disable-next-line no-unused-vars
          afterLoad(anchorLink, index) {
            if (index !== 1) {
              self.$root.$emit('header:type', 'dark');
            }
            // if (index === 3) {
            //   $.fn.fullpage.setAutoScrolling(false);
            // }
          },
          // eslint-disable-next-line no-unused-vars
          afterRender() {
            // console.log('Loaded');
          },
        });
        // console.log('Init fullpage.js');
      },
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (!vm.$root.collection.weekOf) {
          vm.$getItem(vm.$route.params.week, (error, data) => {
            if (data) {
              vm.$root.collection = data;
              vm.preloaded = true;
            } else {
              vm.$root.collection.weekOf = vm.$route.params.week;
            }
            vm.ready = true;
            // let components initiate then load fullpage.js on next tick
            vm.$nextTick(() => {
              vm.initFullPage();
            });
          });
        } else {
          vm.ready = true;
          // let components initiate then load fullpage.js on next tick
          vm.$nextTick(() => {
            vm.initFullPage();
          });
        }
      });
    },
    beforeRouteLeave(to, from, next) {
      this.$root.$emit('header:type', 'light');
      $.fn.fullpage.destroy('all');
      next();
    },
    mounted() {
      // to review
      this.$root.$on('to:review', () => {
        this.$router.push(`/reports/${this.$root.collection.weekOf}/review`);
      });
    },
  };
</script>
