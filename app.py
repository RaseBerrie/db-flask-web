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

def data_fining(data):
    result = []
    for line in data:
        tmp = []
        if line[0] == "G": tmp.append("Google")
        else: tmp.append("Bing")

        if ":" in line[1]:
            str = line[1].split(':')[0]
            tmp.append(str)
        else: tmp.append(line[1])

        for i in range(2, 5): tmp.append(line[i])
        result.append(tmp)
    return result

@app.route('/')
def main():
    return render_template('content.html')

@app.route('/index', methods=['GET'])
def index():
    page = int(request.args.get('page', 1))
    per_page = 20
    offset = (page - 1) * per_page
    
    query = f"SELECT COUNT(*) FROM searchresult"
    count = query_database(query)

    query = f"SELECT COUNT(*) FROM searchresult WHERE url LIKE '%login%'"
    count += query_database(query)

    query = f"SELECT COUNT(*) FROM searchresult WHERE url LIKE '%admin%'"
    count += query_database(query)
    
    query = f"SELECT * FROM searchresult LIMIT %s OFFSET %s"
    data = query_database(query, (per_page, offset))
    data_list = data_fining(data)

    return jsonify(count=count, data_list=data_list)

@app.route('/search', methods=['GET'])
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
        data = query_database(query, (f'%{key}%', per_page, offset))

        data_list = data_fining(data)
    else:
        count = [(0,)]
        data_list = []

    return jsonify(count=count, data_list=data_list)

@app.route('/list')
def list():
    query = f"SELECT * FROM searchkeys"
    data = query_database(query=query)

    return render_template('list.html', data=data)

@app.route('/parses')
def parses():

    return render_template('parses.html')

if __name__ == '__main__':
    app.run('0.0.0.0')
    # app.run(debug=True)