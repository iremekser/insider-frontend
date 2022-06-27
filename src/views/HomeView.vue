<template>
  <div>
    <h1>Tournament Teams</h1>
    <div style="display: flex ; justify-content: center; align-items: center">
      <b-table striped hover :items="teamNames"
               style="width: 400px"></b-table>
    </div>
    <b-button variant="info" style="color: floralwhite; margin: 8px 0 12px 0" @click="getFixture">Generate Fixtures
    </b-button>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'

export default {
  data () {
    return {
      teams: [],
      weeks: []
    }
  },
  computed: {
    teamNames () {
      return this.teams.map(x => {
        return { TeamName: x.name }
      })
    }
  },
  methods: {
    async getTeams () {
      const response = await axios.get('http://localhost:8080/get-teams')
      this.teams = response.data.teams
    },
    getFixture () {
      router.push({
        name: 'fixture'
      })
    }
  },
  created () {
    this.getTeams()
  }
}

</script>
