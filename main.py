from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from pymongo import MongoClient
import json
from flask import jsonify
from bson import ObjectId
import random

app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.template_folder = 'templates'
app.static_folder = 'static'

username = 'HealthAppUser'
password = 'admin'
cluster_name = 'healthappdb'
database_name = 'TASK'
connection_string_mongodb = f"mongodb+srv://{username}:{password}@{cluster_name}.tir6wnc.mongodb.net/{database_name}?retryWrites=true&w=majority"

# Połączenie z MongoDB
client = MongoClient(connection_string_mongodb)
db = client[database_name]
users_collection = db["USERS"]
questions_collection = db["QUESTIONS"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/index.html')
def main():
    return render_template('index.html')

@app.route('/register.html', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        existing_user = users_collection.find_one({'username': username})
        password1 = request.form['password1']
        password2 = request.form['password2']

        if username and password1 and password2:
            if not existing_user:
                if password1 == password2:
                    new_user = {
                        'username': username,
                        'password': password1,
                        'points': 0
                    }
                    users_collection.insert_one(new_user)
                    return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/check_username', methods=['POST'])
def check_username():
    username = request.json.get('username')
    existing_user = users_collection.find_one({'username': username})
    if existing_user:
        return json.dumps({'exists': True})
    else:
        return json.dumps({'exists': False})

@app.route('/check_login', methods=['POST'])
def check_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'username': username})
    if user and user['password'] == password:
        session['username'] = username
        return json.dumps({'exists': True, 'validPassword': True})
    elif user:
        return json.dumps({'exists': True, 'validPassword': False})
    else:
        return json.dumps({'exists': False, 'validPassword': False})

@app.route('/login.html', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = users_collection.find_one({'username': username})
        if user and user['password'] == password:
            session['username'] = username
            return redirect(url_for('quiz'))

    return render_template('login.html')

@app.route('/quiz.html')
def quiz():
    all_users = list(users_collection.find())
    return render_template('quiz.html', users=all_users)



@app.route('/main_page_quiz.html')
def mainPageQuiz():
    return render_template('main_page_quiz.html')


@app.route('/get_question', methods=['GET'])
def get_question():
    questions = list(questions_collection.find())
    if questions:
        question = random.choice(questions)
        question['_id'] = str(question['_id'])
        return jsonify(question)
    return jsonify({'error': 'No questions found'})

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    user_answer = data.get('answer')
    question_id = data.get('question_id')
    username = session.get('username')
    all_users = list(users_collection.find())

    if not username:
        return jsonify({'error': 'User not logged in'})

    question = questions_collection.find_one({'_id': ObjectId(question_id)})
    if question and question['answer'] == user_answer:
        users_collection.update_one({'username': username}, {'$inc': {'points': 1}})
        return jsonify({'correct': True})
    else:
        return jsonify({'correct': False})
    return render_template('main_page_quiz.html')


if __name__ == "__main__":
    app.run(debug=True)
