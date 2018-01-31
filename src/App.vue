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

        <v-list-tile @click="onClick()">
          <v-list-tile-action>
            <v-icon>today</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              Today
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="onClick()">
          <v-list-tile-action>
            <v-icon>view_week</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              Week
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider class="my-4"/>

        <!--<v-layout row align-center>
          <v-flex xs6>
            <v-subheader>
              Tasks
            </v-subheader>
          </v-flex>
        </v-layout>

        <v-list-tile @click="onClick()">
          <v-list-tile-action>
            <v-icon>add</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title class="grey&#45;&#45;text">
              Add new task
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>-->


        <v-layout row align-center>
          <v-flex xs6>
            <v-subheader>
              Filters
            </v-subheader>
          </v-flex>
        </v-layout>

        <template>
          <v-tabs icons centered>
            <v-tabs-bar color="" style="font-size: 11px; height: 40px">
              <v-tabs-slider color="amber" style="height: 10%"></v-tabs-slider>
              <v-tabs-item href="#tab-1">
                Recents
              </v-tabs-item>
              <v-tabs-item href="#tab-2">
                Favorites
              </v-tabs-item>
              <v-tabs-item href="#tab-3">
                Nearby
              </v-tabs-item>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content
                v-for="i in 3"
                :key="i"
                :id="'tab-' + i"
              >
                <v-card flat style="background-color: inherit">
                  <v-card-text>{{ text }}</v-card-text>
                </v-card>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </template>


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
    <v-toolbar color="amber" app absolute clipped-left>
      <v-toolbar-side-icon v-if="$vuetify.breakpoint.width <= 1264" @click="drawer = !drawer"/>
      <span class="title">Tasks&nbsp;<!--<span class="text">Keep</span>--></span>
    </v-toolbar>

    <!--Container-->
    <v-btn fab bottom right color="pink" dark fixed @click.stop="dialog = !dialog">
      <v-icon>add</v-icon>
    </v-btn>
    <v-content>
      <add-task-dialog v-if="dialog"></add-task-dialog>
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
  import AddTaskDialog from '@/components/AddTaskDialog'

  export default {
    data: () => ({
      drawer: null,
      dialog: false,
      items: ['tab-1', 'tab-2', 'tab-3'],
      active: null,
      text: 'Test',
      selectedDate: null,
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

    props: {
      source: String
    },

    computed: {},
    components: {
      AddTaskDialog
    },
    methods: {
      onClick: function (arg) {
        if (arg === 3) {
          this.dialog = !this.dialog;
        } else if (arg === 2) {

        } else {

        }
      },
      onClosedDialog: function () {
        this.dialog = false;
      },
      next () {
        this.active = this.tabs[(this.tabs.indexOf(this.active) + 1) % this.tabs.length]
      }
    }
  }
</script>

<style>
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
    width: 92%;
    text-align: center;
    border-bottom: 1px solid black;
  }

  .datepicker-input:focus {
    outline: none;

  }
</style>
