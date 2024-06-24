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
    query = f'SELECT DISTINCT company FROM rootdomain'
    category = query_database(query)

    return render_template('layout.html', categories=category)

@app.route('/subcat/<string:parent_id>')
def sub_cat(parent_id):
    query = '''
        SELECT sd.id, sd.sub_url FROM subdomain sd
        JOIN conn_root_sub crs ON sd.id = crs.sub_id
        JOIN rootdomain rd ON rd.id = crs.root_id
        WHERE rd.company = %s;
    '''
    data = query_database(query, (parent_id,))
    return jsonify(data)

@app.route('/content')
def content():
    return render_template('content.html')

@app.route('/index', methods=['GET'])
def index():
    page = int(request.args.get('page', 1))
    per_page = 30
    offset = (page - 1) * per_page
    
    query = f"SELECT COUNT(*) FROM searchresult"
    count = query_database(query)
    
    query = f"SELECT se, subdomain, title, url, content FROM searchresult"
    data_full = query_database(query)
    data_full_list = data_fining(data_full)

    query = f"SELECT se, subdomain, title, url, content FROM searchresult LIMIT %s OFFSET %s"
    data = query_database(query, (per_page, offset))
    data_list = data_fining(data)

    return jsonify(count=count, data_list=data_list, data_full_list=data_full_list)

@app.route('/search', methods=['GET'])
def search():
    menu = request.args.get('menu', '')
    key = request.args.get('key', '')
    page = int(request.args.get('page', 1))
    per_page = 30
    offset = (page - 1) * per_page
    
    if menu and key:
        query = f"SELECT COUNT(*) FROM searchresult WHERE {menu} LIKE %s"
        count = query_database(query, (f'%{key}%',))

        query = f"SELECT se, subdomain, title, url, content FROM searchresult WHERE {menu} LIKE %s"
        data_full = query_database(query, (f'%{key}%',))
        data_full_list = data_fining(data_full)

        query = f"SELECT se, subdomain, title, url, content FROM searchresult WHERE {menu} LIKE %s LIMIT %s OFFSET %s"
        data = query_database(query, (f'%{key}%', per_page, offset))
        data_list = data_fining(data)
    else:
        count = [(0,)]
        data_list = []

    return jsonify(count=count, data_list=data_list, data_full_list=data_full_list)

@app.route('/subdomain')
def subdomain():
    return render_template('subdomain.html')

@app.route('/logins')
def logins():
    return render_template('logins.html')

@app.route('/admins')
def admins():
    return render_template('admins.html')

@app.route('/files')
def files():
    return render_template('files.html')

@app.route('/gits')
def gits():
    return render_template('gits.html')

@app.route('/jss')
def jss():
    return render_template('jss.html')

@app.route('/showns')
def showns():
    return render_template('showns.html')

if __name__ == '__main__':
    # app.run('0.0.0.0')
    app.run(debug=True)