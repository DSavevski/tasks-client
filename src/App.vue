<template>
  <v-app id="inspire">
    <!--Sidebar-->
    <v-navigation-drawer fixed :clipped="$vuetify.breakpoint.width > 1264" v-model="drawer" class="grey lighten-4" app>
      <v-list dense class="grey lighten-4">

        <v-layout row align-center>
          <v-flex xs6>
            <v-subheader>
              General
            </v-subheader>
          </v-flex>
        </v-layout>

        <v-list-tile :to="'/daily'">
          <v-list-tile-action>
            <v-icon>today</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              Daily
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="'/weekly'">
          <v-list-tile-action>
            <v-icon>view_week</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              Weekly
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider class="my-4"/>

        <v-layout row align-center>
          <v-flex xs6>
            <v-subheader>
              Filters
            </v-subheader>
          </v-flex>
        </v-layout>


        <v-tabs icons centered>
          <v-tabs-bar color="" style="font-size: 11px; height: 40px">
            <v-tabs-slider color="amber" style="height: 10%"></v-tabs-slider>
            <v-tabs-item href="#tab-1">
              Categories
            </v-tabs-item>
            <!--<v-tabs-item href="#tab-2">
              Priorities
            </v-tabs-item>-->
            <v-tabs-item href="#tab-3">
              Completed
            </v-tabs-item>
          </v-tabs-bar>
          <v-tabs-items>

            <!--<template v-for="item in items" style="max-height: 30px">-->
            <!--<v-list-tile avatar @click="" style="max-height: 30px">-->
            <!--<v-list-tile-content style="max-height: 30px">-->
            <!--<v-list-tile-title style="max-height: 30px" v-html="item"></v-list-tile-title>-->
            <!--</v-list-tile-content>-->
            <!--</v-list-tile>-->
            <!--</template>-->

            <v-tabs-content v-for="i in 3" :key="i" :id="'tab-' + i">

              <ul>
                <li v-for="category in categories" class="listCategory grey--text">
                  {{category.name}}
                </li>
              </ul>

            </v-tabs-content>

          </v-tabs-items>
        </v-tabs>
      </v-list>

      <!--<div id="cal">
        <v-date-picker
          mode='range'
          v-model='selectedDate'
          :attributes='attrs'
          show-caps>
        </v-date-picker>
      </div>-->

    </v-navigation-drawer>

    <!--Navbar-->
    <v-toolbar color="amber" app clipped-left fixed>
      <v-toolbar-side-icon v-if="$vuetify.breakpoint.width <= 1264" @click="drawer = !drawer"/>
      <span class="title">Tasks&nbsp;<!--<span class="text">Keep</span>--></span>
    </v-toolbar>

    <!--Container-->
    <v-btn fab bottom right color="pink" dark fixed @click.native="onNewTask()">
      <v-icon>add</v-icon>
    </v-btn>
    <v-content>
      <add-task-dialog v-if="dialog" :title="modalTitle" :task="modalTask"></add-task-dialog>
      <v-snackbar :timeout="3000" :color="'success'" :multi-line="false"
                  :vertical="false" v-model="snackbar">
        Task created successfully!
        <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
  import AddTaskDialog from '@/components/AddTaskDialog'
  import eventBus from '@/event-bus.js';
  import axios from 'axios';

  export default {
    data: () => ({
      drawer: null,
      snackbar: false,
      dialog: false,
      items: ['tab-1', 'tab-2', 'tab-3'],
      active: null,
      text: 'Test',
      selectedDate: null,
      modalTitle: 'Create task',
      modalTask: null,
      categories: [],
      attrs: [
        {
          key: 'today',
          dates: new Date(),
          highlight: {
            backgroundColor: '#ff8080',
          },
          contentStyle: {
            color: '#fafafa',
          },
          popover: {
            label: 'Today',
          },
        },
      ],
    }),
    created() {
      eventBus.$on('saved', () => this.onSaveSuccess());
      eventBus.$on('closed', () => this.onCloseDialog());
      eventBus.$on('edit', (task) => {
        this.dialog = true;
        this.modalTitle = 'Edit task';
        let tmp = new Date(task['date']);
        task['date'] = tmp;
        this.modalTask = task;
      });

      axios.get(`/api/categories`)
        .then(response => {
          this.categories = response.data;
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    props: {
      source: String
    },
    computed: {},
    components: {
      AddTaskDialog
    },
    methods: {
      onNewTask: function () {
        this.dialog = true;
        this.modalTitle = 'Create task';
        this.modalTask = {
          name: '',
          date: new Date(),
          desc: '',
          priority: '',
          category_id: null
        };
      },
      onCloseDialog: function () {
        this.dialog = false;
      },
      onSaveSuccess: function () {
        this.snackbar = true;
        this.onCloseDialog();
        eventBus.$emit('data-change');
      },
      next() {
        this.active = this.tabs[(this.tabs.indexOf(this.active) + 1) % this.tabs.length]
      }
    }
  }
</script>

<style>
  .listCategory {
    padding: 10px 10px 10px 30px;
    list-style-type: none;
    font-weight: bold;
  }

  .listCategory:hover {
    background-color: lightgrey;
  }

  #cal {
    margin-left: 20px;
  }

  #keep main .container {
    height: 660px;
  }

  .navigation-drawer__border {
    display: none;
  }

  .text {
    font-weight: 400;
  }

  .datepicker-input {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid black;
  }

  .datepicker-input:focus {
    outline: none;

  }
</style>
