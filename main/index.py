from main import *
from main.functions.dbconnect import query_database

from flask import Blueprint, render_template
index = Blueprint('index', __name__, template_folder='templates/contents')

@index.route('/')
@index.route('/dashboard')
def board():
    return render_template('dashboard.html')

@index.route('/subdomain')
def subdomain():
    return render_template('subdomain.html')

@index.route('/<sidemenu>')
def contents(sidemenu):
    if sidemenu != "fileparses":
        return render_template('def_content.html')
    else:
        return render_template('file_content.html')