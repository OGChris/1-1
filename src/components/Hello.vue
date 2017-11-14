<template>
	<div class="offset-md-2 col-md-8 col-xs-12 align-self-center mt-5">
		<main role="main" class="inner cover">
			<div class="hello">
				<template v-if="!user">
					<h1>{{ heading }}</h1>
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
											<b-form-radio v-for="(avatar, index) in avatars" :key="index" :value="avatar">
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
				<template v-else>
					<h1>Welcome Back
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

  export default {
    name: 'hello',
    data() {
      return {
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
        avatars: [
          Andrea, Ethan, Ginny, Harpreet, Janneke, Keerththana,
          Keyan, Kriska, Lee, Nayeon, Ozge, Tom, Ysabel,
        ],
      };
    },
    computed: mapState(['user', 'currentReport']),
    methods: {
      login() {
        this.$root.fbAuth
          .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
          .then(() => {
            // console.log(response);
            // this.user = response;
            // this.$root.user = response;
            // window.location.reload();
          })
          .catch(this.authErrorHandler);
      },
      register() {
        this.$root.fbAuth
          .createUserWithEmailAndPassword(this.registerData.email, this.registerData.password)
          .then(() => {
            this.$root.fbAuth.currentUser.updateProfile({
              displayName: this.registerData.displayName,
              photoURL: this.registerData.photoURL,
            }).then((response) => {
              // Update successful.
              this.$store.commit('setUser', response);
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

    },
  };
</script>
<style></style>
