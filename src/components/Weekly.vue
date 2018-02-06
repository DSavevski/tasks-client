<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>

        <v-flex xs1>
          <v-icon class="display-3 unselectable" @click="onPrevious()">chevron_left</v-icon>
        </v-flex>
        <v-flex xs10>
          <h4 class="display-1 text-xs-center">{{currentDay | filterDate}} - {{lastDay | filterDate}}</h4>
        </v-flex>
        <v-flex xs1>
          <v-icon class="display-3 unselectable" @click="onNext()">chevron_right</v-icon>
        </v-flex>

        <v-flex xs12>
          <table class="table">

            <thead>
            <tr>
              <th scope="col" v-for="day in days" style="min-width: 150px;max-width: 150px">
                {{day | filterDate}}
              </th>
            </tr>
            </thead>

            <tbody>
            <tr>
              <td v-for="dailyTasks in filteredTasks" style="min-width: 150px; max-width: 150px">
                <v-flex v-for="task in dailyTasks" :key="task.id" class="task">
                  <v-card :class="getCssClass(task)" class="grid" @click.native="onEdit(task)">
                    <v-card-title primary-title>
                      <div>
                        <h3>{{task.name}}</h3>
                      </div>
                    </v-card-title>
                    <v-card-actions>
                    <span class="grey--text">{{task.category.name}}</span>
                      <v-divider></v-divider>
                    <v-switch style="max-height: 20px; margin-left: 10px;" color="success" label=""
                              v-model="task.completed" @click.native="onCompleted($event,task);"/>
                    </v-card-actions>
                  </v-card>
                </v-flex>

              </td>
            </tr>
            </tbody>
          </table>
        </v-flex>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
  import moment from 'moment';
  import axios from 'axios';
  import eventBus from '@/event-bus.js';

  export default {
    data() {
      return {
        currentDay: new Date(),
        lastDay: new Date(),
        tasks: null,
        filteredTasks: [],
        days: null
      }
    },


    created() {
      if (this.currentDay.getDay() == 0) {
        this.currentDay.setUTCHours(this.currentDay.getHours() - 24 * 7);
        this.lastDay.setUTCHours(this.lastDay.getHours() - 24 * 7);
      }
      this.currentDay.setHours(this.currentDay.getHours() - (this.currentDay.getDay() - 1) * 24);
      this.lastDay.setHours(this.lastDay.getHours() - (this.lastDay.getDay() - 1) * 24);
      this.lastDay.setHours(this.lastDay.getHours() + 6 * 24);

      this.fetchData();

      eventBus.$on('data-change', (filterObj) => this.fetchData(filterObj));
      eventBus.$on('filter-change', (filterObj) => this.filterData(filterObj));
    },


    methods: {
      fetchData: function (filterObj) {
        let formattedDate = moment(this.currentDay).format("YYYY-MM-DD");
        axios.get(`/api/tasks/weekly/${formattedDate}`)
          .then(response => {
            this.tasks = response.data.tasks;
            this.days = response.data.days;
            this.filteredTasks = this.tasks;
            if(filterObj)
              this.filterData(filterObj);
          })
          .catch(e => {
            console.log(e);
          })
      },

      getCssClass: function (task) {
        if (task.completed === 1)
          return 'completed';
        else if (task.priority === 'High')
          return 'high';
        else if (task.priority === 'Medium')
          return 'medium';
        else if (task.priority === 'Low')
          return 'low';
        return "";
      },

      onEdit: function (task) {
        eventBus.$emit('editTask', task);
      },

      onCompleted: function (event, task) {
        event.stopPropagation();
        let formattedDate = moment(task.date).format("YYYY-MM-DD");
        axios.put(`/api/tasks/${task.id}`, {
          name: task.name,
          desc: task.desc,
          priority: task.priority,
          completed: task.completed,
          date: formattedDate,
          category_id: task.category_id
        })
          .then(response => {
            if (task.completed == 1)
              eventBus.$emit('completedTask');
            else eventBus.$emit('notCompletedTask')

          })
          .catch(e => {
            console.log(e);
          })
      },

      onPrevious: function () {
        this.currentDay.setHours(this.currentDay.getHours() - 7 * 24);
        this.lastDay.setHours(this.lastDay.getHours() - 24 * 7);
        this.fetchData();
      },

      onNext: function () {
        this.currentDay.setHours(this.currentDay.getHours() + 7 * 24);
        this.lastDay.setHours(this.lastDay.getHours() + 24 * 7);
        this.fetchData();
      },

      filterData:function (filterObj) {

        this.filteredTasks = [];
        for(let day of this.tasks){
          let tmpDay=[];
          if(day.length > 0)
            for(let task of day){
               if(filterObj['Category'].name === 'All' || filterObj['Category'].name === task['category'].name)
                 if(filterObj['Completed'].name === 'All' || filterObj['Completed'].name === this.getCompletedStatus(task['completed']))
                    tmpDay.push(task);
           }
          this.filteredTasks.push(tmpDay);
        }
      },

      getCompletedStatus: function(completedStatus){
        if(completedStatus === 1)
          return 'Completed';
        else return 'Uncompleted';
      }

    },


    filters: {
      filterDate: function (date) {
        return moment(date).format('ddd, MMM Do');
      }
    }

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .completed {
    border-top: 10px solid black;
    opacity: 0.35;
  }

  .high {
    border-top: 10px solid red;
  }

  .medium {
    border-top: 10px solid yellow;
  }

  .low {
    border-top: 10px solid green;
  }

  .task {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    cursor: pointer;
    user-select: none;
  }

  ul {
    list-style-type: none;
  }

  /* Pulled from https://github.com/twbs/bootstrap/blob/v4-dev/dist/css/bootstrap.css#L2079-L2241 */

  .table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
  }

  .table th,
  .table td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #eceeef;
  }

  .table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #eceeef;
  }

  .table tbody + tbody {
    border-top: 2px solid #eceeef;
  }

  .table .table {
    background-color: #fff;
  }

  .table-sm th,
  .table-sm td {
    padding: 0.3rem;
  }

  .table-bordered {
    border: 1px solid #eceeef;
  }

  .table-bordered th,
  .table-bordered td {
    border: 1px solid #eceeef;
  }

  .table-bordered thead th,
  .table-bordered thead td {
    border-bottom-width: 2px;
  }

  .table-striped tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .table-hover tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }

  .table-active,
  .table-active > th,
  .table-active > td {
    background-color: rgba(0, 0, 0, 0.075);
  }

  .table-hover .table-active:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }

  .table-hover .table-active:hover > td,
  .table-hover .table-active:hover > th {
    background-color: rgba(0, 0, 0, 0.075);
  }

  .table-success,
  .table-success > th,
  .table-success > td {
    background-color: #dff0d8;
  }

  .table-hover .table-success:hover {
    background-color: #d0e9c6;
  }

  .table-hover .table-success:hover > td,
  .table-hover .table-success:hover > th {
    background-color: #d0e9c6;
  }

  .table-info,
  .table-info > th,
  .table-info > td {
    background-color: #d9edf7;
  }

  .table-hover .table-info:hover {
    background-color: #c4e3f3;
  }

  .table-hover .table-info:hover > td,
  .table-hover .table-info:hover > th {
    background-color: #c4e3f3;
  }

  .table-warning,
  .table-warning > th,
  .table-warning > td {
    background-color: #fcf8e3;
  }

  .table-hover .table-warning:hover {
    background-color: #faf2cc;
  }

  .table-hover .table-warning:hover > td,
  .table-hover .table-warning:hover > th {
    background-color: #faf2cc;
  }

  .table-danger,
  .table-danger > th,
  .table-danger > td {
    background-color: #f2dede;
  }

  .table-hover .table-danger:hover {
    background-color: #ebcccc;
  }

  .table-hover .table-danger:hover > td,
  .table-hover .table-danger:hover > th {
    background-color: #ebcccc;
  }

  .thead-inverse th {
    color: #fff;
    background-color: #292b2c;
  }

  .thead-default th {
    color: #464a4c;
    background-color: #eceeef;
  }

  .table-inverse {
    color: #fff;
    background-color: #292b2c;
  }

  .table-inverse th,
  .table-inverse td,
  .table-inverse thead th {
    border-color: #fff;
  }

  .table-inverse.table-bordered {
    border: 0;
  }

  .table-responsive {
    display: block;
    width: 100%;
    overflow-x: auto;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  .table-responsive.table-bordered {
    border: 0;
  }

</style>
