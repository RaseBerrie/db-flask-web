from flask import Flask

app = Flask(__name__)

from main.search import search
from main.category import category
from main.index import index

index.register_blueprint(search)
app.register_blueprint(category)
app.register_blueprint(index)