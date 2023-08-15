const axios = require('axios')

class F1ApiHandler {
  constructor() {
    this.axiosApp = axios.create({
      baseURL: 'https://ergast.com/api/f1'
    })
  }

  getAllRaces() {
    return this.axiosApp.get('/2023.json')
  }

  getAllResults() {
    return this.axiosApp.get('/2023/results.json')
  }

  getAllDriversStandings() {
    return this.axiosApp.get('/2023/driverstandings.json')
  }

  getAllTeamsStandings() {
    return this.axiosApp.get('/2023/constructorstandings.json')
  }

  getAllCircuits() {
    return this.axiosApp.get('/2023/circuits.json')
  }


  getOneDriver(driver_Id) {
    return this.axiosApp.get(`/2023/drivers/${driver_Id}.json`)
  }

  getOneTeam(team_Id) {
    return this.axiosApp.get(`/2023/constructors/${team_Id}.json`)
  }
}

const f1Api = new F1ApiHandler()

module.exports = f1Api
