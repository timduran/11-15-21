const games = ['Resident Evil', 'Warcraft', 'Fallout New Vegas', 'League Of Legends', 'Bloodborne', 'Legend Of Zelda', 'Call Of Duty', 'Super Mario Sunshine', 'Stardew Valley', 'Mario Party', 'Pokemon Stadium', 'Age Of Empires', 'Skyrim', 'Half Life', 'Pajama Sam']
let guessedLetters = []
let chosenGame = ''
let isGameStarted = false
let guesses = 10
let points = 0

let scores = JSON.parse(localStorage.getItem('scores')) || []

const renderWord = () => {
  let finishedWord = true 
  let chosenGameArr = chosenGame.split('')
  let wordRender = ''
  chosenGameArr.forEach(char => {
    if (char === ' ') {
      wordRender += '    '
    } else if (guessedLetters.indexOf(char.toLowerCase()) !== -1) {
      wordRender += `${char} `
    } else {
      finishedWord = false
      wordRender += '_ '
    }
  })
  document.getElementById('word').textContent = wordRender

  if (finishedWord) {
    points += 10 + (guesses * 5)
    isGameStarted = false
    if (games.length > 0) {
      document.getElementById('roundInfo').style.display = 'none'
      document.getElementById('newRoundInfo').style.display = 'block'
    } else {
      document.getElementById('win').style.display = 'block'
      document.getElementById('viewScores').style.display = 'block'
    }
  }
}

const newGame = () => {
  document.getElementById('scores').style.display = 'none'
  document.getElementById('game').style.display = 'block'
  document.getElementById('win').style.display = 'none'
  document.getElementById('lose').style.display = 'none'
  guesses = 10
  guessedLetters = []
  document.getElementById('guesses').textContent = guesses
  document.getElementById('guessed').textContent = guessedLetters.join(', ')
  const index = Math.floor(Math.random() * games.length)
  chosenGame = games[index]
  games.splice(index, 1)
  // console.log(chosenGame)
  isGameStarted = true
  document.getElementById('start').style.display = 'none'
  document.getElementById('newRoundInfo').style.display = 'none'
  document.getElementById('roundInfo').style.display = 'block'
  renderWord()
}

document.getElementById('newRound').addEventListener('click', () => newGame())

document.getElementById('start').addEventListener('click', () => newGame())

document.getElementById('viewScores').addEventListener('click', () => {
  document.getElementById('game').style.display = 'none'
  document.getElementById('scores').style.display = 'block'
  document.getElementById('myScore').textContent = points
})

document.getElementById('submitScore').addEventListener('click', event => {
  event.preventDefault()
  const record = {
    username: document.getElementById('username').value,
    score: points
  }
  scores.push(record)
  localStorage.setItem('scores', JSON.stringify(scores))
  document.getElementById('addScores').style.display = 'none'
  document.getElementById('displayScores').style.display = 'block'
  scores = scores.sort((a, b) => b.score - a.score)
  scores.forEach(score => {
    let scoreElem = document.createElement('div')
    scoreElem.innerHTML = `<h6>Username: ${score.username} | Score: ${score.score}</h6><hr>`
    document.getElementById('displayScores').append(scoreElem)
  })
  points = 0
  document.getElementById('start').style.display = 'block'
})

document.onkeyup = event => {
  if (isGameStarted && event.keyCode >= 65 && event.keyCode <= 90 && guessedLetters.indexOf(event.key) === -1) {
    guessedLetters.push(event.key)
    document.getElementById('guessed').textContent = guessedLetters.join(', ')
    let isInWord = false
    let chosenGameArr = chosenGame.split('')
    chosenGameArr.forEach(char => {
      if (char.toLowerCase() === event.key) {
        isInWord = true
      }
    })
    if (!isInWord) {
      guesses--
      document.getElementById('guesses').textContent = guesses
      if (guesses <= 0) {
        document.getElementById('roundInfo').style.display = 'none'
        document.getElementById('lose').style.display = 'block'
        document.getElementById('viewScores').style.display = 'block'
      }
    }
    renderWord()
  }
}
