<template>
  <div>
    <h1>Generated Fixtures</h1>
    <div style="display:inline-flex; flex-wrap: wrap; width: 400px; height: 150px; margin: 12px"
         v-for="(week, i) in fixtureWeeks" :key="i">
      <b-table-simple style="width: 400px">
        <b-thead head-variant="dark">
          <b-tr>
            <b-th colspan="2">Week {{ i + 1 }}</b-th>
          </b-tr>
        </b-thead>

        <b-tbody>
          <b-tr v-for="(match, j) in week.Matches" :key="j">
            <b-td>{{ match.HomeTeam }}</b-td>
            <b-td>{{ match.AwayTeam }}</b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>

    </div>
    <div>
      <b-button variant="info" style="color: floralwhite;" @click="startSimulation">Start Simulation</b-button>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'

export default {
  data () {
    return {
      weeks: []
    }
  },
  computed: {
    fixtureWeeks () {
      return this.weeks.map(x => {
        return {
          WeekIndex: x.index,
          Matches: x.matches.map(y => {
            return {
              HomeTeam: y.HomeTeam.name,
              AwayTeam: y.AwayTeam.name
            }
          })
        }
      })
    }
  },
  methods: {
    async generateFixtures () {
      const response = await axios.get('http://localhost:8080/get-fixture')
      this.weeks = response.data.weeks
    },
    startSimulation () {
      router.push({
        name: 'simulation'
      })
    }
  },
  created () {
    this.generateFixtures()
  }
}

</script>
