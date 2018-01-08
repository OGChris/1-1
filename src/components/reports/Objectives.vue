<template>
	<section class="section inner-wrapper">
		<b-container>
			<b-row>
				<div class="offset-md-4 offset-xs-3 col-md-7 col-xs-9 align-self-center mt-5 mb-5">
					<b-card header-text-variant="primary" class="custom-card main mb-2">
						<b-card-img top :src="paperTop" alt="Image" class="papertop pt-4"></b-card-img>
						<h4 class="card-title">Priorities</h4>
						<h6 class="card-subtitle mb-2">Key project I’ll be focused on over the next two weeks,<br>with estimated time required.</h6>
						<b-form-group v-for="(objective, index) in $root.collection.objectives" :key="objective.id || index">
							<b-input-group size="sm">
								<b-input type="text" v-model="objective.text"
								         :placeholder="`Priority ${index+1}`" v-validate.initial="'max:50'"
								         :data-vv-name="`objective${index}`"
								         :state="errors.has(`objective${index}`)?'invalid':''"></b-input>
								<b-input-group-button>
									<b-button @click="removeObj(index)" variant="outline-secondary"><i class="fa fa-trash"></i></b-button>
								</b-input-group-button>
							</b-input-group>
							<b-input-group size="sm">
								<b-input type="number" v-model="objective.bandwidth" placeholder="Estimated Time"></b-input>
								<b-select v-model="objective.bandwidth_unit">
									<option value="hours">Hours</option>
									<option value="days">Days</option>
									<option value="weeks">Weeks</option>
								</b-select>
							</b-input-group>
						</b-form-group>
						<b-btn block variant="outline-secondary" @click.prevent="addObjective"><i class="fa fa-plus"></i> Add Priority</b-btn>
						<b-card-img bottom :src="paperBottom" alt="Image" class="paperbottom pt-4"></b-card-img>
					</b-card>
				</div>
			</b-row>
			<b-row class="justify-content-md-center">
				<b-col cols="6" class="text-left">
					<!--<b-btn variant="primary" @click.prevent="addObjective">Add a Priority</b-btn>-->
				</b-col>
				<b-col cols="6" class="text-right">
					<b-btn :disabled="errors.any()" @click="next" variant="secondary" class="px-2 border-white" style="background-color: rgba(255, 255, 255, .36)">Review</b-btn>
				</b-col>
			</b-row>
		</b-container>
	</section>
</template>
<style scoped>
	.inner-wrapper {
		/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ef4137+1,f26725+100 */
		background: #ef4137; /* Old browsers */
		background: -moz-linear-gradient(45deg, #ef4137 1%, #f26725 100%); /* FF3.6-15 */
		background: -webkit-linear-gradient(45deg, #ef4137 1%, #f26725 100%); /* Chrome10-25,Safari5.1-6 */
		background: linear-gradient(45deg, #ef4137 1%, #f26725 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ef4137', endColorstr='#f26725', GradientType=1); /* IE6-9 fallback on horizontal gradient */
	}
	.custom-card {
		background: transparent url('../../assets/paper_02.png') repeat-y top;
		background-size: cover;
		border: none;
		/*border: 2px solid #3c4488;*/
		border-radius: 0;
		min-height: 400px;
	}
	.custom-card.main:before {
		content: ' ';
		background: transparent url('../../assets/pencil.png') center center no-repeat;
		background-size: contain;
		width: 50px;
		height: 280px;
		position: absolute;
		bottom: -58px;
		right: -35px;
	}
	.papertop, .paperbottom {
		position: absolute;
		padding: 0 !important;
		width: 100%;
	}
	.papertop {
		left: 0;
		top: 0;
	}
	.paperbottom {
		left: 0;
		top: 100%;
	}
	.custom-card.dup {
		position: absolute;
	}
	.custom-card.dup1 {
		left: 7%;
		top: 5%;
	}
	.custom-card.dup2 {
		left: 10%;
		top: 9%;
	}
</style>

<script type="text/javascript">
  import _ from 'underscore';
  import $ from 'jquery';
  import { mapState } from 'vuex';
  import swal from 'sweetalert';

  import paperTop from '../../assets/paper_01.png';
  import paperBottom from '../../assets/paper_03.png';

  export default {
    name: 'Objectives',
    data() {
      return {
        paperTop,
        paperBottom,
      };
    },
    computed: mapState(['user', 'week']),
    watch: {
      user() {
        this.addObjective();
      },
      // eslint-disable-next-line func-names
      '$root.collection.objectives': function () {
        this.$nextTick(() => {
          $(this.$el).find('.dup').css('paperbottom', $(this.$el).find('.main').innerWidth());
        });
      },
    },
    methods: {
      getReport(id) {
        return _.findWhere(this.reports, { id });
      },
      addObjective() {
        const obj = {
          // uid: this.user.uid,
          text: '',
          bandwidth: null,
          bandwidth_unit: 'hours',
          // week_of: this.$route.params.week,
        };
        this.$root.collection.objectives.push(obj);
      },
      removeObj(index) {
        swal('Remove Item', 'Would you like to remove this item?', 'warning', {
          button: 'Yes',
        }).then((value) => {
          if (value) {
            this.$root.collection.objectives.splice(index, 1);
          }
        });
      },
      next() {
        this.$root.$emit('to:review');
      },
    },

    mounted() {
      if (this.user) {
        // this.addObjective();
      }
      window.addEventListener('resize', () => {
        $(this.$el).find('.dup').css('paperbottom', $(this.$el).find('.main').innerWidth());
      });
    },
  };
</script>

