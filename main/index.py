from main import *

from flask import Blueprint, render_template
index = Blueprint('index', __name__, template_folder='templates/contents')

@index.route('/')
@index.route('/dashboard')
def board():
    return render_template('dashboard.html')

@index.route('/content')
def contents():
    return render_template('content.html')