<template>
	<div class="app-root mt-5 pt-5" style="height: 100%;">
		<shared-header></shared-header>

		<transition @enter="enter" @leave="leave" :css="false" appear>
			<router-view></router-view>
		</transition>

		<b-modal id="historyModal" title="View History" size="lg" ok-only ok-title="Close">
			<template v-if="activeHistory.length">
				<h4 v-text="`${activeHistory[0].item} Timeline`"></h4>
				<b-table small head-variant="dark" striped hover :items="activeHistory"
				         :fields="['stage', 'status', 'next_steps', 'who', 'date', 'week_of']">
					<template slot="stage" scope="data">
						{{ getStageObject(data.value).name }}
					</template>
					<template slot="next_steps" scope="data">
						<ol class="text-left">
							<li v-for="(step, index) in data.value" v-text="step.text"></li>
						</ol>
					</template>
				</b-table>
			</template>

		</b-modal>

	</div>
</template>

<script>
  import _ from 'underscore';
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
    computed: mapState(['user']),
    watch: {
      $route(to, from) {
        const toDepth = to.path.split('/').length;
        const fromDepth = from.path.split('/').length;
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
      },
    },
    beforeCreate() {
      Firebase.auth().onAuthStateChanged((user) => {
        // initially user = null, after auth it will be either <fb_user> or false
        this.$store.commit('setUser', user || false);
        if (user) {
          // get current report for user filter by week first to limit results then filter by uid
          this.$root.fbDatabase.collection('reports')
            .where('week_of', '==', localStorage.SelectedWeek || moment().format('YYYY-[W]ww'))
            .where('uid', '==', this.user.uid).limit(1)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if (doc.exists) {
                  this.$store.commit('setCurrentReport', doc);
                }
              });
            })
            .catch((error) => {
              console.log('Error getting document: ', error);
            });
        }
      });
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
      signOut() {
        this.$root.fbAuth.signOut().then(() => {
          // Sign-out successful.
          window.location.reload();
        }).catch(() => {
          // An error happened.
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
      this.$root.$on('HistoryModal:SET', (data) => {
        this.activeHistory = data;
      });

      this.$root.$on('HistoryModal:CLEAR', () => {
        this.activeHistory = null;
      });
    },
  };
</script>

<style>
	/*
 * Globals
 */

	/* Links */
	a,
	a:focus,
	a:hover {
		color: #fff;
	}

	/* Custom default button */
	.btn-secondary,
	.btn-secondary:hover,
	.btn-secondary:focus {
		color: #333;
		text-shadow: none; /* Prevent inheritance from `body` */
		background-color: #fff;
		border: .05rem solid #fff;
	}

	/*
	 * Base structure
	 */

	html {
		height: 100%;
		/*overflow-y: hidden;*/
		background-image: url('assets/fall.jpg');
		background-color: transparent;
		background-size: cover;
		background-position: center center;
		background-attachment: fixed;
	}
	html,
	body {
		min-height: 100%;
		height: -webkit-fill-available;
		height: -moz-fill-available;
		/*background-attachment: fixed;*/
		/*background: url("data:image/png;base64,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") repeat;*/
		/*background-color: #333;*/
	}

	body {
		/*color: #fff;*/
		/*background-color: rgba(255, 255, 255, .5);*/
		background: transparent;
		text-align: center;
		/*text-shadow: 0 .05rem .1rem rgba(0,0,0,.5);*/
	}

	.app-root {
		/*background-color: rgba(255, 255, 255, .5);*/
	}

	/* P5 Canvas styles */
	canvas#defaultCanvas0 {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	/* Extra markup and styles for table-esque vertical and horizontal centering */
	.site-wrapper {
		display: table;
		width: 100%;
		height: 100%; /* For at least Firefox */
		min-height: 100%;
		/*box-shadow: inset 0 0 5rem rgba(0,0,0,.5);*/
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
		padding: 2rem;
	}

	/*
	 * Header
	 */

	.custom-navbar {
		background: rgba(255, 255, 255, .5) !important;
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
		padding: 0 1.5rem;
	}

	.cover .btn-lg {
		padding: .75rem 1.25rem;
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
