$(document).ready(function() {
    const GAMEBOARD = $('#game-board');
    const GAMEFORM = $('#game-form');
    const WORDINPUT = $('#word');
    const BUTTON = $('#game-form button');
    const RESULT = $('#game-result');
    const SCORE = $('#game-score');
    const TOTAL = $('#game-total');
    const TIMER = $('#game-timer');
    const TIME = 60;
    let game = new BoggleGame();
    let gameOver = false;
    let res = undefined;

    if(TIMER.length) gameTimer(TIME);

    GAMEFORM.submit(async function(e) {
        e.preventDefault();
        game.setCurrentWord(WORDINPUT.val());
        if(!gameOver){
            await axios({
                method: 'POST',
                url: '/check-word',
                data: {word: game.currentWord},
                contentType: 'application/json'
            })
            .then(function (response) {
                res = response
                WORDINPUT.val('')
                WORDINPUT.focus()
            })
            .catch(function (err) {
                console.error(err);
            });
            if(!game.wordAdded(game.currentWord)){
                if(res){
                    displayResponse(res.data);
                    if(res.data == 'ok'){
                        game.addWord(calcScore(game.currentWord));
                        displayTotal(game.score);
                    } 
                }
            }else{
                displayResponse('word-guessed');
            }
        } else {
            await axios({
                method: 'POST',
                url: '/games-played',
                data: {
                    score: game.score,
                    topScore: game.topScore
                },
                contentType: 'application/json'
            })
            .then(function (res) {})
            .catch(function (err) {
                console.error(err);
            });
            game.resetGame();
            resetGame();
            if(TIMER.length) gameTimer(TIME);
        }
    });

    function displayResponse(result){
        let resultField = $('#game-result');
        resultField.val(result.toUpperCase());
    }
    
    function calcScore(word){
        let scoreField = $('#game-score');
        scoreField.val(`Score: ${word.length}`);
        return word;
    }
    
    function displayTotal(total){
        let totalField = $('#game-total');
        totalField.val(`Total: ${total}`);
    }

    function gameTimer(time){
        let timerValue = time;
        let timer = setInterval(function() {
            TIMER.val(`${--timerValue}`);
            if(timerValue == 0){
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }

    function resetGame(){
        WORDINPUT.prop('disabled', false);
        WORDINPUT.css('color','rgb(110, 110, 110)');
        WORDINPUT.css('background-color','#ffffff');
        WORDINPUT.attr("placeholder", "Add a word...");
        WORDINPUT.val('');
        WORDINPUT.focus();
        BUTTON.css('background', 'linear-gradient(to bottom, #f9f9f9 5%, #e9e9e9 100%)');
        BUTTON.css('background-color','#f9f9f9');
        BUTTON.text('Submit');
        RESULT.css('color','#3365c7');
        RESULT.css('background-color','#e0eeff');
        RESULT.attr("placeholder", "Result");
        RESULT.val('');
        SCORE.css('color','#028a0f');
        SCORE.css('background-color','#f4fdf4');
        SCORE.attr("placeholder", "Score: 0");
        SCORE.val('');
        TOTAL.css('color','#3365c7');
        TOTAL.css('background-color','#e0eeff');
        TOTAL.attr("placeholder", "Total: 0");
        TOTAL.val('');
        TIMER.css('color','rgb(110, 110, 110)');
        TIMER.css('background-color','#f4fdf4');
        TIMER.attr("placeholder", "60");
        TIMER.val('');
        // https://stackoverflow.com/questions/18490026/
        // refresh-reload-the-content-in-div-using-jquery-ajax
        GAMEBOARD.load(location.href+" #game-board>*","");
        gameOver = false;
    }

    function endGame(){
        gameOver = true;
        WORDINPUT.prop('disabled', true);
        WORDINPUT.css('color','#c4c4c4');
        WORDINPUT.css('background-color','#ffe0e0');
        WORDINPUT.attr("placeholder", "Game Over");
        WORDINPUT.val('');
        BUTTON.css('background', '#79d179');
        BUTTON.css('background-color','#79d179');
        BUTTON.text('Reset Game');
        TIMER.css('background-color','#ffe0e0');
    }

});

