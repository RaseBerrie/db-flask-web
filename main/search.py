from main import *
from main.functions.dbconnect import query_database

from flask import Blueprint, render_template
search = Blueprint('search', __name__, template_folder='templates/contents')

@search.route('/')
def main():
    # 서브메뉴 접속 후 첫 페이지 로드

    return 0


@search.route('/result')
def result():
    # 검색 후 페이지 로드

    return 0