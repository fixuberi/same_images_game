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

async function initGame() {
    let responseSize = await fetch('https://kde.link/test/get_field_size.php');
    let size = await responseSize.json();
    let cardsCount = size.width * size.height;
    let gameBox = document.getElementById('game-box')
    gameBox.style.width = (96+2)*size.width + 'px';
    gameBox.innerHTML = makeCardsCollectionHtml(cardsCount);
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

    function makeCard(imgSource) {
        return `<div class="card">${makeImage(imgSource)}</div>`;
    
        function makeImage(imgSource) {
            return `<img src="${imgSource}">`
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

