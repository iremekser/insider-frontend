<template>
  <div>
    <h1>Simulation</h1>
    <div>
      <div style="display: flex; flex-wrap: wrap; margin-top: 50px">
        <div>
          <b-table-simple style="width: 600px; margin-left: 20px">
            <b-thead head-variant="dark">
              <b-tr>
                <b-th>Team Name</b-th>
                <b-th>P</b-th>
                <b-th>W</b-th>
                <b-th>D</b-th>
                <b-th>L</b-th>
              </b-tr>
            </b-thead>

            <b-tbody>
              <b-tr v-for="(team, j) in sortedTeams" :key="j">
                <b-td>{{ team.teamName }}</b-td>
                <b-td>{{ team.point }}</b-td>
                <b-td>{{ team.win }}</b-td>
                <b-td>{{ team.draw }}</b-td>
                <b-td>{{ team.lose }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </div>
        <div style="width: 400px; margin-left: 50px;display: flex">
          <b-table-simple v-if="currentWeek!==null" style="align-self: start">
            <b-thead head-variant="dark">
              <b-tr>
                <b-th colspan="2">Week {{ currentWeekIndex + 1 }}</b-th>
              </b-tr>
            </b-thead>

            <b-tbody>
              <b-tr v-for="(match, j) in currentWeek" :key="j">
                <b-td>{{ match.homeTeam }}</b-td>
                <b-td>{{ match.awayTeam }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
          <b-alert style="align-self: center;justify-self: center; width: 100% " v-else variant="danger" show>All
            matches played.
          </b-alert>
        </div>
        <div>
          <b-table-simple v-if="currentWeek!==null" style="width: 400px; margin-left: 40px">
            <b-thead head-variant="dark">
              <b-tr>
                <b-th>Home Team</b-th>
                <b-th>Away Team</b-th>
                <b-th>HW</b-th>
                <b-th>D</b-th>
                <b-th>AW</b-th>
              </b-tr>
            </b-thead>

            <b-tbody>
              <b-tr v-for="(pred, j) in predictions" :key="j">
                <b-td>{{ pred.homeTeam }}</b-td>
                <b-td>{{ pred.awayTeam }}</b-td>
                <b-td>%{{ Math.round(pred.homeWin * 100) }}</b-td>
                <b-td>%{{ Math.round(pred.draw * 100) }}</b-td>
                <b-td>%{{ Math.round(pred.awayWin * 100) }}</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </div>
      </div>
      <div>
        <b-button variant="info" style="color: floralwhite;" @click="playAllWeek">Play All Weeks</b-button>
        <b-button variant="info" style="color: floralwhite; margin-left: 30px " @click="playNextWeek">Play One Week
        </b-button>
        <b-button variant="danger" style="color: floralwhite; margin-left: 30px" @click="resetData">Reset Data
        </b-button>
      </div>

    </div>

    <div style="display:inline-flex; flex-wrap: wrap; width: 400px; height: 150px; margin: 12px"
         v-for="(week, i) in playedWeeks" :key="i">
      <b-table-simple style="width: 400px">
        <b-thead head-variant="dark">
          <b-tr>
            <b-th colspan="5">Week {{ i + 1 }}</b-th>
          </b-tr>
        </b-thead>

        <b-tbody>
          <b-tr v-for="(match, j) in week.PlayedMatches" :key="j">
            <b-td><b style="font-weight: 600">{{ match.HomeTeam }}</b></b-td>
            <b-td>{{ match.HomeScore }}</b-td>
            <b-td>-</b-td>
            <b-td>{{ match.AwayScore }}</b-td>
            <b-td><b style="font-weight: 600">{{ match.AwayTeam }}</b></b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'

export default {
  data () {
    return {
      teams: [],
      currentWeekIndex: null,
      currentWeek: [],
      nextWeekScores: [],
      weeks: [],
      predictions: []
    }
  },
  computed: {
    sortedTeams () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.teams.sort((a, b) => b.point - a.point)
    },
    playedWeeks () {
      return this.weeks.map(x => {
        return {
          WeekIndex: x.index,
          PlayedMatches: x.matches.map(y => {
            return {
              HomeTeam: y.HomeTeam.name,
              AwayTeam: y.AwayTeam.name,
              HomeScore: y.HomeScore,
              AwayScore: y.AwayScore
            }
          })
        }
      })
    }
  },
  methods: {
    async getScores () {
      const response = await axios.get('http://localhost:8080/get-scores')
      this.teams = response.data.teamScores
      this.predictions = response.data.predictions
    },
    async getCurrentWeek () {
      try {
        const response = await axios.get('http://localhost:8080/get-current-week')
        this.currentWeekIndex = response.data.weekIndex
        this.currentWeek = response.data.matches
      } catch (err) {
        this.currentWeek = null
        this.currentWeekIndex = null
        await this.getFixture()
      }
    },
    async playNextWeek () {
      const response = await axios.post('http://localhost:8080/start-next-week')
      this.nextWeekScores = response.data.matches
      this.predictions = response.data.predictions
      await this.getCurrentWeek()
      await this.getScores()
    },
    async playAllWeek () {
      await axios.post('http://localhost:8080/start-all-week')
      this.currentWeek = null
      this.currentWeekIndex = null
      await this.getScores()
      await this.getFixture()
    },
    async resetData () {
      await axios.post('http://localhost:8080/clear-data')
      router.push({
        name: 'home'
      })
    },
    async getFixture () {
      const response = await axios.get('http://localhost:8080/get-fixture')
      this.weeks = response.data.weeks
    }
  },
  created () {
    this.getScores()
    this.getCurrentWeek()
  }
}

</script>
