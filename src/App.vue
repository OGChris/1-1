<template>
	<div class="app-root">
		<shared-header></shared-header>

		<transition @enter="enter" @leave="leave" :css="false" appear>
			<router-view></router-view>
		</transition>

	</div>
</template>

<script>
  import _ from 'underscore';
  import swal from 'sweetalert';
  import $ from 'jquery';
  import moment from 'moment';
  import Firebase from 'firebase';

  import { mapState } from 'vuex';
  import { TimelineMax, TweenMax, Power4 } from 'gsap';

  export default {
    name: 'app',
    data() {
      return {
        transitionName: 'slide-left',
        activeHistory: [],
        stepsFields: [
          { key: 'text', sortable: false },
          { key: 'who', sortable: false },
          { key: 'due_date', sortable: true },
        ],
        stageOptions: [
          { name: 'Initiate', code: 'I', value: '1' },
          { name: 'Define', code: 'D1', value: '2' },
          { name: 'Design', code: 'D2', value: '3' },
          { name: 'Develop', code: 'D3', value: '4' },
          { name: 'Deliver', code: 'D4', value: '5' },
          { name: 'Close', code: 'C', value: '6' },
        ],
      };
    },
    computed: mapState(['user', 'week']),
    watch: {
      $route(to, from) {
        const toDepth = to.path.split('/').length;
        const fromDepth = from.path.split('/').length;
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
      },
      week() {
        debugger;
      },
      /* user(val) {
        // eslint-disable-next-line max-len
        // const backgrounds = { AndreaBG, EthanBG, GinnyBG, HarpreetBG, JannekeBG, KeerththanaBG,
        KeyanBG, KriskaBG, LeeBG, NayeonBG, OzgeBG, TomBG, YsabelBG };
        // if (val && backgrounds) {
        // const bg = _.find(backgrounds, item => item);
        // eslint-disable-next-line max-len
        // const bg = _.find(backgrounds, item => item.toLowerCase()
        .includes(val.displayName.split(' ')[0].toLowerCase())) || JannekeBG;
        // if (bg) this.changeBackground(bg);
        // }
      }, */
    },
    beforeCreate() {
      const self = this;
      Firebase.auth().onAuthStateChanged((user) => {
        // initially user = null, after auth it will be either <fb_user> or false
        self.$store.commit('setUser', user || false);
        if (user) {
          // get user metadata, check for admin
          self.$root.fbDatabase.collection('users').doc(user.uid).get().then((doc) => {
            self.$root.isAdmin = doc.data().admin;
          });
          // get current report for user filter by week first to limit results then filter by uid
          self.$root.fbDatabase.collection('reports')
            .where('week_of', '==', localStorage.SelectedWeek || moment().format('YYYY-[W]ww'))
            .where('uid', '==', user.uid).limit(1)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if (doc.exists) {
                  this.$store.commit('setCurrentReport', doc);
                }
              });
            })
            .catch((error) => {
              swal('Something went wrong!', error, 'error');
            });
        }
      });
    },
    methods: {
      changeBackground(bg) {
        const html = $('html');
        html.css('background-image', `url("${bg}")`);
        html.css('background-color', '#FFFFFF');
        html.css('background-position', 'center bottom');
        localStorage.OverideBackground = true;
        localStorage.SelectedBackground = bg;
        this.activeBackground = bg;
      },

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
      // Modal functions
      hideModal() {
        this.$root.$emit('bv::hide::modal', 'historyModal');
      },
      getStageObject(val) {
        return val ? _.findWhere(this.stageOptions, { value: val }) : '';
      },
      onHidden() {
        // Return focus to our Open Modal button
        // See accessibility below for additional return-focus methods
        this.$refs.btnShow.$el.focus();
      },
    },
    mounted() {
      const week = localStorage.selectedWeek;
      if (week) {
        this.$store.commit('setWeek', week);
      }
    },
  };
</script>
<style lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400');

	/*
     * Globals
     */

	/*
	 * Base structure
	 */

	html {
		height: 100%;
		/*overflow-y: hidden;*/
		/*background-image: url('assets/bg1.jpg');*/
		background-color: white;
		/*background-size: cover;*/
		/*background-position: center center;*/
		/*background-attachment: fixed;*/
	}
	html,
	body {
		font-family: 'Open Sans', sans-serif;
		font-weight: 300;
		min-height: 100%;
		height: -webkit-fill-available;
		height: -moz-fill-available;
	}

	body {
		color: #333333;
		background: white;
		text-align: center;
	}

	.app-root {
		min-height: 100%;
		height: -webkit-fill-available;
		height: -moz-fill-available;
		/*background-color: rgba(255, 255, 255, .5);*/
	}

	/* Extra markup and styles for table-esque vertical and horizontal centering */
	.site-wrapper {
		display: table;
		width: 100%;
		height: 100%; /* For at least Firefox */
		min-height: 100%;
	}

	.site-wrapper-inner {
		display: table-cell;
		vertical-align: top;
	}

	.cover-container {
		margin-right: auto;
		margin-left: auto;
	}

	/* Padding for spacing */
	.inner {
		/*padding: 2rem;*/
	}

	/*
	 * Header
	 */
	h1 {

	}

	.active-animation {
		position: absolute;
		top: 30px;
		left: 50%;
		transform: translate(-50%, 0);
	}

	/*
	 * Cover
	 */

	.cover {
		/*padding: 0 1.5rem;*/
	}

	.cover .btn-lg {
		/*padding: .75rem 1.25rem;*/
		font-weight: 700;
	}

	/*
	 * Footer
	 */

	.mastfoot {
		color: rgba(255, 255, 255, .5);
	}

	/*
	 * Affix and center
	 */

	@media (min-width: 40em) {
		/* Pull out the header and footer */
		.masthead {
			position: fixed;
			top: 0;
		}

		.mastfoot {
			position: fixed;
			bottom: 0;
		}

		/* Start the vertical centering */
		.site-wrapper-inner {
			vertical-align: middle;
		}

		/* Handle the widths */
		.masthead,
		.mastfoot,
		.cover-container {
			width: 100%; /* Must be percentage or pixels for horizontal alignment */
		}
	}

	@media (min-width: 62em) {
		.masthead,
		.mastfoot,
		.cover-container {
			width: 42rem;
		}
	}

	@media print {
		#nav_collapse, .navbar-toggler, .dropdown-menu, .card-footer, .review-edit-btn { display: none !important;}
	}

	/*
	 * Transitions
	 */
	.slide-left-leave-active,
	.slide-left-enter-active,
	.slide-right-leave-active,
	.slide-right-enter-active {
		transition: 300s;
	}

	.slide-left-enter, .slide-right-leave-active {
		opacity: 1;
		-webkit-transform: translate(100%, 0);
		transform: translate(100%, 0);
	}

	.slide-left-leave-active, .slide-right-enter {
		opacity: 1;
		-webkit-transform: translate(-100%, 0);
		transform: translate(-100%, 0);
	}

	.slide-leave-active,
	.slide-enter-active {
		transition: 1s;
	}

	.slide-enter {
		transform: translate(100%, 0);
	}

	.slide-leave-to {
		transform: translate(-100%, 0);
	}
</style>
