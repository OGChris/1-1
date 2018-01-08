<template>
	<div>
		<header class="masthead clearfix" style="z-index: 999;">
			<b-navbar fixed="top" toggleable="md" :type="headerType" variant="transparent" class="custom-navbar">

				<b-nav-toggle target="nav_collapse"></b-nav-toggle>

				<b-navbar-brand href="/">
					<img v-if="headerType === 'light'" src="../../assets/OGC_Logo-Orange-long.png" class="d-inline-block align-middle" width="186" alt="Orange Gate">
					<img v-else="" src="../../assets/OGC_Logo-White-long.png" class="d-inline-block align-middle" width="186" alt="Orange Gate">
				</b-navbar-brand>

				<b-collapse is-nav id="nav_collapse">

					<b-navbar-nav class="ml-auto" :class="[headerType === 'light' ? '' : 'text-white']" style="font-size: 1.5rem">
						<strong class="d-inline-block align-middle">1:1 Update</strong>
						<span v-if="$route.params.week" class="d-inline-block align-middle">&nbsp;({{ $route.params.week | mWeekToRange }})</span>
					</b-navbar-nav>

					<!-- Right aligned nav items -->
					<b-navbar-nav class="ml-auto">
						<b-nav-item v-if="user" title="Sign Out" @click.stop.prevent="signOut" v-b-tooltip.hover.bottom>
							<i class="fa fa-sign-out"></i>
						</b-nav-item>
					</b-navbar-nav>
				</b-collapse>
			</b-navbar>
		</header>
		<footer class="mastfoot clearfix" style="z-index: 999;">
			<b-navbar fixed="bottom" toggleable="md" type="light" variant="transparent" class="custom-navbar">
				<b-navbar-nav>
					<span class="d-inline-block">© 2018 Orange Gate Consulting Inc.</span>
				</b-navbar-nav>

				<b-navbar-nav class="ml-auto">
					<img src="../../assets/OGC_Logo-Black-long.png" class="d-inline-block align-middle" width="186" alt="Orange Gate">
				</b-navbar-nav>
			</b-navbar>
		</footer>
	</div>
</template>
<style>
	.custom-navbar {
		/*background: rgba(255, 255, 255, 1) !important;*/
		padding-left: 52px;
		padding-top: 43.5px;
	}

	@media (min-width: 768px) {
		.navbar-brand {
			 position: absolute;
		 }
	}
</style>
<script type="text/javascript">
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
        this.$removeItem('auth');
      },
    },
    mounted() {
      this.$root.$on('header:type', (val) => { this.headerType = val; });
    },
  };
</script>
