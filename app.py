from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

def query_database(query, args=(), one=False):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="searchdb"
    )
    cur = conn.cursor()
    cur.execute(query, args)
    r = cur.fetchall()
    cur.close()
    conn.close()
    return (r[0] if r else None) if one else r

@app.route('/')
def index():
    count = query_database('SELECT COUNT(*) FROM searchresult')
    data = query_database('SELECT * FROM searchresult LIMIT 20')
    return render_template('content.html', count=count, data=data)

@app.route('/search/', methods=['GET'])
def search():
    menu = request.args.get('menu', '')
    key = request.args.get('key', '')
    page = int(request.args.get('page', 1))
    per_page = 20
    offset = (page - 1) * per_page
    
    if menu and key:
        query = f"SELECT COUNT(*) FROM searchresult WHERE {menu} LIKE %s"
        count = query_database(query, (f'%{key}%',))
        
        query = f"SELECT * FROM searchresult WHERE {menu} LIKE %s LIMIT %s OFFSET %s"
        data_list = query_database(query, (f'%{key}%', per_page, offset))
    else:
        count = [(0,)]
        data_list = []

    return jsonify(count=count, data_list=data_list)

if __name__ == '__main__':
    app.run(debug=True)