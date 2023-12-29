from flask import Flask, request, render_template, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'greentreemonitor1357'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()
GAMES_PLAYED = []
global board
board = None

@app.route('/')
def home():
    # app.logger.info('variable: %s', variable)
    # import pdb;  pdb.set_trace()
    return render_template('home.html')

@app.route('/game')
def game():
    global board
    board = boggle_game.make_board()
    session['board'] = board
    session['games-played'] = GAMES_PLAYED
    return render_template('game.html', board=board)

@app.route('/check-word', methods=['POST'])
def check_word():
    word = request.json
    result = boggle_game.check_valid_word(session['board'], word['word'])
    return jsonify(result)

@app.route('/games-played', methods=['POST'])
def set_games_played():
    data = request.json
    GAMES_PLAYED.append({'score': data['score'], 'top_score': data['topScore']})
    return redirect('/game')
