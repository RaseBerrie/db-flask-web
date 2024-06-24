import mysql.connector

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