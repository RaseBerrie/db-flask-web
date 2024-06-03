from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

# MySQL 연결 설정
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="searchdb"
    )

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
def index():
    db_connection = get_db_connection()
    cur = db_connection.cursor()

    cur.execute("SELECT * FROM searchresult")
    data = cur.fetchall()
    data_list = data_fining(data)

    cur.execute("SELECT count(*) FROM searchresult")
    count = cur.fetchall()

    cur.close()
    db_connection.close()

    return render_template('content.html', data=data_list, count=count)

@app.route('/list')
def search_list():
    return render_template('list.html')

@app.route('/parses')
def parsed_data():
    return render_template('parses.html')

@app.route('/search/')
def search_result():
    menu = request.args.get('menu', '')
    key = request.args.get('key', '')

    if menu not in ['subdomain', 'title', 'url', 'content']:
        return "Invalid search field", 400

    db_connection = get_db_connection()
    cur = db_connection.cursor()

    query = f"SELECT * FROM searchresult WHERE {menu} LIKE %s"
    cur.execute(query, ('%' + key + '%',))
    data = cur.fetchall()
    data_list = data_fining(data)

    query = f"SELECT count(*) FROM searchresult WHERE {menu} LIKE %s"
    cur.execute(query, ('%' + key + '%',))
    count = cur.fetchall()

    result = {
        "data_list": data_list,
        "count": count
    }
    return jsonify(result)

######## APP.RUN ########

if __name__ == '__main__':
    # app.run(host='0.0.0.0')
    app.run(debug=True)