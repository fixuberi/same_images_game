'use strict';

let images = [
    'https://kde.link/test/2.png',
    'https://kde.link/test/8.png',
    'https://kde.link/test/4.png',
    'https://kde.link/test/5.png',
    'https://kde.link/test/7.png',
    'https://kde.link/test/0.png',
    'https://kde.link/test/3.png',
    'https://kde.link/test/6.png',
    'https://kde.link/test/1.png',
    'https://kde.link/test/9.png'
];
initGame();
var firstEl, secondEl;

function handleCardClick() {
    if (!firstEl) {
        firstEl = this;
        this.classList.add('selected');
        this.removeEventListener('click', handleCardClick);
        return;
    } 
    secondEl = this;
    this.classList.add('selected');
    this.removeEventListener('click', handleCardClick);
    checkCoincidence(firstEl, secondEl); 
}

function checkCoincidence(firstEl, secondEl) {
    let args = Array.prototype.slice.call(arguments);
    let [firstNum, secondNum] = args.map(el => el.getAttribute('data-number'));

    if (firstNum == secondNum) {
        setTimeout(function() {
            args.map(el => {
                el.classList.remove('selected');
                el.classList.add('completed')
            })
        }, 200)
    } else {
        setTimeout(function() {
            args.map(el => {
                el.classList.remove('selected');
                el.addEventListener('click', handleCardClick);
            })
        }, 500);
    }
    resetSteps();
}

function checkGameProcess() {
    
}

function resetSteps() {
    firstEl = null;
    secondEl = null;
}

async function initGame() {
    let responseSize = await fetch('https://kde.link/test/get_field_size.php');
    let size = await responseSize.json();
    let cardsCount = size.width * size.height;
    let gameBox = document.getElementById('game-box')

    gameBox.style.width = (96+2)*size.width + 'px';
    gameBox.innerHTML = makeCardsCollectionHtml(cardsCount);
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', handleCardClick));
}

function makeCardsCollectionHtml(cardsCount) {
    let cards = fillCollection(cardsCount);
    return shuffle(cards).join('');

    function fillCollection(cardsCount) {
        let cardsCollection = [];
        let i = 0;
        while(cardsCollection.length < cardsCount) {
            let tempCard = makeCard(images[i]);
            cardsCollection.push(tempCard, tempCard);
            if (i < images.length - 1) {
                    i++;
                    continue;
                } else {
                   images = shuffle(images); 
                    i = 0;
                }
        }
        return cardsCollection
    }

    function makeCard(imgUrl) {
        return `<div class="card" data-number="${getImageId(imgUrl)}" onclick>
                    <div class="back-face"></div>
                    ${makeImage(imgUrl)}
                </div>`;
    
        function makeImage(url) {
            return `<img src="${url}" class="front-face">`
        }

        function getImageId(url) {
            return url.split('/').slice(-1)[0].split('.')[0]
        }
    }
    
    function shuffle(arr){
        var j, temp;
        for(var i = arr.length - 1; i > 0; i--){
            j = Math.floor(Math.random()*(i + 1));
            temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }
}

