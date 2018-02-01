<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="900px">
      <v-card>
        <v-card-title style="padding-bottom: 0">
          <span class="headline">Create task</span>
        </v-card-title>
        <v-card-text style="padding-top: 0">
          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex xs6>
                <v-text-field name="name" label="Name" v-model='name' class="--focused" required></v-text-field>
              </v-flex>
              <v-flex xs6 style="margin-top: 27px">
                <v-date-picker mode='single' v-model='selectedDate'>
                </v-date-picker>
              </v-flex>
              <v-flex xs12>
                <v-text-field name="desc" label="Description" v-model='desc' value="" class="input-group" multi-line
                              rows="2"/>
              </v-flex>

              <v-flex xs12 sm6>
                <v-select name="priority" label="Priority" v-model='priority' required
                          :items="['Low', 'Medium', 'High']"/>
              </v-flex>

              <v-flex xs12 sm6>
                <v-select label="Categories" required :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball']"/>
              </v-flex>
            </v-layout>

          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false; $emit('closed')">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialog = true; onSave()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        dialog: true,
        selectedDate: null,
        name: null,
        desc: null,
        priority: null
      }
    },
    created() {

    },
    methods: {
      onSave: function () {
        let vm = this;
        let date = new Date(vm.selectedDate);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

        axios.post(`/api/tasks`, {
          name: vm.name,
          desc: vm.desc,
          priority: vm.priority,
          date: date2
        })
          .then(response => {
            // JSON responses are automatically parsed.
            console.log(response)
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    }
  }
</script>

<style scoped>

</style>
