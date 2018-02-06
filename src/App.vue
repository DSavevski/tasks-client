<template>

  <v-app id="inspire" v-if="auth.user.authenticated">

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
        <v-list-tile :to="{name: 'daily'}">
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
            <v-tabs-item :href="'#tab-1'" @click="selectedTab = 'Category'">
              Categories
            </v-tabs-item>
            <v-tabs-item :href="'#tab-2'" @click="selectedTab = 'Completed'">
              Completed
            </v-tabs-item>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content v-for="i in 3" :key="i" :id="'tab-' + i">
              <ul>
                <li v-for="f in test.get(selectedTab)" class="listCategory grey--text" @click="setFilter(f,selectedTab)" :class="{'isActive':f.name===filterObj[selectedTab].name}">
                  {{f.name}}
                </li>
              </ul>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>



      </v-list>
    </v-navigation-drawer>

    <!--Navbar-->
    <v-toolbar color="amber" app clipped-left fixed>
      <v-toolbar-side-icon v-if="$vuetify.breakpoint.width <= 1264" @click="drawer = !drawer"/>
      <span class="title">{{auth.user.profile.name}}</span>
      <v-spacer></v-spacer>
      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator" @click="logOut()" class="mr-3">
          <v-btn flat>Logout</v-btn>

        </v-toolbar-title>
      </v-menu>
    </v-toolbar>

    <!--Container-->
    <v-btn fab bottom right color="pink" dark fixed @click.native="onNewTask()">
      <v-icon>add</v-icon>
    </v-btn>

    <v-content>
      <add-task-dialog v-if="dialog" :title="modalTitle" :task="modalTask"></add-task-dialog>
      <v-snackbar :timeout="3000" :color="'success'" :multi-line="false"
                  :vertical="false" v-model="snackbar">
        {{snackbarText}}
        <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>

      <router-view></router-view>

    </v-content>

  </v-app>

  <v-app id="inspire" v-else>

      <router-view></router-view>

  </v-app>

</template>

<script>
  import AddTaskDialog from '@/components/AddTaskDialog'
  import eventBus from '@/event-bus.js'
  import axios from 'axios'
  import auth from '@/auth.js'

  export default {


    data: () => ({

      snackbarText: null,
      drawer: null,
      snackbar: false,
      dialog: false,
      modalTitle: 'Create task',
      modalTask: null,
      categories: [],
      auth:auth,
      test: new Map(),
      selectedTab: '',
      filterObj: {
        Category: {name:'All'},
        Completed: {name:'All'}
      }
    }),


    created() {

      eventBus.$on('savedDialog', () => this.onSaveDialog());
      eventBus.$on('closedDialog', () => this.onCloseDialog());
      eventBus.$on('completedTask', () => this.onCompletedTask());
      eventBus.$on('notCompletedTask', () => this.onNotCompletedTask());
      eventBus.$on('editTask', (task) => this.onEditTask(task));
      eventBus.$on('deleteTask', (task) => this.onDeleteTask(task));
      eventBus.$on('pageChange', ()=>{eventBus.$emit('filter-change',this.filterObj);});

      axios.get(`/api/categories`)
        .then(response => {
          this.categories = response.data;
          this.categories.unshift({name:'All'});
          this.test.set('Category',this.categories);
          this.test.set('Completed',[{name:'All'},{name:'Completed'},{name:'Uncompleted'}]);
          this.selectedTab = 'Category';
        })
        .catch(e => {
          this.errors.push(e)
        });
        },


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

      onEditTask: function (task) {
          this.dialog = true;
          this.modalTitle = 'Edit task';
          let tmp = new Date(task['date']);
          task['date'] = tmp;
          this.modalTask = task;
      },

      onDeleteTask: function () {
        this.snackbarText = "Task deleted";
        this.snackbar = true;
        this.onCloseDialog();
        eventBus.$emit('data-change',this.filterObj);
      },

      onCloseDialog: function () {
        this.dialog = false;
      },

      onSaveDialog: function () {
        this.snackbarText = "Task created successfully!";
        this.snackbar = true;
        this.onCloseDialog();
        eventBus.$emit('data-change',this.filterObj);
      },

      onCompletedTask: function () {
        this.snackbarText = "Task completed!";
        this.snackbar = true;
        this.onCloseDialog();
        eventBus.$emit('data-change',this.filterObj);

      },

      onNotCompletedTask: function () {
        this.snackbarText = "Task not completed!";
        this.snackbar = true;
        this.onCloseDialog();
        eventBus.$emit('data-change',this.filterObj);
      },

      logOut: function(){
        auth.signOut();
      },

      setFilter: function(filter,selectedTab){
        this.filterObj[selectedTab] = filter;
        eventBus.$emit('filter-change',this.filterObj);
      }

    }

  }
</script>

<style>
  .isActive{
    background-color: lightgrey;
  }
  .listCategory {
    padding: 10px 10px 10px 30px;
    list-style-type: none;
    font-weight: bold;
  }

  .listCategory:hover {

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
