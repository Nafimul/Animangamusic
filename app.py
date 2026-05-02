import io
import secrets

from flask import Flask, g, json, jsonify, request, redirect, render_template, abort, send_file
import requests
from gemini import promptFromImagePath, promptFromImageBytes


app = Flask(__name__)
# app.secret_key = secrets.token_hex(16)  # This is necessary for flash!
# app.config.from_file(f"{env}.json", load=json.load)
# app.config.from_prefixed_env()

@app.route("/")
def root():
    return render_template("read.html")

@app.route("/test", methods=["POST"])
def test():
    return ["hi"], {"Content-Type" : "text/json"}

@app.route("/api/img-data", methods=["POST"])
def get_gemini_data():
    if 'image' not in request.files:
        return "No image part", 400
    
    img = request.files['image']
    img_bytes = img.read()

    PROMPT = """
            The following image is either a panel from a comic book or a full page of a comic book.
            return json in the following format:
            {
            "music_gen_prompt" : prompt
            "mood" : (choose from the following: battle, blues, calm, celebratory, eeire, epic, happy, hearwarming, horror, jazz, romantic, sad, shock, western)
            "sound_effect : (choose from the following: blast, heavy_impact, light_impact, tension_stinger, whoosh)
            "slow_panel_effect" : (pan_right, pan_left, pan_up, pan_down, zoom_in, zoom_out, none)
            "probability_that_mood_changed_since_last_page" : (an int from 1 to 10 used to determine if the music should change on this page as opposed to last page)
            }
            These correspond to sounds and effects that will be played while the page or panel is displayed on a website
            Select whatever values fit the best for the given image
            return JSON ONLY.
            Don't say anything like: sure! i'll do that for you!
            Your entire response should only be JSON
            """
    result = promptFromImageBytes(img_bytes, PROMPT)
    print(result)
    return jsonify(result)

    