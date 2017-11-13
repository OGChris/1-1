<template>
	<b-card no-body>
		<b-tabs small card ref="tabs" class="nav-fill" v-model="tabIndex">

			<b-tab title="Login">
				<b-form id="login" @submit="login">
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
				<b-form id="register" @submit="register">
					<b-form-group id="register-name-group" label-for="register-name">
						<b-form-input v-model="registerData.displayName" id="register-name" type="text"required
						              placeholder="Enter your name"></b-form-input>
					</b-form-group>
					<b-form-group id="register-email-group" label-for="register-email">
						<b-form-input v-model="registerData.email" id="register-email" type="email"required
						              placeholder="Enter your email"></b-form-input>
					</b-form-group>
					<b-form-group id="register-password-group" label-for="register-password">
						<b-form-input v-model="registerData.password" id="register-password" type="password"required
						              placeholder="Enter your password"></b-form-input>
					</b-form-group>
					<b-button type="submit" variant="primary">Register</b-button>

				</b-form>
			</b-tab>
		</b-tabs>
	</b-card>
</template>
<style></style>
<script type="text/javascript">
  export default {
    name: 'auth',
    data() {
      return {
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
      };
    },
    methods: {
      login() {
        this.$root.fbAuth
          .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
          .then((response) => {
            console.log(response);
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
              console.log(response);
              this.$root.user = this.$root.fbAuth.currentUser;
            }).catch(this.authErrorHandler);
            this.$root.user = this.$root.fbAuth.currentUser;
          })
          .catch(this.authErrorHandler);
      },
      authErrorHandler(error) {
        console.log(error);
        // Handle Errors here.
        // const errorCode = error.code;
        // let errorMessage = error.message;
      },
    },
    mounted() {

    },
  };
</script>