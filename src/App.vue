<template>
    <v-app id="inspire">

        <!--Sidebar-->
        <v-navigation-drawer fixed :clipped="$vuetify.breakpoint.width > 1264" v-model="drawer" class="grey lighten-4"
                             app>
            <v-list dense class="grey lighten-4">
                <template v-for="(item, i) in items">

                    <v-layout row v-if="item.heading" align-center :key="i">
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-flex>

                        <v-flex v-if="item.heading !== 'General'" xs6 class="text-xs-right">
                            <v-btn small flat>edit</v-btn>
                        </v-flex>
                    </v-layout>

                    <v-divider v-else-if="item.divider" class="my-4" :key="i"/>

                    <v-list-tile :key="i" v-else @click="item.func">
                        {{item.func}}
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title class="grey--text">
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                </template>
            </v-list>

            <div id="cal">
                <v-date-picker
                        mode='range'
                        v-model='selectedDate'
                        :attributes='attrs'
                        show-caps>
                </v-date-picker>
            </div>
        </v-navigation-drawer>

        <!--Navbar-->
        <v-toolbar color="amber" app absolute clipped-left>
            <v-toolbar-side-icon v-if="$vuetify.breakpoint.width <= 1264" @click="drawer = !drawer"/>
            <span class="title">Tasks&nbsp;<!--<span class="text">Keep</span>--></span>
        </v-toolbar>

        <!--Container-->
        <v-content>
            <v-container fluid fill-height class="grey lighten-4">
                <v-layout justify-center align-center>

                    <router-view/>

                </v-layout>
            </v-container>
        </v-content>

    </v-app>
</template>

<script>
    import AddTaskDialog from '@/components/AddTaskDialog'

    export default {
        data: () => ({
            drawer: null,

            items: [
                {heading: 'General'},
                {icon: 'lightbulb_outline', text: 'Notes', func: 'test'},
                {icon: 'touch_app', text: 'Reminders', func: 'test2'},
                {divider: true},
                {heading: 'Categories'},
                {icon: 'add', text: 'Create new category', func: 'test()'},
                {divider: true}
            ],
            selectedDate: null,

            attrs: [
                {
                    key: 'today',
                    dates: new Date(2018, 0, 1),
                    highlight: {
                        backgroundColor: '#ff8080',
                    },
                    // Just use a normal style
                    contentStyle: {
                        color: '#fafafa',
                    },
                    // Our new popover here
                    popover: {
                        label: 'Test',
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
            test: function () {
                console.log('test');
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
