let deckID = ''
let playerOneScore = 0
let playerTwoScore = 0
const playerOneCardElement = document.getElementById('cards').children[0]
const playerTwoCardElement = document.getElementById('cards').children[1]
const newDeckButton = document.getElementById("new-deck-btn")
const drawCardsButton = document.getElementById("draw-btn")
const gameStatusLabel  = document.getElementById('header')
const remainingCards = document.getElementById('remaining-cards')
drawCardsButton.disabled = true

async function startGame() {
    gameStatusLabel .innerHTML = 'Game Started'
    playerOneScore = 0
    playerTwoScore = 0
    playerOneCardElement.innerHTML = `card 1:` +  `<img src=card-back.jpg>` + `Score: 0`
    playerTwoCardElement.innerHTML = `card 2:` +  `<img src=card-back.jpg>` + `Score: 0`
    const response = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    const data = await response.json()
            deckID = data.deck_id
            remainingCards.textContent = `Remaining cards: ${data.remaining}`
            drawCardsButton.disabled = false
            document.getElementById('error-msg').innerText = ""
}

function updateUI(cardElement, card, score, playerNumber) {
    cardElement.innerHTML = `card ${playerNumber}:` + `<img src=${card.image}>` + `<span>Score: ${score}</span>`
}


async function getNewCards() {

        const response = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckID}/draw/?count=2`)
        const data = await response.json()
        try {
            remainingCards.textContent = `Remaining cards: ${data.remaining}`
            const cardOne = data.cards[0]
            const cardTwo = data.cards[1]
            const winnerText = findBiggestCard(cardOne, cardTwo)
            //update UI
            updateUI(playerOneCardElement, cardOne, playerOneScore, 1)
            updateUI(playerTwoCardElement, cardTwo, playerTwoScore, 2)
            gameStatusLabel .textContent = winnerText
            if(data.remaining === 0) {
                drawCardsButton.disabled = true
                gameStatusLabel .textContent = playerOneScore > playerTwoScore ? `Card 1 game winner` : `Card 2 game winner`
            }
        } catch (error) {
            document.getElementById('error-msg').innerText = data.error
        }  
}


function findBiggestCard(card1, card2){
    let valueOne, valueTwo
    let result
    valueOne = defineCardValue(card1.value)
    valueTwo = defineCardValue(card2.value)
    if(valueOne !== valueTwo){
        playerOneScore += valueOne
        playerTwoScore += valueTwo
    }
    result = valueOne > valueTwo ? 'Card 1 wins!' : valueTwo > valueOne ? 'Card 2 wins!' : 'War!'
    return result
}
function defineCardValue(value){
    const cards = ['2','3','4','5','6','7','8','9','10','JACK','QUEEN','KING','ACE']
    let cardValue
    if(cards.indexOf(value) === cards.length -1 ){
        cardValue = 11
    } else if(cards.indexOf(value)> 8)  {
        cardValue = 10
    } else {
        cardValue = Number(value)
    }
    return cardValue
}

newDeckButton.addEventListener("click", startGame)
drawCardsButton.addEventListener("click", getNewCards)

