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

  getAllCircuits() {
    return this.axiosApp.get('/2023/circuits.json')
  }

  getAllDriversStandings() {
    return this.axiosApp.get('/2023/driverstandings.json')
  }

  getAllTeamsStandings() {
    return this.axiosApp.get('/2023/constructorstandings.json')
  }
}

const f1Api = new F1ApiHandler()

module.exports = f1Api
