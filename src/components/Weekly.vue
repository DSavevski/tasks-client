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
        <h1 v-show="false">{{counter}}</h1>


        <v-flex xs12>
          <table class="table">
            <thead>
            <tr>
                <th scope="col" v-for="day in days" style="min-width: 170px">
                  {{day | filterDate}}
                </th>
            </tr>
            </thead>

            <tbody>
            <tr>
              <td v-for="dailyTasks in tasks">

                <v-flex v-for="task in dailyTasks" :key="task.id" class="task">
                  <v-card :class="getCssClass(task)" class="grid" style="min-width: 170px;max-width: 220px;min-height: 64px;max-height: 100px;padding: 5px;padding-top: 25px">
                      <div class="my-text">
                        <p class="text-xs-center"><b>{{task.name}}</b></p>
                      </div>
                    <v-switch color="success" label="" v-model="task.completed" @click.native="onCompleted($event,task);"/>
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

  export default {
    data() {
      return {
        counter: 1,
        currentDay: new Date(),
        lastDay: new Date(),
        tasks: null,
        days: null
      }
    },
    created() {
      this.currentDay.setHours(this.currentDay.getHours() - (this.currentDay.getDay() - 1) * 24);
      this.lastDay.setHours(this.lastDay.getHours() - (this.lastDay.getDay() - 1) * 24);
      this.lastDay.setHours(this.lastDay.getHours() + 6 * 24);
      this.fetchData();
    },
    methods: {
      fetchData: function () {
        let day = moment(this.currentDay).format("YYYY-MM-DD");
        axios.get(`/api/tasks/weekly/${day}`)
          .then(response => {
            this.tasks = response.data.data;
            this.days = response.data['days'];
          })
          .catch(e => {
            this.errors.push(e)
          })
      },
      getCssClass: function (task) {
        if(task.completed === 1)
          return 'completed';
        else if(task.priority === 'High')
          return 'high';
        else if(task.priority === 'Medium')
          return 'medium';
        else if(task.priority === 'Low')
          return 'low';
        return "";
      },
      onPrevious: function () {
        this.counter -= 1;
        this.currentDay.setHours(this.currentDay.getHours() - 7 * 24);
        this.lastDay.setHours(this.lastDay.getHours() - 24 * 7);
        this.fetchData();
      },
      onNext: function () {
        this.counter += 1;
        this.currentDay.setHours(this.currentDay.getHours() + 7 * 24);
        this.lastDay.setHours(this.lastDay.getHours() + 24 * 7);
        this.fetchData();
      },

    },
    filters: {
      filterDate: function (date) {
        return moment(date).format('MMM Do');
      }
    }

  }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .completed{
    border-top: 10px solid black;
    opacity: 0.35;
  }
  .high{
    border-top: 10px solid red;
  }
  .medium {
    border-top: 10px solid yellow;
  }
  .low{
    border-top: 10px solid green;
  }
.my-text{
  text-overflow: clip;
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

/*P {*/
  /*display: block; !* Fallback for non-webkit *!*/
  /*display: -webkit-box;*/
  /*max-width: 400px;*/
  /*margin: 0 auto;*/
  /*-webkit-box-orient: vertical;*/
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
/*}*/
</style>
