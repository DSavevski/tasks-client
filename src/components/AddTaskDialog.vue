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

              <v-flex xs8>
                <v-text-field label="Name" class="--focused" required></v-text-field>
              </v-flex>
              <v-flex xs4 style="margin-top: 27px">
                <v-date-picker mode='single' v-model='selectedDate'>
                </v-date-picker>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  name="input-5-1"
                  label=""
                  value="Description"
                  class="input-group"
                  multi-line
                />
              </v-flex>

              <!--                            <v-flex xs12 sm6>
                                              <v-select
                                                      label="Age"
                                                      required
                                                      :items="['0-17', '18-29', '30-54', '54+']"
                                              ></v-select>
                                          </v-flex>
                                          <v-flex xs12 sm6>
                                              <v-select
                                                      label="Interests"
                                                      multiple
                                                      autocomplete
                                                      chips
                                                      :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                                              ></v-select>
                                          </v-flex>-->
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false; $emit('closed')">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        dialog: true,
        selectedDate: null
      }
    }
  }
</script>

<style scoped>

</style>
