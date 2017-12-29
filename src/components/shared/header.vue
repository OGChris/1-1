<template>
	<header class="masthead clearfix" style="z-index: 999;">
		<b-navbar fixed="top" toggleable="md" :type="headerType" variant="transparent" class="custom-navbar">

			<b-nav-toggle target="nav_collapse"></b-nav-toggle>

			<b-navbar-brand href="/">
				<img v-if="headerType === 'light'" src="../../assets/OGC_Logo-Orange-long.png" class="d-inline-block align-middle" height="32" alt="Orange Gate">
				<img v-else="" src="../../assets/OGC_Logo-White-long.png" class="d-inline-block align-middle" height="32" alt="Orange Gate">
			</b-navbar-brand>

			<b-collapse is-nav id="nav_collapse">

				<b-navbar-nav class="ml-auto" :class="[headerType === 'light' ? '' : 'text-white']">
					<strong class="d-inline-block align-middle">1:1 Update</strong>
					<span v-if="$route.params.week" class="d-inline-block align-middle">&nbsp;({{ $route.params.week | mWeekToRange }})</span>
				</b-navbar-nav>

				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-item v-if="user" title="Sign Out" @click.stop.prevent="signOut" v-b-tooltip.hover.bottom>
						<i class="fa fa-sign-out fa-2x"></i>
					</b-nav-item>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>
	</header>
</template>
<style>
	.custom-navbar {
		/*background: rgba(255, 255, 255, 1) !important;*/
	}
</style>
<script type="text/javascript">
  import $ from 'jquery';
  import { mapState } from 'vuex';

  export default {
    name: 'shared-header',
    data() {
      return {
        avatar: this.$root.defaultAvatar,
        activeBackground: localStorage.SelectedBackground || 'bg1',
        overideBackground: localStorage.OverideBackground || false,
        headerType: 'light',
      };
    },
    computed: mapState(['user', 'week']),
    methods: {
      signOut() {
        this.$root.fbAuth.signOut().then(() => {
          // Sign-out successful.
          window.location.reload();
        }).catch(() => {
          // An error happened.
        });
      },
      changeBackground(bg) {
        const html = $('html');
        html.css('background-image', `url("${this.$root.backgrounds[bg]}")`);
        localStorage.SelectedBackground = bg;
        this.activeBackground = bg;
      },
    },
    mounted() {
      this.$root.$on('header:type', (val) => { this.headerType = val; });
    },
  };
</script>
