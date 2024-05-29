from flask import Flask, render_template, redirect, url_for
import mysql.connector

app = Flask(__name__)

'''
set FLASK_APP=app.py
flask run
'''

# MySQL 연결 설정
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="searchdb"
    )

@app.route('/')
def index():
    db_connection = get_db_connection()
    cur = db_connection.cursor()

    cur.execute("SELECT * FROM searchresult")
    data = cur.fetchall()

    cur.execute("SELECT tag FROM searchtags")
    tag = cur.fetchall()

    cur.close()
    db_connection.close()

    return render_template('index.html', data=data, tag=tag)


@app.route('/tag/<tagname>')
def tagsearch(tagname):
    db_connection = get_db_connection()
    cur = db_connection.cursor()

    cur.execute(r"select * from searchresult where url like '%{0}%'".format(tagname))
    data = cur.fetchall()

    cur.execute("SELECT tag FROM searchtags")
    tag = cur.fetchall()

    return render_template('index.html', data=data, tag=tag)

if __name__ == '__main__':
    app.run(debug=True)