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
					<b-nav-item :active="$route.path.indexOf('admin')!==-1" v-if="$root.isAdmin" to="admin">Admin</b-nav-item>
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

					<b-nav-item-dropdown right v-b-tooltip.hover.bottom title="Settings" no-caret>
						<!-- Using button-content slot -->
						<template slot="button-content">
							<i class="fa fa-cog fa-2x"></i>
						</template>
						<!--<b-dropdown-item disabled>Profile</b-dropdown-item>-->
						<b-dropdown-header>Change Background</b-dropdown-header>
						<b-dropdown-item :class="{ 'active': activeBackground === 'bg1' }" @click="changeBackground('bg1')">Background 1</b-dropdown-item>
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

  const defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHeAAAB3gF6X+LpAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAdFQTFRF/////6oA/8wa/78V/70J/70Q/78N/8MN/8EN/8EN/8IN/8IP/8IO/8EN/8AP/8AO/8EO/8EO/8EO/8EN/8EP/8EO/8EO/8AO/8EO/8EO/8EO/8EO/8EO/8EOMzMzNDQzNTQzNTUzNjUyNzYyODYyOTcyOjgyOzkyPDkxPToxPjsxPzsxQj4wQz4wRT8wRUAwRkAwR0EvSUIvSUMvTUUuTkYuT0YuUEcuVEotV0wsWE0sWU0sWk4sXVErXlErYVMrZFUqZVYqZlcqZ1cqaFgpaVgpa1opblwocV4odWEneWQmfWYmfmclf2glgmolhGskhWwkiW8jinAjjXEjj3MikXQikXUiknUik3YilHYhlXchmXogmXohnHwgnn4gn34foH8foX8fpIIfpoMep4QeqIQeqYUeq4cdrYgdrokdsIoctI0cto4bu5IavZMavpQav5QawJUZwZYZw5cZyJsYyZsYzJ0XzZ4Xzp8X0KAX06IW1aMW1qUV2aYV2acV26gV3KgU4awT4awU464T5K4T5a8T6LES6bES6bIS67MS7bQR7bUR7rUR77YR8bcR8rgQ87kQ9boQ9rsQ97sP+b0P+r4P+74P/L8P/cAO/sAO/8EOYHC6QQAAAB50Uk5TAAMKDBsfPExOYmRocHSKjqSwtr7Ay9XY5ery+Pn+bfME6gAAAs5JREFUWMOtV1dbE0EUnZAAIZ1U0o5UQQFFxY4KigULoFgBO9gFC2BDsWHBRiCUzK/1gWx2Z3aX7OxynpK7c873zZ07d84lRAd2p8cXCMUSiVgo4PM47UQIDncwSRkkg26HUXaJN5KmGkhHvCUG6DZXFdVFlctWjF8epesiWr4uvTRMiyJcqs8vi1MDiJfp8StS1BBSFdrZ81PD8Gvk0lZJBVCpVvBTIfhV+6eC4PJQlhIVSDFnURqnwogr6yFMTSCsqF8j61dUkUJV26JF2Z97dtR23OY0otJZuoryn28GABxaYMOu/P3n7+/K+4dDL+YUgV+tWMMF7nav9QcvG82cbQQAtI8VQnfyfNRl2bVeQgghETY4IK2unpVCp6UQ3rJrI4QQ4uD61zVpce0PKXSmIDDNdTkHIcTNZWBpYBsA1HRMFUKjEr9hmVvsJoQE1UmffXr39aLi//zOvMAgvzJIiD1poIgmmwEA3Vn+Q9JOnIbK9nvvvuZjD3LqD07ioZbgIT5rAj4SsCYQICFrAiESkw8rY0IgRhLSz7mGrf/EBRKywDtg3IxAYQvzwC0zW5CT2IZeM0mUj7ELnWaOUS6kfmw3U0geZd/5ZqKU5cs0DVwVFnAqr3MnWrKC/KRd2VDGgUeCAkGmpa3uxkFBATfbVEeAJ0L8tINt65kWNM6ICET4h2WiBntEbpRX9bSNAidzhvn5p415XPuBft2zXBw+9UXjcWWe9+Uu4MBHbf6rvcANreedMRh/jgANIxrbWDi/CTj+W8tgsBZn9WY9cGKCNyST7cCW+zlti8OZrA/7AbT2yRqZZ327AByd1TVZnM1bulwNAK3nLl4ZHL4+1F0PAE33cvo2T2U0v15qgRJNPY//rms01VY3OzZwuG6N3db3MlvU6mqa7eWfM1NvPs0bM9uW7b71gWMDRh7rQ5f1sW8DBk/ro+8GDN9i4/9/nurQohsZlRwAAAAASUVORK5CYII=';

  export default {
    name: 'header',
    data() {
      return {
        avatar: defaultAvatar,
        activeBackground: localStorage.SelectedBackground || 'bg1',
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
