from unittest import TestCase
from app import app
from flask import session, json
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class FlaskTests(TestCase):

    def test_home(self):
        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)
            self.assertEqual(res.status_code, 200)
            self.assertIn('<h1>Boggle</h1>', html)

    def test_game(self):
        with app.test_client() as client:
            res = client.get('/game')
            html = res.get_data(as_text=True)
            self.assertEqual(res.status_code, 200)
            self.assertIn('<div id="game-board">', html)

    def test_check_word(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session['board'] = [
                    ['C','A','T','C','A'],
                    ['A','T','C','A','T'],
                    ['T','C','A','T','C'],
                    ['D','O','G','D','O'],
                    ['O','G','D','O','G'],
                ]
            word = {"word":"dog"}
            res = client.post('/check-word', json=word)
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json, 'ok')
            word = {"word":"bird"}
            res = client.post('/check-word', json=word)
            self.assertEqual(res.json, 'not-on-board')
            word = {"word":"yyy"}
            res = client.post('/check-word', json=word)
            self.assertEqual(res.json, 'not-word')

    def test_set_games_played(self):
        with app.test_client() as client:
            data = {"score":25,"topScore":5}
            res = client.post('/games-played', json=data)
            self.assertEqual(res.status_code, 302)
            self.assertEqual(res.location, 'http://localhost/game')