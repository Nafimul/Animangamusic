import secrets

from flask import Flask, g, json, request, redirect, render_template, abort
from gemini import promptFromImage


app = Flask(__name__)
# app.secret_key = secrets.token_hex(16)  # This is necessary for flash!
# app.config.from_file(f"{env}.json", load=json.load)
# app.config.from_prefixed_env()

@app.route("/")
def root():
    return render_template("read.html")

    