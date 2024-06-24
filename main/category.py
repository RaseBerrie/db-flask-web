from main import *
from main.functions.dbconnect import query_database

from flask import Blueprint, render_template
category = Blueprint('category', __name__, template_folder='templates/category')

@category.route('/first_level')
def first_level():
    query = f"SELECT * FROM company"
    categories = query_database(query)
    return render_template('first_level.html', categories=categories)

@category.route('/second_level/<int:category_id>')
def second_level(category_id):
    query = '''
        SELECT rd.id, rd.root_url
        FROM conn_comp_root cr
        JOIN rootdomain rd ON cr.root_id = rd.id
        WHERE cr.comp_id = {0};
    '''.format(category_id)
    categories = query_database(query)
    return render_template('second_level.html', categories=categories)

@category.route('/third_level/<int:category_id>')
def third_level(category_id):
    query = '''
        SELECT sd.id, sd.sub_url
        FROM conn_root_sub cs
        JOIN subdomain sd ON cs.sub_id = sd.id
        WHERE cs.root_id = {0};
    '''.format(category_id)
    categories = query_database(query)
    return render_template('third_level.html', categories=categories)