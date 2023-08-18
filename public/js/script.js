document.addEventListener('DOMContentLoaded', () => {
  console.log('Project JS imported successfully!')
})

const currentUrl = window.location.href
const navLinks = document.querySelectorAll('.nav-link')

navLinks.forEach(link => {
  if (link.href === currentUrl) {
    link.classList.add('active')
  } else {
    link.classList.remove('active')
  }
})

const cardDrivers = document.querySelectorAll('.driver-card')

cardDrivers.forEach(cardDriver => {
  cardDriver.addEventListener('click', () => {
    cardDriver.classList.toggle('flipped')
  })
})

const cardTeams = document.querySelectorAll('.team-card')

cardTeams.forEach(cardTeam => {
  cardTeam.addEventListener('click', () => {
    cardTeam.classList.toggle('flipped')
  })
})
