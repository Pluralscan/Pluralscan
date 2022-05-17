from flask import Flask

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    return app