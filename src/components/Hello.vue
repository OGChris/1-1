<template>
	<b-row class="wrapper" align-v="center">
		<b-col align-self="center" class=" col-xs-12 mt-5" :class="[user ? 'offset-sm-3 col-md-6' : 'offset-sm-2 col-md-8']">
			<div class="hello">
				<template v-if="!user">
					<h1 class="text-white">{{ heading }}</h1>
					<b-card>
							<h4 class="card-title" style="color: #3c4488;font-size: 2.5rem;font-weight: 200;">Select your avatar</h4>
							<br>
							<b-btn variant="link" class="p-0 text-dark" style="cursor: pointer; font-weight: 200;" v-for="(avatar, key) in avatars" :key="key" @click="loginAvatarSelected(key)">
								<b-img :src="avatar" rounded="circle" width="75" height="75" blank-color="#777" alt="img" class="m-1" /><br>{{ key }}
							</b-btn>
							<!--<div class="text-center">
								<p class="text-center">If you do not see your avatar</p>
								<b-btn variant="secondary">Login with email and password</b-btn>
							</div>-->
						</b-card>
					<b-modal centered ref="avatarLoginModal" title="Authentication" @ok="login">
						<div v-if="selectedLoginAvatar">
							<img :src="selectedLoginAvatar && selectedLoginAvatar.photoURL ? selectedLoginAvatar.photoURL : defaultAvatar" height="32" class="rounded-circle"
							     alt="Avatar">
							&nbsp;
							{{selectedLoginAvatar.displayName || selectedLoginAvatar.email}}
						</div>
						<br>
						<b-form id="login" data-vv-scope="login" @submit.prevent="login">
							<b-form-group id="login-password-group" label-for="login-password">
								<b-form-input ref="focusThis" v-model="loginData.password" id="login-password" type="password"
								              placeholder="Enter your password"></b-form-input>
								<template v-if="loginError">
									<p v-if="loginError.code === 'auth/wrong-password'" class="text-danger">
										The password you entered is incorrect, please try again.
									</p>
									<p v-else v-text="loginError.message"></p>
								</template>
							</b-form-group>
							<b-btn variant="outline-secondary" @click.prevent="requestPasswordReset">Forgot your password?</b-btn>
						</b-form>
					</b-modal>

					<b-modal centered ref="avatarRegisterModal" title="Register" @shown="$refs.focusThis.focus()" @ok="register">
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
					<h1 class="" style="color: #3c4488;font-size: 2.5rem;font-weight: 300;">
						Welcome Back, <template v-if="user.displayName">{{user.displayName}}!</template>
					</h1>
					<br>
					<b-form @submit.prevent="beginReport" novalidate>
						<!--<label for="reportWeek">Week</label>-->
						<b-input-group size="sm">
							<b-input-group-addon><i class="fa fa-calendar" style="color: blue;"></i></b-input-group-addon>
							<!--<b-input id="reportWeek" type="week" v-model="weekOf" min="minWeek" max="maxWeek" required
								v-validate="'required'" name="reportWeek" @input="weekChanged"></b-input>-->
							<datepicker :format="customFormatter" wrapper-class="form-control" input-class="dp-input" v-model="weekOfObj" :highlighted="highlightedDates" @selected="weekOfSelected"></datepicker>

							<b-input-group-button class="d-none d-md-block">
								<b-btn type="submit" variant="primary" :disabled="disableButton">
									{{ currentReport ? 'Continue' : 'Begin'}}
								</b-btn>
								<b-btn @click="toReview" :disabled="disableButton || !currentReport">
									Review
								</b-btn>
							</b-input-group-button>
						</b-input-group>

						<!--<b-form-group>
							<datepicker :format="customFormatter" input-class="form-control" v-model="weekOfObj" :highlighted="highlightedDates" @selected="weekOfSelected"></datepicker>
						</b-form-group>-->

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
		</b-col>
	</b-row>
</template>
<style>
	.wrapper {
		min-height: 100%;
		height: -webkit-fill-available;
		height: -moz-fill-available;
	}

	.hello {
		min-height: 500px;
	}

	.hello .card { border: none; }

	.dp-input {
		width: 240px;
		max-width: 100%;
		min-width: 100%;
		border: none;
	}
</style>

<script>
  import swal from 'sweetalert';
  import _ from 'underscore';
  import { mapState } from 'vuex';
  import moment from 'moment';
  // For JSON Auth
  // import authData from '../auth.json';

  import Andrea from '../assets/avatar/Andrea.png';
  import Ethan from '../assets/avatar/Ethan.png';
  import Ginny from '../assets/avatar/Ginny.png';
  import Harpreet from '../assets/avatar/Harpreet.png';
  import Jacob from '../assets/avatar/Jacob.png';
  import Janneke from '../assets/avatar/Janneke.png';
  import Keerththana from '../assets/avatar/Keerththana.png';
  import Keyan from '../assets/avatar/Keyan.png';
  import Kriska from '../assets/avatar/Kriska.png';
  import Lee from '../assets/avatar/Lee.png';
  import Nayeon from '../assets/avatar/Nayeon.png';
  import Ozge from '../assets/avatar/Ozge.png';
  import Tom from '../assets/avatar/tom.png';
  import Ysabel from '../assets/avatar/Ysabel NEW.png';

  export default {
    name: 'hello',
    data() {
      return {
        loading: false,
        showAvatarLogin: true,
        disableButton: false,
        currentReport: false,
        heading: 'Welcome to 1:1',
        minWeek: moment().subtract(1, 'weeks').format('YYYY-[W]ww'),
        maxWeek: moment().add(1, 'weeks').format('YYYY-[W]ww'),
        weekOf: !isNaN(localStorage.SelectedWeek) ? localStorage.SelectedWeek : moment().format('YYYY-[W]ww'),
        weekOfObj: !isNaN(localStorage.SelectedWeek) ? moment(localStorage.SelectedWeek, 'YYYY-[W]ww').day('Monday').toDate() : moment().day('Monday').toDate(),
        highlightedDates: {
          from: localStorage.SelectedWeek ? moment(localStorage.SelectedWeek, 'YYYY-[W]ww').day('Monday').toDate() : moment().day('Monday').toDate(),
          to: localStorage.SelectedWeek ? moment(localStorage.SelectedWeek, 'YYYY-[W]ww').day('Friday').toDate() : moment().day('Friday').toDate(),
        },
        loginError: null,
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
        defaultAvatar: this.$root.defaultAvatar,
        // eslint-disable-next-line max-len
        avatars: { Andrea, Ethan, Ginny, Harpreet, Jacob, Janneke, Keerththana, Keyan, Kriska, Lee, Nayeon, Ozge, Tom, Ysabel, Jerez: this.$root.defaultAvatar, Demo: this.$root.defaultAvatar },
        loginAvatars: [], // authData.data,
        selectedLoginAvatar: null,
      };
    },
    computed: mapState(['user', 'week']),
    watch: {
      user() {
        this.checkForRecord();
      },
    },
    methods: {
      // Firebase AVATAR LOGIN
      loadLoginAvatars() {
        this.$root.fbDatabase.collection('users').get().then((querySnapshot) => {
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
      login(event) {
        // For FIREBASE Auth
        this.loginError = null;
        event.preventDefault();
        const self = this;
        this.loading = true;
        this.$root.fbAuth
          .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
          .then((response) => {
            self.$root.fbDatabase.collection('users').doc(response.uid).update({
              // photoURL: response.photoURL,
              email: response.email,
              displayName: response.displayName,
            });
            this.$refs.avatarLoginModal.hide();
            this.loading = false;
          })
          .catch((response) => {
            this.loginError = response;
          });
        // For JSON Auth
        // this.loginError = null;
        // event.preventDefault();
        // const self = this;
        // this.loading = true;
        // const account = _.find(this.loginAvatars, user => user.email === this.loginData.email);
        // if (account) {
        //   if (account.password === this.loginData.password) {
        //     this.$refs.avatarLoginModal.hide();
        //     self.$store.commit('setUser', account);
        //     self.$setItem('auth', account);
        //     this.loading = false;
        //   } else {
        //     this.loginError = {
        //       code: 'auth/wrong-password',
        //       message: 'Incorrect password. Please check you credentials.'
        //     };
        //   }
        // }
      },
      // For FIREBASE Auth
      register() {
        const self = this;
        this.loading = true;
        this.$root.fbAuth
          .createUserWithEmailAndPassword(this.registerData.email, this.registerData.password)
          .then((user) => {
            self.$root.fbAuth.currentUser.updateProfile({
              displayName: self.registerData.displayName,
              photoURL: self.registerData.photoURL,
            }).then(() => {
              // Update successful.
              self.$root.fbDatabase.collection('users').doc(user.uid).set({
                admin: false,
                photoURL: self.registerData.photoURL,
                email: user.email,
                displayName: self.registerData.displayName,
              });
              self.$store.commit('setUser', self.$root.fbAuth.currentUser);
              self.loading = false;
            }).catch(self.authErrorHandler);
          })
          .catch(this.authErrorHandler);
      },
      // For FIREBASE Auth
      requestPasswordReset() {
        swal('Forgot Your Password?', 'Would you like to reset it?', 'info', {
          button: 'Yes',
        }).then((value) => {
          if (value) {
            this.$root.fbAuth.sendPasswordResetEmail(this.loginData.email)
              .then(() => {
                swal('Password reset email sent!', 'Please check your email.', 'success');
                // Password reset email sent.
              })
              .catch((error) => {
                swal('Something went wrong', error, 'error');
                // Error occurred. Inspect error.code.
              });
          }
        });
      },
      authErrorHandler() {
        // alert(error);
        // Handle Errors here.
        // const errorCode = error.code;
        // let errorMessage = error.message;
      },
      // CALENDAR FUNCTIONS
      customFormatter(date) {
        // Week of 46 - Nov 13-17, 2017
        const m = moment(date);
        return `${m.startOf('w').format('MMM DD')} - ${m.endOf('w').format('DD')}`;
      },
      weekOfSelected(val) {
        const date = moment(val);
        localStorage.SelectedWeek = date.format('YYYY-[W]ww');
        this.weekOf = date.format('YYYY-[W]ww');
        this.$store.commit('setWeek', this.weekOf);
        this.weekChanged(this.weekOf);
        this.highlightedDates = {
          from: date.day('Monday').toDate(),
          to: date.day('Friday').toDate(),
        };
      },
      weekChanged(val) {
        localStorage.SelectedWeek = val;
        this.checkForRecord();
      },
      beginReport() {
        localStorage.SelectedWeek = this.weekOf;
        if (!this.currentReport) {
          this.$root.collection = {
            weekOf: this.weekOf,
            wows: [],
            objectives: [],
            opportunities: [],
          };
        }
        if (!this.$root.collection.weekOf) {
          this.$root.collection.weekOf = this.weekOf;
        }
        this.$router.push(`reports/${this.weekOf}`);
      },
      toReview() {
        localStorage.SelectedWeek = this.weekOf;
        this.$router.push(`reports/${this.weekOf}/review`);
      },
      checkForRecord() {
        this.$getItem(this.weekOf, (error, data) => {
          if (data) {
            this.$root.collection = data;
            this.currentReport = true;
          } else {
            this.currentReport = false;
          }
        });
      },
    },
    mounted() {
      if (!this.user) {
        this.loadLoginAvatars();
      } else {
        this.checkForRecord();
      }
      // FOR JSON Auth
      // if (this.user) {
      //   this.checkForRecord();
      // }
    },
  };
</script>
