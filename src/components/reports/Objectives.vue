<template>
	<div class="offset-md-2 col-md-8 col-xs-12 align-self-center mt-5 mb-5">
		<main id="objectives" role="main" class="inner cover">
		<b-card title="Objectives" sub-title="I’m focused on..." header-text-variant="primary" class="mb-2">
			<b-form-group v-for="(objective, index) in objectives" :key="objective.id || index">
				<b-input-group>
						<b-input type="text" v-model="objective.text" @input="debouncedUpdate(objective)"
						         :placeholder="`Objective ${index+1}`" v-validate.initial="'max:50'"
						         :data-vv-name="`objective${index}`"
						         :state="errors.has(`objective${index}`)?'invalid':''"></b-input>
						<b-input-group-button>
							<b-button :pressed.sync="objective.completed" @click="updateCompletedTimestamp(objective)" :variant="objective.completed ? 'success' : 'secondary'">
								<!--<i class="fa" :class="[objective.completed ? 'fa-toggle-on' : 'fa-toggle-off']"></i>-->
								<i class="fa" :class="[objective.completed ? 'fa-check-square-o' : 'fa-square-o']"></i>
							</b-button>
						</b-input-group-button>
					</b-input-group>
			</b-form-group>
			<b-btn block variant="outline-primary" @click.prevent="addObjective"><i class="fa fa-plus"></i> Add an Objective</b-btn>

			<hr>
			<h4>Previous Objectives</h4>
			<h6 class="card-subtitle mb-2 text-muted">I’m still focused on...</h6>
			<b-form-group v-for="(objective, index) in previousObjectives" :key="objective.id || index">
				<b-input-group>
					<b-input type="text" v-model="objective.text" @input="debouncedUpdate(objective)"
					         :placeholder="`Objective ${index+1}`" v-validate.initial="'max:50'"
					         :data-vv-name="`objective${index}`"
					         :state="errors.has(`objective${index}`)?'invalid':''"></b-input>
					<b-input-group-button>
						<b-button :pressed.sync="objective.completed" @click="updateCompletedTimestamp(objective)" :variant="objective.completed ? 'success' : 'secondary'">
							<!--<i class="fa" :class="[objective.completed ? 'fa-toggle-on' : 'fa-toggle-off']"></i>-->
							<i class="fa" :class="[objective.completed ? 'fa-check-square-o' : 'fa-square-o']"></i>
						</b-button>
					</b-input-group-button>
				</b-input-group>
				<small class="form-text text-muted text-left">{{getReport(objective.report).week_of|mWeekToRange}}</small>
			</b-form-group>
			<hr>
			<h4>Future Objectives</h4>
			<h6 class="card-subtitle mb-2 text-muted">I’m will focus on...</h6>
			<b-form-group v-for="(objective, index) in futureObjectives" :key="objective.id || index">
				<b-input-group>
					<b-input type="text" v-model="objective.text" @input="debouncedUpdate(objective)"
					         :placeholder="`Objective ${index+1}`" v-validate.initial="'max:50'"
					         :data-vv-name="`objective${index}`"
					         :state="errors.has(`objective${index}`)?'invalid':''"></b-input>
					<b-input-group-button>
						<b-button :pressed.sync="objective.completed" @click="updateCompletedTimestamp(objective)" :variant="objective.completed ? 'success' : 'secondary'">
							<!--<i class="fa" :class="[objective.completed ? 'fa-toggle-on' : 'fa-toggle-off']"></i>-->
							<i class="fa" :class="[objective.completed ? 'fa-check-square-o' : 'fa-square-o']"></i>
						</b-button>
					</b-input-group-button>
				</b-input-group>
				<small class="form-text text-muted text-left">{{getReport(objective.report).week_of|mWeekToRange}}</small>
			</b-form-group>

			<div slot="footer">
				<b-row class="justify-content-md-center">
					<b-col cols="6" class="text-left">
						<!--<b-btn variant="primary" @click.prevent="addObjective">Add a Objective</b-btn>-->
					</b-col>
					<b-col cols="6" class="text-right">
						<b-btn :disabled="errors.any()" @click="next" variant="success">Next</b-btn>
					</b-col>
				</b-row>
			</div>
		</b-card>
	</main>
	</div>
</template>
<style></style>

<script type="text/javascript">
  import _ from 'underscore';
  import moment from 'moment';
  // import { mapState } from 'vuex';
  
  export default {
    name: 'Objectives',
    data() {
      return {
        objectives: [],
        reports: [],
        previousObjectives: [],
        futureObjectives: [],
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      currentReport() {
        return this.$store.state.currentReport;
      },
      orderedPreviousObjectives() {
        return [];
      },
      orderedFutureObjectives() {
        return [];
      },
    },
    watch: {
      currentReport(val) {
        if (val.id) this.loadCurrentData();
      },
      objectives(val) {
        this.$root.collection.objectives = val;
      },
    },
    methods: {
      getReport(id) {
        return _.findWhere(this.reports, { id });
      },
      addObjective() {
        const obj = {
          // report: this.currentReport.ref.path,
          report: this.currentReport.id,
          uid: this.user.uid,
          text: '',
          completed: false,
          completed_at: null,
          week_of: this.currentReport.data().week_of,
        };
        this.$root.fbDatabase.collection('objectives').add(obj)
          .then((docRef) => { this.objectives.push(_.extend({ id: docRef.id }, obj)); })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      },
      updateCompletedTimestamp(objective) {
        // eslint-disable-next-line no-param-reassign
        objective.completed_at = objective.completed ? this.getServerTimestamp() : null;
        // update objective
        const item = _.extend({}, objective);
        delete item.id;
        this.$root.fbDatabase.collection('objectives').doc(objective.id).update(item)
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      },
      // eslint-disable-next-line prefer-arrow-callback,func-names
      debouncedUpdate: _.debounce(function (objective) {
        const item = _.extend({}, objective);
        delete item.id;
        this.$root.fbDatabase.collection('objectives').doc(objective.id).update(item)
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      }, 250),
      loadCurrentData() {
        // get reports to correlate to objectives
        this.$root.fbDatabase.collection('reports')
          .where('uid', '==', this.user.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.reports.push(_.extend({ id: doc.id }, doc.data()));
            });
          })
          .catch((error) => {
            console.log('Error getting document: ', error);
          });
        // get/create objectives for the current report
        this.$root.$firestore.objectives = this.$root.fbDatabase.collection('objectives')
          .where('report', '==', this.currentReport.id)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              this.addObjective();
              this.addObjective();
            } else {
              querySnapshot.forEach((doc) => {
                const item = doc.data();
                this.objectives.push(_.extend({ id: doc.id }, item));
              });
            }
            this.loadOtherData();
          })
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      },
      loadOtherData() {
        this.$root.fbDatabase.collection('objectives')
          // .where('report', '<>', this.currentReport.id) // notEqual not available
          .where('uid', '==', this.user.uid)
          .where('completed', '==', false)
          .orderBy('week_of')
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                if (this.currentReport.id !== doc.data().report) {
                  if (moment(doc.data().week_of, 'YYYY-[W]ww').isBefore(moment(this.currentReport.data().week_of, 'YYYY-[W]ww'), 'week')) {
                    this.previousObjectives.push(_.extend({ id: doc.id }, doc.data()));
                  } else {
                    this.futureObjectives.push(_.extend({ id: doc.id }, doc.data()));
                  }
                }
              });
            }
          })
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      },
      next() {
        const promises = [];
        let wait = false;
        this.objectives.forEach((objective) => {
          if (objective.text === '') {
            wait = true;
            promises.push(this.$root.fbDatabase.collection('objectives').doc(objective.id).delete());
          }
        });
        if (wait) {
          Promise.all(promises).then(() => {
            this.$router.push('opportunities');
          });
        } else this.$router.push('opportunities');
      },
    },
    mounted() {
      if (this.currentReport) {
        this.loadCurrentData();
      }
    },
  };
</script>

