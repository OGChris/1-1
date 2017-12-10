<template>
	<header class="masthead clearfix" style="z-index: 999;">
		<b-navbar fixed="top" toggleable="md" type="light" variant="light" class="custom-navbar">

			<b-nav-toggle target="nav_collapse"></b-nav-toggle>

			<b-navbar-brand href="/">
				<img src="../../assets/OGC_Logo-Orange-long.png" class="d-inline-block align-middle" height="32" alt="Orange Gate"> <span class="d-inline-block align-middle">1:1 Update</span>
			</b-navbar-brand>

			<b-collapse is-nav id="nav_collapse">

				<b-navbar-nav>
					<b-nav-item to="Hello">Home</b-nav-item>
					<b-nav-item :active="$route.path.indexOf('admin')!==-1" v-if="$root.isAdmin" to="/admin">Overview</b-nav-item>
				</b-navbar-nav>

				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-item>
						<img :src="user && user.photoURL ? user.photoURL : avatar" height="32" class="rounded-circle"
						     alt="Avatar">
						&nbsp;
						<template v-if="user">{{user.displayName || user.email}}</template>
						<template v-else>Anonymous</template>
					</b-nav-item>

					<b-nav-item-dropdown v-if="!overideBackground" right v-b-tooltip.hover.bottom title="Settings" no-caret>
						<!-- Using button-content slot -->
						<template slot="button-content">
							<i class="fa fa-cog fa-2x"></i>
						</template>
						<!--<b-dropdown-item disabled>Profile</b-dropdown-item>-->
						<b-dropdown-header>Change Background</b-dropdown-header>
						<b-dropdown-item  :class="{ 'active': activeBackground === 'bg1' }" @click="changeBackground('bg1')">Background 1</b-dropdown-item>
						<b-dropdown-item :class="{ 'active': activeBackground === 'bg2' }" @click="changeBackground('bg2')">Background 2</b-dropdown-item>
						<b-dropdown-item :class="{ 'active': activeBackground === 'bg3' }" @click="changeBackground('bg3')">Background 3</b-dropdown-item>
						<b-dropdown-item :class="{ 'active': activeBackground === 'bg4' }" @click="changeBackground('bg4')">Background 4</b-dropdown-item>
					</b-nav-item-dropdown>

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

  const defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTExLTI2VDIwOjIyOjQzLTA1OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0xMS0yNlQyMDoyNDoyNS0wNTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0xMS0yNlQyMDoyNDoyNS0wNTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1MDQxMjAxNC01MTczLTQ3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';

  export default {
    name: 'header',
    data() {
      return {
        avatar: defaultAvatar,
        activeBackground: localStorage.SelectedBackground || 'bg1',
        overideBackground: localStorage.OverideBackground || false,
      };
    },
    computed: mapState(['user']),
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

    },
  };
</script>
