<template>
	<section class="section inner-wrapper">
		<b-container>
			<b-row>
				<div class="offset-md-4 offset-xs-3 col-md-8 col-xs-9 align-self-center mt-5 mb-5">
					<b-card class="custom-card dup dup2"></b-card>
					<b-card class="custom-card dup dup1"></b-card>
					<b-card title="Priorities" sub-title="Key project I’ll be focused on over the next two weeks, with estimated time required." header-text-variant="primary" class="custom-card main mb-2">
						<b-form-group v-for="(objective, index) in $root.collection.objectives" :key="objective.id || index">
							<b-input-group>
								<b-input type="text" v-model="objective.text"
								         :placeholder="`Priority ${index+1}`" v-validate.initial="'max:50'"
								         :data-vv-name="`objective${index}`"
								         :state="errors.has(`objective${index}`)?'invalid':''"></b-input>
								<b-input-group-button>
									<b-button @click="removeObj(index)" variant="danger"><i class="fa fa-trash"></i></b-button>
								</b-input-group-button>
							</b-input-group>
							<b-input-group>
								<b-input type="number" v-model="objective.bandwidth" :placeholder="`Priority ${index+1} Bandwidth`"></b-input>
								<b-select v-model="objective.bandwidth_unit">
									<option value="hours">Hours</option>
									<option value="days">Days</option>
									<option value="weeks">Weeks</option>
								</b-select>
							</b-input-group>
						</b-form-group>
						<b-btn block variant="outline-primary" @click.prevent="addObjective"><i class="fa fa-plus"></i> Add a Priority</b-btn>

						<div slot="footer">
							<b-row class="justify-content-md-center">
								<b-col cols="6" class="text-left">
									<!--<b-btn variant="primary" @click.prevent="addObjective">Add a Priority</b-btn>-->
								</b-col>
								<b-col cols="6" class="text-right">
									<b-btn :disabled="errors.any()" @click="next" variant="success">Review</b-btn>
								</b-col>
							</b-row>
						</div>
					</b-card>
				</div>
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
		border: 2px solid #3c4488;
		border-radius: 0;
		min-height: 400px;
	}
	.custom-card.main:before {
		content: ' ';
		background: transparent url('../../assets/pencil.png') center center no-repeat;
		background-size: contain;
		width: 30px;
		height: 155px;
		position: absolute;
		top: 20px;
		right: 15px;
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

  export default {
    name: 'Objectives',
    data() {
      return {};
    },
    computed: mapState(['user', 'week']),
    watch: {
      user() {
        this.addObjective();
      },
      // eslint-disable-next-line func-names
      '$root.collection.objectives': function () {
        this.$nextTick(() => {
          $(this.$el).find('.dup').css('width', $(this.$el).find('.main').innerWidth());
          $(this.$el).find('.dup').css('height', $(this.$el).find('.main').innerHeight());
        });
      },
    },
    methods: {
      getReport(id) {
        return _.findWhere(this.reports, { id });
      },
      addObjective() {
        const obj = {
          uid: this.user.uid,
          text: '',
          bandwidth: 0,
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
      updateCompletedTimestamp(objective) {
        // eslint-disable-next-line no-param-reassign
        objective.completed_at = objective.completed ? this.getServerTimestamp() : null;
      },
      next() {
        this.$root.$emit('to:review');
      },
    },
    mounted() {
      if (this.user) {
        // this.addObjective();
      }
      setInterval(() => {
        $(this.$el).find('.dup').css('width', $(this.$el).find('.main').innerWidth());
        $(this.$el).find('.dup').css('height', $(this.$el).find('.main').innerHeight());
      }, 1000);
    },
  };
</script>

