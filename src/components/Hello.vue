<template>
	<div class="offset-md-2 col-md-8 col-xs-12 align-self-center mt-5">
		<main role="main" class="inner cover">
			<div class="hello">
				<template v-if="!user">
					<h1 class="text-white">{{ heading }}</h1>
					<template v-if="showAvatarLogin">
						<b-card title="Select your Avatar">
							<b-btn variant="outline-primary" class="m-1" v-for="(avatar, key) in avatars" :key="key" @click="loginAvatarSelected(key)">
								<b-img :src="avatar" rounded="circle" width="50" height="50" blank-color="#777" alt="img" class="m-1" />
								<br>{{ key }}
							</b-btn>
							<!--<b-form id="avatar-login" @submit.prevent="">
								<b-form-group>

									<b-form-radio-group id="avatars-login" buttons button-variant="outline-primary"
									                    style="flex-wrap: wrap;justify-content: center;"
									                    v-model="registerData.photoURL" name="avatars" required>
										<b-form-radio v-for="(avatar, key) in avatars" :key="key" @change="loginAvatarSelected(key)">
											<b-img :src="avatar" rounded="circle" width="50" height="50" blank-color="#777" alt="img" class="m-1" />
											<br>{{ key }}
										</b-form-radio>
									</b-form-radio-group>
								</b-form-group>
							</b-form>-->

							<!--<div class="text-center">
								<p class="text-center">If you do not see your avatar</p>
								<b-btn variant="secondary">Login with email and password</b-btn>
							</div>-->


						</b-card>
					</template>
					<template v-else>
						<b-card no-body>
							<b-tabs small card ref="tabs" class="nav-fill" v-model="tabIndex">

								<b-tab title="Login">
									<b-form id="login" @submit.prevent="login" data-vv-scope="login">
										<b-form-group id="login-email-group" label-for="login-email">
											<b-form-input v-model="loginData.email" id="login-email" type="email"
											              placeholder="Enter your email"></b-form-input>
										</b-form-group>
										<b-form-group id="login-password-group" label-for="login-password">
											<b-form-input v-model="loginData.password" id="login-password" type="password"
											              placeholder="Enter your password"></b-form-input>
										</b-form-group>
										<b-button type="submit" variant="primary">Log In</b-button>
									</b-form>
								</b-tab>

								<b-tab title="Register">
									<b-form id="register" @submit.prevent="register" data-vv-scope="register">
										<b-form-group id="register-name-group" label-for="register-name" class="text-left">
											<label for="register-name">Enter your name</label>
											<b-form-input v-model="registerData.displayName" id="register-name" type="text"
											              required placeholder="Jane Doe"></b-form-input>
										</b-form-group>
										<b-form-group id="register-email-group" label-for="register-email" class="text-left">
											<label for="register-email">Enter your email</label>
											<b-form-input v-model="registerData.email" id="register-email" type="email"
											              required placeholder="abc@orangegate.ca"></b-form-input>
										</b-form-group>
										<b-form-group id="register-password-group" label-for="register-password" class="text-left">
											<label for="register-password">Enter your password</label>
											<b-form-input v-model="registerData.password" id="register-password"
											              type="password" required
											              placeholder="******"></b-form-input>
										</b-form-group>
										<b-form-group>
											<label for="radios2">Select your Avatar</label>
											<b-form-radio-group id="radios2" buttons button-variant="outline-primary"
											                    style="flex-wrap: wrap;justify-content: center;"
											                    v-model="registerData.photoURL" name="avatars" required>
												<b-form-radio v-for="(avatar, key) in avatars" :key="key" :value="avatar">
													<b-img :src="avatar" rounded="circle" width="50" height="50" blank-color="#777" alt="img" class="m-1" />
												</b-form-radio>
											</b-form-radio-group>
										</b-form-group>
										<b-button type="submit" variant="primary">Register</b-button>
									</b-form>
								</b-tab>
							</b-tabs>
						</b-card>
					</template>

					<b-modal ref="avatarLoginModal" title="Authentication" @ok="login">
						<div v-if="selectedLoginAvatar">
							<img :src="selectedLoginAvatar && selectedLoginAvatar.photoURL ? selectedLoginAvatar.photoURL : defaultAvatar" height="32" class="rounded-circle"
							     alt="Avatar">
							&nbsp;
							{{selectedLoginAvatar.displayName || selectedLoginAvatar.email}}
						</div>
						<b-form id="login" data-vv-scope="login">
							<b-form-group id="login-password-group" label-for="login-password">
								<b-form-input ref="focusThis" v-model="loginData.password" id="login-password" type="password"
								              placeholder="Enter your password"></b-form-input>
							</b-form-group>
						</b-form>
					</b-modal>

					<b-modal ref="avatarRegisterModal" title="Register" @shown="$refs.focusThis.focus()" @ok="register">
						<b-form id="register" data-vv-scope="register">
							<b-form-group id="register-name-group" label-for="register-name" class="text-left">
								<label for="register-name">Enter your name</label>
								<b-form-input v-model="registerData.displayName" id="register-name" type="text"
								              required placeholder="Jane Doe"></b-form-input>
							</b-form-group>
							<b-form-group id="register-email-group" label-for="register-email" class="text-left">
								<label for="register-email">Enter your email</label>
								<b-form-input v-model="registerData.email" id="register-email" type="email"
								              required placeholder="abc@orangegate.ca"></b-form-input>
							</b-form-group>
							<b-form-group id="register-password-group" label-for="register-password" class="text-left">
								<label for="register-password">Enter your password</label>
								<b-form-input v-model="registerData.password" id="register-password"
								              type="password" required
								              placeholder="******"></b-form-input>
							</b-form-group>
							<!--<b-form-group>
								<label for="radios2">Select your Avatar</label>
								<b-form-radio-group id="radios2" buttons button-variant="outline-primary"
								                    style="flex-wrap: wrap;justify-content: center;"
								                    v-model="registerData.photoURL" name="avatars" required>
									<b-form-radio v-for="(avatar, key) in avatars" :key="key" :value="avatar">
										<b-img :src="avatar" rounded="circle" width="50" height="50" blank-color="#777" alt="img" class="m-1" />
									</b-form-radio>
								</b-form-radio-group>
							</b-form-group>-->
							<!--<b-button type="submit" variant="primary">Register</b-button>-->
						</b-form>
					</b-modal>

				</template>
				<template v-else>
					<h1 class="text-white">Welcome Back
						<template v-if="user.displayName">, {{user.displayName}}!</template>
					</h1>
					<br>
					<b-form @submit.prevent="beginReport" novalidate>
						<!--<label for="reportWeek">Week</label>-->
						<b-input-group size="lg">
							<b-input-group-addon><i class="fa fa-calendar"></i></b-input-group-addon>
							<b-input id="reportWeek" type="week" v-model="weekOf" min="minWeek" max="maxWeek" required
								v-validate="'required'" name="reportWeek" @input="weekChanged"></b-input>
							<b-input-group-button class="d-none d-md-block">
								<b-btn type="submit" variant="primary" :disabled="disableButton">
									{{ currentReport ? 'Continue' : 'Begin'}}
								</b-btn>
								<b-btn @click="toReview" :disabled="disableButton || !currentReport">
									Review
								</b-btn>
							</b-input-group-button>
						</b-input-group>

						<b-btn-group class="d-md-none" size="lg">
							<b-btn type="submit" variant="primary" :disabled="disableButton">
								{{ currentReport ? 'Continue' : 'Begin'}}
							</b-btn>
							<b-btn @click="toReview" :disabled="disableButton || !currentReport">
								Review
							</b-btn>
						</b-btn-group>
					</b-form>

				</template>
			</div>
		</main>
	</div>
</template>

<script>
  import _ from 'underscore';
  import { mapState } from 'vuex';
  import moment from 'moment';
  import Andrea from '../assets/avatar/Andrea.png';
  import Ethan from '../assets/avatar/Ethan.png';
  import Ginny from '../assets/avatar/Ginny.png';
  import Harpreet from '../assets/avatar/Harpreet.png';
  import Janneke from '../assets/avatar/Janneke.png';
  import Keerththana from '../assets/avatar/Keerththana.png';
  import Keyan from '../assets/avatar/Keyan.png';
  import Kriska from '../assets/avatar/Kriska.png';
  import Lee from '../assets/avatar/Lee.png';
  import Nayeon from '../assets/avatar/Nayeon.png';
  import Ozge from '../assets/avatar/Ozge.png';
  import Tom from '../assets/avatar/tom.png';
  import Ysabel from '../assets/avatar/Ysabel NEW.png';

  const defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHeAAAB3gF6X+LpAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAdFQTFRF/////6oA/8wa/78V/70J/70Q/78N/8MN/8EN/8EN/8IN/8IP/8IO/8EN/8AP/8AO/8EO/8EO/8EO/8EN/8EP/8EO/8EO/8AO/8EO/8EO/8EO/8EO/8EO/8EOMzMzNDQzNTQzNTUzNjUyNzYyODYyOTcyOjgyOzkyPDkxPToxPjsxPzsxQj4wQz4wRT8wRUAwRkAwR0EvSUIvSUMvTUUuTkYuT0YuUEcuVEotV0wsWE0sWU0sWk4sXVErXlErYVMrZFUqZVYqZlcqZ1cqaFgpaVgpa1opblwocV4odWEneWQmfWYmfmclf2glgmolhGskhWwkiW8jinAjjXEjj3MikXQikXUiknUik3YilHYhlXchmXogmXohnHwgnn4gn34foH8foX8fpIIfpoMep4QeqIQeqYUeq4cdrYgdrokdsIoctI0cto4bu5IavZMavpQav5QawJUZwZYZw5cZyJsYyZsYzJ0XzZ4Xzp8X0KAX06IW1aMW1qUV2aYV2acV26gV3KgU4awT4awU464T5K4T5a8T6LES6bES6bIS67MS7bQR7bUR7rUR77YR8bcR8rgQ87kQ9boQ9rsQ97sP+b0P+r4P+74P/L8P/cAO/sAO/8EOYHC6QQAAAB50Uk5TAAMKDBsfPExOYmRocHSKjqSwtr7Ay9XY5ery+Pn+bfME6gAAAs5JREFUWMOtV1dbE0EUnZAAIZ1U0o5UQQFFxY4KigULoFgBO9gFC2BDsWHBRiCUzK/1gWx2Z3aX7OxynpK7c873zZ07d84lRAd2p8cXCMUSiVgo4PM47UQIDncwSRkkg26HUXaJN5KmGkhHvCUG6DZXFdVFlctWjF8epesiWr4uvTRMiyJcqs8vi1MDiJfp8StS1BBSFdrZ81PD8Gvk0lZJBVCpVvBTIfhV+6eC4PJQlhIVSDFnURqnwogr6yFMTSCsqF8j61dUkUJV26JF2Z97dtR23OY0otJZuoryn28GABxaYMOu/P3n7+/K+4dDL+YUgV+tWMMF7nav9QcvG82cbQQAtI8VQnfyfNRl2bVeQgghETY4IK2unpVCp6UQ3rJrI4QQ4uD61zVpce0PKXSmIDDNdTkHIcTNZWBpYBsA1HRMFUKjEr9hmVvsJoQE1UmffXr39aLi//zOvMAgvzJIiD1poIgmmwEA3Vn+Q9JOnIbK9nvvvuZjD3LqD07ioZbgIT5rAj4SsCYQICFrAiESkw8rY0IgRhLSz7mGrf/EBRKywDtg3IxAYQvzwC0zW5CT2IZeM0mUj7ELnWaOUS6kfmw3U0geZd/5ZqKU5cs0DVwVFnAqr3MnWrKC/KRd2VDGgUeCAkGmpa3uxkFBATfbVEeAJ0L8tINt65kWNM6ICET4h2WiBntEbpRX9bSNAidzhvn5p415XPuBft2zXBw+9UXjcWWe9+Uu4MBHbf6rvcANreedMRh/jgANIxrbWDi/CTj+W8tgsBZn9WY9cGKCNyST7cCW+zlti8OZrA/7AbT2yRqZZ327AByd1TVZnM1bulwNAK3nLl4ZHL4+1F0PAE33cvo2T2U0v15qgRJNPY//rms01VY3OzZwuG6N3db3MlvU6mqa7eWfM1NvPs0bM9uW7b71gWMDRh7rQ5f1sW8DBk/ro+8GDN9i4/9/nurQohsZlRwAAAAASUVORK5CYII=';

  export default {
    name: 'hello',
    data() {
      return {
        loading: false,
        showAvatarLogin: true,
        disableButton: false,
        heading: 'Welcome to 1:1',
        minWeek: moment().subtract(1, 'weeks').format('YYYY-[W]ww'),
        maxWeek: moment().add(1, 'weeks').format('YYYY-[W]ww'),
        weekOf: localStorage.SelectedWeek || moment().format('YYYY-[W]ww'),
        loginData: {
          email: null,
          password: null,
        },
        registerData: {
          displayName: null,
          email: null,
          password: null,
          photoURL: null,
        },
        // eslint-disable-next-line max-len
        avatars: { Andrea, Ethan, Ginny, Harpreet, Janneke, Keerththana, Keyan, Kriska, Lee, Nayeon, Ozge, Tom, Ysabel, Jerez: defaultAvatar },
        loginAvatars: [],
        selectedLoginAvatar: null,
      };
    },
    computed: mapState(['user', 'currentReport']),
    methods: {
      loadLoginAvatars() {
        this.$root.fbDatabase.collection('users').get().then((querySnapshot) => {
          console.log(querySnapshot);
          querySnapshot.forEach((doc) => {
            this.loginAvatars.push(_.extend({ id: doc.id }, doc.data()));
          });
        });
      },
      loginAvatarSelected(key) {
        // eslint-disable-next-line max-len
        const account = _.find(this.loginAvatars, user => (user.displayName && user.displayName.includes(key)) || (user.photoURL && user.photoURL.includes(key)));
        if (account) {
          this.selectedLoginAvatar = account;
          this.loginData.email = account.email;
          this.$refs.avatarLoginModal.show();
          // Ask for password
        } else {
          this.registerData.displayName = key;
          this.registerData.photoURL = this.avatars[key];
          this.$refs.avatarRegisterModal.show();
        }
      },
      login() {
        const self = this;
        this.loading = true;
        this.$root.fbAuth
          .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
          .then((response) => {
            self.$root.fbDatabase.collection('users').doc(response.uid).set({
              admin: false,
              photoURL: response.photoURL,
              email: response.email,
              displayName: response.displayName,
            });
            this.loading = false;
          })
          .catch(this.authErrorHandler);
      },
      register() {
        const self = this;
        this.loading = true;
        this.$root.fbAuth
          .createUserWithEmailAndPassword(this.registerData.email, this.registerData.password)
          .then(() => {
            this.$root.fbAuth.currentUser.updateProfile({
              displayName: this.registerData.displayName,
              photoURL: this.registerData.photoURL,
            }).then((response) => {
              // Update successful.
              self.$root.fbDatabase.collection('users').doc(response.uid).set({
                admin: false,
                photoURL: this.registerData.photoURL,
                email: response.email,
                displayName: this.registerData.displayName,
              });
              this.$store.commit('setUser', response);
              this.loading = false;
            }).catch(this.authErrorHandler);
          })
          .catch(this.authErrorHandler);
      },
      authErrorHandler() {
        // alert(error);
        // Handle Errors here.
        // const errorCode = error.code;
        // let errorMessage = error.message;
      },
      weekChanged(val) {
        this.disableButton = true;
        localStorage.SelectedWeek = val;
        this.$root.fbDatabase.collection('reports')
          .where('week_of', '==', val)
          .where('uid', '==', this.user.uid).limit(1)
          .get()
          .then((querySnapshot) => {
            this.disableButton = false;
            if (querySnapshot.size === 0) this.$store.commit('setCurrentReport', null);
            querySnapshot.forEach((doc) => {
              this.$store.commit('setCurrentReport', doc.exists ? doc : null);
            });
          })
          .catch((error) => {
            console.log('Error getting document: ', error);
          });
      },
      beginReport() {
        if (this.currentReport) {
          localStorage.SelectedWeek = this.weekOf;
          this.$router.push(`reports/${this.weekOf}/wows`);
        } else {
          const data = {
            week_of: this.weekOf,
            uid: this.user.uid,
            created_at: this.getServerTimestamp(),
          };

          this.$root.fbDatabase.collection('reports').add(data).then((doc) => {
            this.$store.commit('setCurrentReport', _.extend({ id: doc.id }, data));
            this.$router.push(`reports/${this.weekOf}/wows`);
          });
        }
      },
      toReview() {
        localStorage.SelectedWeek = this.weekOf;
        this.$router.push(`reports/${this.weekOf}/review`);
      },
    },
    mounted() {
      if (!this.user) this.loadLoginAvatars();
    },
  };
</script>
<style></style>
