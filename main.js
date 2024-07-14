function displayItemsSequentially(items, displayElement, charInterval, itemInterval, callback) {
    var currentIndex = 0;

    function displayNextItem() {
        if (currentIndex < items.length) {
            let wel = items[currentIndex];
            let index = 0;
            displayElement.textContent = ''; 
            let interval = setInterval(() => {
                if (index < wel.length) {
                    displayElement.textContent += wel[index];
                    index++;
                } else {
                    clearInterval(interval);
                    currentIndex++;
                    setTimeout(displayNextItem, itemInterval); 
                }
            }, charInterval);
        } else {
            if (callback) {
                callback();
            }
        }
    }
    displayNextItem();
}

window.onload = function initializeGame() {
    var items = ['Shall we Start the Game?', 'Click on Start'];
    var talkstart=document.getElementById('talkingDiv')
    var displayTextP = document.getElementById('talkingText');
    var startDiv = document.getElementById('start');
    var submitDiv = document.getElementById('submit');
    var robodiv=document.getElementById('talkingDivrobo')
    
    displayItemsSequentially(items, displayTextP, 70, 1000, function() {
        startDiv.style.opacity = 1;
    });

    startDiv.addEventListener('click', function() {
        console.log('Start button clicked.');
        var items1 = ['Good! Watch out the timer and Guess Left', 'Enter your Guess on board', 'Lets Start with Level 1'];
        var dispDiv = document.getElementById('disp');
        displayItemsSequentially(items1, displayTextP, 70, 1000, function() {
            dispDiv.style.opacity = 1;
            startDiv.style.opacity = 0;
            startDiv.style.zIndex = 5;
            submitDiv.style.opacity = 1;
            submitDiv.style.zIndex = 10;
            talkstart.style.opacity=0;
            robodiv.style.opacity=1
            startGame();
        });
    });
};

function startGame() {
    let level = 1;
    const maxLevel = 5;
    let maxGuesses = 10;
    let maxTime = 50;

    const levelInfo = document.querySelector('.wra1 .d1-2');
    const guessesLeftInfo = document.querySelector('.wra2 .d2-2');
    const timerInfo = document.querySelector('.wra3 .d2-2');
    const submitDiv = document.getElementById('submit');
    const dispDiv = document.getElementById('disp');
    const talkingTextrobo = document.getElementById('talkingTextrobo'); 

    function resetGame() {
        level = 1;
        maxGuesses = 10;
        maxTime = 50;
        displayItemsSequentially(['Ready...'], talkingTextrobo, 70, 1000, startGame);
    }

    function playLevel() {
        if (level > maxLevel) {
            displayItemsSequentially(['Congratulations! You have completed all levels.'], talkingTextrobo, 70, 1000, resetGame);
            return;
        }

        let randomNumber = Math.floor(Math.random() * 20) + 1;
        let guessesLeft = maxGuesses;
        let timeLeft = maxTime;

        levelInfo.textContent = level;
        guessesLeftInfo.textContent = guessesLeft;
        timerInfo.textContent = timeLeft;

        displayItemsSequentially([`Level ${level} begins!`,`Start!..`], talkingTextrobo, 30, 1000);

        const countdown = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdown);
                displayItemsSequentially([`Time's up! The number was ${randomNumber}. Starting over...`], talkingTextrobo, 70, 1000, resetGame);
            } else {
                timeLeft--;
                timerInfo.textContent = timeLeft;
            }
        }, 1000);

        submitDiv.onclick = function() {
            const userGuess = parseInt(dispDiv.value);
            if (isNaN(userGuess) || userGuess < 1 || userGuess > 20) {
                displayItemsSequentially(['Please enter a valid number between 1 and 20.'], talkingTextrobo, 30, 1000);
                return;
            }

            guessesLeft--;
            guessesLeftInfo.textContent = guessesLeft;

            if (userGuess === randomNumber) {
                clearInterval(countdown);
                displayItemsSequentially(['Congratulations! You guessed the number!'], talkingTextrobo, 30, 1000, function() {
                    level++;
                    maxGuesses--;
                    maxTime -= 5;
                    playLevel();
                });
            } else if (userGuess > randomNumber) {
                displayItemsSequentially(['The number is lower.'], talkingTextrobo, 30, 1000);
            } else if (userGuess < randomNumber) {
                displayItemsSequentially(['The number is higher.'], talkingTextrobo, 30, 1000);
            }

            if (guessesLeft <= 0) {
                clearInterval(countdown);
                displayItemsSequentially([`Out of guesses! The number was ${randomNumber}. Starting over...`], talkingTextrobo, 30, 1000, resetGame);
            }
        };
    }

    playLevel();
}
