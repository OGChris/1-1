<template>
	<section class="section inner-wrapper">
		<b-container>
			<b-row>
				<div class="offset-md-4 offset-xs-3 col-md-8 col-xs-9 align-self-center mt-5 mb-5">
					<b-card title="WOWs" sub-title="Key wins, stuff I accomplished since last meeting, things I’m proud of having worked on." header-text-variant="primary" class="mb-2 custom-card">
						<b-input-group v-for="(wow, index) in $root.collection.wows" class="mb-2" :key="wow.id || index">
							<b-input-group-addon>
								{{index+1}}.
							</b-input-group-addon>
							<b-textarea v-model="wow.text" :placeholder="`WOW ${index+1}`" style="min-height: 38px;"
							            :rows="1" :max-rows="6" v-validate.initial="'max:100'" :data-vv-name="`wow${index}`"
							            :state="errors.has(`wow${index}`)?'invalid':''" v-autosize="wow.text"></b-textarea>
							<b-input-group-button>
								<b-button @click="removeObj(index)" variant="danger"><i class="fa fa-trash"></i></b-button>
							</b-input-group-button>
						</b-input-group>
						<b-btn block variant="outline-secondary" @click.prevent="addWow"><i class="fa fa-plus"></i> Add WOW</b-btn>

						<!--<div slot="footer">
							<b-row class="justify-content-md-center">
								<b-col cols="6" class="text-left">

								</b-col>
								<b-col cols="6" class="text-right">
									<b-btn :disabled="errors.any()" to="Objectives" variant="success">Next</b-btn>
								</b-col>
							</b-row>
						</div>-->
					</b-card>
				</div>
			</b-row>
		</b-container>
	</section>
</template>
<style scoped>
	.inner-wrapper {
		background: url('../../assets/bg/bg_01.png') no-repeat center center;
		background-size: contain;
	}
	.custom-card {
		border-radius: 25pt;
		border: 2px solid #3c4488;
		min-height: 400px;
	}
	.custom-card .card-body {
		padding: 2.5rem;
	}
	.custom-card:before {
		content: '';
		position: absolute;
		left: 0;
		top: 40%;
		width: 0;
		height: 0;
		border: 50px solid transparent;
		border-right-color: #3c4488;
		/* border-bottom: 0; */
		border-left: 0;
		margin-left: -52px;
		margin-top: 0;
	}
	.custom-card:after {
		content: '';
		position: absolute;
		left: 0;
		top: 40%;
		width: 0;
		height: 0;
		border: 50px solid transparent;
		border-right-color: #fff;
		/* border-bottom: 0; */
		border-left: 0;
		margin-left: -49px;
		margin-top: 0;
	}
</style>
<script type="text/javascript">
  import { mapState } from 'vuex';
  import swal from 'sweetalert';

  export default {
    name: 'Wows',
    data() {
      return {};
    },
    computed: mapState(['user', 'currentReport']),
    watch: {
      user() { this.addWow(); },
    },
    methods: {
      addWow() {
        const obj = {
          uid: this.user.uid,
          text: '',
          // media: '',
        };
        this.$root.collection.wows.push(obj);
      },
      removeObj(index) {
        swal('Remove Item', 'Would you like to remove this item?', 'warning', {
          button: 'Yes',
        }).then((value) => {
          if (value) {
            this.$root.collection.wows.splice(index, 1);
          }
        });
      },
    },
    mounted() {
      if (this.user) {
        // this.addWow();
      }
    },
  };
</script>
