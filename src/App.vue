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
	@import url('https://fonts.googleapis.com/css?family=Open+Sans:200,300,400');

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
		font-weight: 200;
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

	.btn {
		font-weight: 200;
		padding: 0.175rem 0.575rem;
	}

	.form-control {
		padding: 0.175rem 0.575rem;
	}
	.input-group-sm textarea.form-control {
		line-height: 1.75rem;
	}

	.input-group-addon {
		background-color: transparent;
	}

	h4, h5, h6 {
		font-weight: 200;
	}
	.vdp-datepicker__calendar {
		font-size: 1.25rem;
	}
	.vdp-datepicker__calendar .cell.highlighted {
		/*background: #cae5ed;*/
		background: #a08eaf !important;
	}
	.vdp-datepicker__calendar .cell.selected, .vdp-datepicker__calendar .cell.selected.highlighted, .vdp-datepicker__calendar .cell.selected:hover {
		/*background: #4bd !important;*/
		background: #9170ae !important;
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
		display: none;
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
		.masthead, .dropdown-menu, .card-footer, .review-edit-btn { display: none !important;}
		.mastfoot { display: block; }
		.card { border: none; }
		.card-body { padding: 0 }
		.review-container { padding-top: 0 !important; margin-left: 0; flex: 0 0 66.666667%; max-width: 100% }
		.wows-section { padding-top: 3rem;}
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
