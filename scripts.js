'use strict';
runGame();

function runGame() {
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
    let firstEl, 
        secondEl, 
        timerId;
    let timerValue = 1000;
    
    initGame();
    
    async function initGame() {
        let responseSize = await fetch('https://kde.link/test/get_field_size.php');
        let size = await responseSize.json();
        let cardsCount = size.width * size.height;
        let gameBox = document.getElementById('game-box')
        let gameScore = document.getElementById('game-score')
    
        gameBox.style.width = (96+2)*size.width + 'px';
        gameBox.innerHTML = makeCardsCollectionHtml(cardsCount);
        let cards = document.querySelectorAll('.card');
        cards.forEach(card => card.addEventListener('click', handleCardClick));
    
        updateTimer(timerValue);
        timerId = setInterval(() => updateTimer(--timerValue), 1000)
    
        function updateTimer(timerValue) {
            gameScore.innerHTML = `<div id="timer">${timerValue}</div>`;
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
                return `<div class="card" data-number="${getImageId(imgUrl)}">
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
    }
    
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
    
        function checkCoincidence() {
            let args = Array.prototype.slice.call(arguments);
            let [firstNum, secondNum] = args.map(el => el.getAttribute('data-number'));
        
            if (firstNum == secondNum) {
                setTimeout(function() {
                    args.map(el => {
                        el.classList.remove('selected');
                        el.classList.add('completed');
                        checkGameProcess();
                    })
                }, 200);
            } else {
                setTimeout(function() {
                    args.map(el => {
                        el.classList.remove('selected');
                        el.addEventListener('click', handleCardClick);
                    })
                }, 500);
            }
            resetSteps();
        
            function checkGameProcess() {
                let generalCardsCount = document.getElementsByClassName('card').length;
                let completedCardsCount = document.getElementsByClassName('completed').length;
            
                (completedCardsCount == generalCardsCount) && finishGame();
            }
            
            function resetSteps() {
                firstEl = null;
                secondEl = null;
            }
        }
    }
    
    function finishGame() {
        clearInterval(timerId);
        showTotal();
    
        function showTotal() {
            let totalScore = timerValue > 0 ? timerValue : 0;
            let gameScore = document.getElementById('game-score');
    
            gameScore.innerHTML = totalScoreHtml(totalScore) + resetButtonHtml();
            document.getElementById('reset-button')
                    .addEventListener('click', handleResetButtonClick);
    
            function totalScoreHtml(totalScore) {
                return `<div class="game-result">
                            End! Your score is <b>${totalScore}</b>
                        </div>`;
            }
            function resetButtonHtml() {
                return `<div id="reset-button">New game</div>`;
            }
            function handleResetButtonClick() {
                location.reload();
            }
        }
    }
}




