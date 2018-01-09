<template>
	<section class="section inner-wrapper">
		<b-container>
			<b-row>
				<div class="offset-md-4 offset-xs-3 col-md-8 col-xs-9 align-self-center mt-5 mb-5">
					<b-card class="custom-card pt-2">
						<b-img center fluid :src="tableTop" alt="Image" class="custom-card-top pb-1"></b-img>
						<h4 class="card-title">Serendipity</h4>
						<h6 class="card-subtitle mb-2">Sharing challenges. Learning from mistakes<br>and finding opportunities in the in-between.</h6>
						<b-input-group size="sm" v-for="(opp, index) in $root.collection.opportunities" class="mb-2" :key="opp.id || index">
							<b-textarea v-model="opp.text" :placeholder="`Area ${index+1}`" class="bg-transparent text-white"
							            :rows="1" :max-rows="6" v-validate.initial="'max:100'" :data-vv-name="`opp${index}`"
							            :state="errors.has(`opp${index}`)?'invalid':''"></b-textarea>
							<b-input-group-button>
								<b-button @click="removeObj(index)" variant="outline-secondary" style="border: 1px solid #ced4da;"><i class="fa fa-trash text-white"></i></b-button>
							</b-input-group-button>
						</b-input-group>
						<b-btn block variant="outline-secondary" class="text-white" @click.prevent="addOpportunity"><i class="fa fa-plus"></i> Add Item</b-btn>
						<!--<div slot="footer" class="justify-content-md-center">
							<b-row>
								<b-col cols="6" class="text-left">
									&lt;!&ndash;<b-btn variant="primary" @click.prevent="addOpp">Add Another</b-btn>&ndash;&gt;
								</b-col>
								<b-col cols="6" class="text-right">
									<b-btn :disabled="errors.any()" to="status-reports" variant="success">Next</b-btn>
								</b-col>
							</b-row>

						</div>-->
						<b-card-img bottom :src="tableBottom" alt="Image" class="pt-4"></b-card-img>
					</b-card>

				</div>
			</b-row>
		</b-container>
	</section>
</template>
<style scoped>
	.inner-wrapper {
		/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#3c338c+52,2f8ac9+100 */
		background: #3c338c; /* Old browsers */
		background: -moz-linear-gradient(45deg, #3c338c 52%, #2f8ac9 100%); /* FF3.6-15 */
		background: -webkit-linear-gradient(45deg, #3c338c 52%,#2f8ac9 100%); /* Chrome10-25,Safari5.1-6 */
		background: linear-gradient(45deg, #3c338c 52%,#2f8ac9 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3c338c', endColorstr='#2f8ac9',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
	}
	.custom-card {
		color: #ffffff;
		background: transparent;
		border: 20px solid #ffffff;
		border-top: none;
		border-bottom: none;
		border-radius: 0;
	}
	.custom-card-top {
		max-width: 115%;
		position: absolute;
		top: -81px;
		left: -8%;
	}
	.custom-card-bottom {
		max-width: 105%;
		position: absolute;
		bottom: -11%;
		left: -3%;
	}

	@media (max-width: 991px) {
		.custom-card-top {
			top: -59px;
			left: -8%;
		}
	}

	.custom-card h4, .custom-card h6 { color: #fff !important; }
</style>
<script type="text/javascript">
  import { mapState } from 'vuex';
  import swal from 'sweetalert';

  import tableTop from '../../assets/tabletop.png';
  import tableBottom from '../../assets/tablebottom.png';

  export default {
    name: 'Opportunities',
    data() {
      return {
        tableTop,
        tableBottom,
      };
    },
    computed: mapState(['user']),
    watch: {
      user() { this.addOpportunity(); },
    },
    methods: {
      addOpportunity() {
        const obj = {
          // uid: this.user.uid,
          text: '',
        };
        this.$root.collection.opportunities.push(obj);
      },
      removeObj(index) {
        swal('Remove Item', 'Would you like to remove this item?', 'warning', {
          button: 'Yes',
        }).then((value) => {
          if (value) {
            this.$root.collection.opportunities.splice(index, 1);
          }
        });
      },
    },
    mounted() {
      if (this.user) {
        // this.addOpportunity();
      }
    },
  };
</script>
