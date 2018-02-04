<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="900px">
      <v-card>
        <v-card-title style="padding-bottom: 0">
          <span class="headline">{{title}}</span>
        </v-card-title>
        <v-card-text style="padding-top: 0">
          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex xs6>
                <v-text-field name="name" label="Name" v-model='task.name' class="--focused" required></v-text-field>
              </v-flex>
              <v-flex xs6 style="margin-top: 27px">
                <v-date-picker mode='single' v-model='task.date'>
                </v-date-picker>
              </v-flex>
              <v-flex xs12>
                <v-text-field name="desc" label="Description" v-model='task.desc' value="" class="input-group"
                              multi-line
                              rows="2"/>
              </v-flex>

              <v-flex xs12 sm6>
                <v-select name="priority" label="Priority" v-model='task.priority' required
                          :items="['Low', 'Medium', 'High']"/>
              </v-flex>

              <v-flex xs12 sm6>
                <v-select label="Categories" required v-model="category" :items="categories" item-text="name"
                          item-value="id"/>
              </v-flex>
            </v-layout>

          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="onClose()">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="onSave()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import axios from 'axios';
  import moment from 'moment';
  import eventBus from '@/event-bus.js';

  export default {
    data() {
      return {
        dialog: true,
        categories: [],
        category: null
      }
    },
    props: ['title', 'task'],
    created() {
      axios.get(`/api/categories`)
        .then(response => {
          this.category = this.task['category_id'];
          this.categories = response.data;
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    methods: {
      onSave: function () {
        let formattedDate = moment(this.task.date).format("YYYY-MM-DD");
        if (this.task.id) {
          axios.put(`/api/tasks/${this.task.id}`, {
            name: this.task.name,
            desc: this.task.desc,
            priority: this.task.priority,
            completed: this.task.completed,
            date: formattedDate,
            category_id: this.category
          })
            .then(response => {
              eventBus.$emit('saved');
            })
            .catch(e => {
              console.log(e);
            })
        } else {
          axios.post(`/api/tasks`, {
            name: this.task.name,
            desc: this.task.desc,
            priority: this.task.priority,
            date: formattedDate,
            category_id: this.category
          })
            .then(response => {
              eventBus.$emit('saved');
            })
            .catch(e => {
              console.log(e);
            })
        }
      },
      onClose: function () {
        eventBus.$emit('closed');
      }
    }
  }
</script>

<style scoped>

</style>
