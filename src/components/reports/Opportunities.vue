<template>
	<div class="offset-sm-2 col-sm-8 col-xs-12 align-self-center mt-5 mb-5">
		<main id="opportunities" role="main" class="inner cover">
			<b-card title="Opportunities" sub-title="Areas to improve..." header-text-variant="primary" class="mb-2">
				<b-form-group v-for="(opp, index) in opportunities" class="mb-2" :key="opp.id || index">
						<b-textarea v-model="opp.text" @input="debouncedUpdate(opp)" :placeholder="`Area ${index+1}`"
						            :rows="2" :max-rows="6" v-validate.initial="'max:100'" :data-vv-name="`opp${index}`"
						            :state="errors.has(`opp${index}`)?'invalid':''"></b-textarea>
				</b-form-group>

				<div slot="footer" class="justify-content-md-center">
					<b-row>
						<b-col cols="6" class="text-left">
							<!--<b-btn variant="primary" @click.prevent="addOpp">Add Another</b-btn>-->
						</b-col>
						<b-col cols="6" class="text-right">
							<b-btn :disabled="errors.any()" to="status-reports" variant="success">Next</b-btn>
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
    name: 'Opportunities',
    data() {
      return {
        opportunities: [],
      };
    },
    computed: mapState(['user', 'currentReport']),
    watch: {
      currentReport(val) {
        if (val.id) this.loadCurrentData();
      },
      opportunities(val) {
        this.$root.collection.opportunities = val;
      },
    },
    methods: {
      addOpportunity() {
        const obj = {
          // report: this.currentReport.ref.path,
          report: this.currentReport.id,
          text: '',
        };
        this.$root.fbDatabase.collection('opportunities').add(obj)
          .then((docRef) => { this.opportunities.push(_.extend({ id: docRef.id }, obj)); })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      },
      // eslint-disable-next-line prefer-arrow-callback,func-names
      debouncedUpdate: _.debounce(function (opportunity) {
        const item = _.extend({}, opportunity);
        delete item.id;
        this.$root.fbDatabase.collection('opportunities').doc(opportunity.id).update(item)
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      }, 250),
      loadCurrentData() {
        this.$root.$firestore.opportunities = this.$root.fbDatabase.collection('opportunities')
          .where('report', '==', this.currentReport.id)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              this.addOpportunity();
              this.addOpportunity();
              this.addOpportunity();
            } else {
              querySnapshot.forEach((doc) => {
                this.opportunities.push(_.extend({ id: doc.id }, doc.data()));
              });
            }
          })
          .catch((error) => {
            console.log('Synchronization failed: ', error);
          });
      },
    },
    mounted() {
      if (this.currentReport) {
        this.loadCurrentData();
      }
    },
  };
</script>
