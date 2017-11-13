<template>
	<div class="offset-sm-2 col-sm-8 col-xs-12 align-self-center mt-5 mb-5">
		<main id="objectives" role="main" class="inner cover">
		<b-card title="Objectives" sub-title="I’m focused on..." header-text-variant="primary" class="mb-2">
			<!--<b-card-group columns="'12'">-->
			<b-form-group v-for="(objective, index) in objectives" :key="objective.id || index">
				<b-input-group>
					<b-input type="text" v-model="objective.text" @input="debouncedUpdate(objective)"
					         :placeholder="`Objective ${index+1}`" v-validate.initial="'max:50'"
					         :data-vv-name="`objective${index}`"
					         :state="errors.has(`objective${index}`)?'invalid':''"></b-input>
					<b-input-group-addon>
						<b-form-checkbox class="mb-0" v-model="objective.completed" @change="updateCompletedTimestamp(index)">
							{{objective.completed ? 'Complete' : 'Incomplete'}}
						</b-form-checkbox>
					</b-input-group-addon>
				</b-input-group>
			</b-form-group>

			<hr>
			<h4>Previous Objectives</h4>
			<h6 class="card-subtitle mb-2 text-muted">I’m still focused on...</h6>
			<b-form-group v-for="(objective, index) in previousObjectives" :key="objective.id || index">
				<b-input-group>
					<b-input type="text" v-model="objective.text" @input="debouncedUpdate(objective)"
					         :placeholder="`Objective ${index+1}`" v-validate.initial="'max:50'"
					         :data-vv-name="`objective${index}`"
					         :state="errors.has(`objective${index}`)?'invalid':''"></b-input>
					<b-input-group-addon>
						<b-form-checkbox class="mb-0" v-model="objective.completed" @change="updateCompletedTimestamp(index)">
							{{objective.completed ? 'Complete' : 'Incomplete'}}
						</b-form-checkbox>
					</b-input-group-addon>
					<!--<b-input-group-button>
						<b-btn variant="danger" @click="hideObjective"><i class="fa fa-times"></i></b-btn>
					</b-input-group-button>-->
				</b-input-group>
			</b-form-group>


			<!--</b-card-group>-->
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
  import { mapState } from 'vuex';
  
  export default {
    name: 'Objectives',
    data() {
      return {
        objectives: [],
        previousObjectives: [],
      };
    },
    computed: mapState(['user', 'currentReport']),
    watch: {
      currentReport(val) {
        if (val.id) this.loadCurrentData();
      },
      objectives(val) {
        this.$root.collection.objectives = val;
      },
    },
    methods: {
      addObjective() {
        const obj = {
          // report: this.currentReport.ref.path,
          report: this.currentReport.id,
          uid: this.user.uid,
          text: '',
          completed: false,
          completed_at: null,
        };
        this.$root.fbDatabase.collection('objectives').add(obj)
          .then((docRef) => { this.objectives.push(_.extend({ id: docRef.id }, obj)); })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      },
      updateCompletedTimestamp(index) {
        const objective = this.objectives[index];
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
        // get/create objectives for the current report
        this.$root.$firestore.objectives = this.$root.fbDatabase.collection('objectives')
          .where('report', '==', this.currentReport.id)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              this.addObjective();
              this.addObjective();
              this.addObjective();
              this.addObjective();
              this.addObjective();
            } else {
              querySnapshot.forEach((doc) => {
                this.objectives.push(_.extend({ id: doc.id }, doc.data()));
              });
            }
            this.loadPreviousData();
          })
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      },
      loadPreviousData() {
        this.$root.fbDatabase.collection('objectives')
          // .where('report', '<>', this.currentReport.id) // notEqual not available
          .where('uid', '==', this.user.uid)
          .where('completed', '==', false)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                if (this.currentReport.id !== doc.data().report) {
                  this.previousObjectives.push(_.extend({ id: doc.id }, doc.data()));
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

