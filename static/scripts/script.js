"use strict";

document.addEventListener("DOMContentLoaded", function() {
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");
    const file_upload = document.getElementById("upload");
    const comicPage = document.getElementById("comic_page");
    const background = document.getElementById("background");
    const audio_source = document.getElementById("audio")
    const loadingMessage = document.getElementById("loading")
    loadingMessage.hidden = true;

    let testing = true;
    let music = new Audio();
    let sfx = new Audio();
    let page_files = [];
    let page_urls = [];
    let effect_selections = []
    let page_num = 0;
    let currAudioName;

    let DEFAULT_EFFECT_SELECTIONS = new Array(16);
    DEFAULT_EFFECT_SELECTIONS[0] = {
    "music_gen_prompt" : "A sudden, dramatic orchestral stinger followed by a somber, tense theme. Low, brooding strings and high-pitched, uneasy violin notes to convey shock and despair at seeing friends severely wounded.",
    "mood" : "shock",
    "sound_effect" : "tension_stinger",
    "slow_panel_effect" : "zoom_in",
    "probability_that_mood_changed_since_last_page" : 8
    }
        DEFAULT_EFFECT_SELECTIONS[5] = {
    "music_gen_prompt" : "Dark, ominous orchestral music with low-pitched brass and tense, screeching violins to signify a terrifying reveal.",
    "mood" : "shock",
    "sound_effect" : "tension_stinger",
    "slow_panel_effect" : "zoom_in",
    "probability_that_mood_changed_since_last_page" : 9
    }
        DEFAULT_EFFECT_SELECTIONS[10] = {
    "music_gen_prompt": "Intense and frantic orchestral strings, sudden sharp brass hits, building a sense of desperate horror and high-stakes tension.",
    "mood": "shock",
    "sound_effect": "tension_stinger",
    "slow_panel_effect": "zoom_in",
    "probability_that_mood_changed_since_last_page": 9
    }
    DEFAULT_EFFECT_SELECTIONS[15] = {
    "music_gen_prompt" : "Epic and powerful orchestral theme with dramatic choir and intense percussion, building a sense of awe and overwhelming power for a legendary transformation.",
    "mood" : "epic",
    "sound_effect" : "tension_stinger",
    "slow_panel_effect" : "zoom_in",
    "probability_that_mood_changed_since_last_page" : 9
    }
    effect_selections = DEFAULT_EFFECT_SELECTIONS;

    async function uploadFiles(e) {
        loadingMessage.hidden = false;

        page_files = file_upload.files;
        page_urls = new Array(page_files.length)
        for (let i = 0; i < page_urls.length; i++)
        {
            let url = window.URL.createObjectURL(page_files[i]);
            page_urls[i] = url
        }

        if (!testing) {
            effect_selections = new Array(page_files.length)
            for (let i = 0; i < page_urls.length; i++)
            {
                if (i % 3 == 0 || i == 0) {
                    effect_selections[i] = await getGeminiEffectSelection(page_files[i]);
                }
                if (i == 0) {
                    console.log(typeof(effect_selections[i]));
                    playMusic()
                }
            }
        }
        else {
            playMusic()
        }

        displayCurrPage();
        loadingMessage.hidden = true;
    }

    function nextPage() {
        page_num++;
        displayCurrPage();
    }

    function prevPage() {
        page_num--;
        displayCurrPage();
    }

    async function callApiGetJson(url, params) {
        try {
            const response = await fetch(url, params);
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }

    async function displayCurrPage() {
        if (page_files && page_urls[page_num]) {
            comicPage.src = page_urls[page_num];
            background.src = comicPage.src;
            if (effect_selections[page_num]) {
                playMusic()
                playSfx()
            }
        }
    }

    function removeNonJsonParts(old) {
        if (old[0] != "{") {
            console.log("fixing")
            console.log(old)
            let fixed = old.slice(7, old.length-4);
            console.log(fixed);
            return fixed;
        } else {
            return old
        }
    }

    
    async function getGeminiEffectSelection(page_file) {
        const formData = new FormData();
        formData.append('image', page_file);

        const result = await callApiGetJson('http://127.0.0.1:5000/api/img-data', {
            method: 'POST',
            body: formData
        });

        console.log(result)
        return JSON.parse(removeNonJsonParts(result));
    }

    function playMusic() {
        if (currAudioName) {
            if (currAudioName == effect_selections[page_num]["mood"])
                return
        }
        currAudioName = effect_selections[page_num]["mood"]
        let url = "static/random_music/" + currAudioName + ".mp3";
        music.pause();
        music = new Audio(url);
        music.volume = 0.4;
        music.play();
    }

    function playSfx() {
        let sfx_name = effect_selections[page_num]["sound_effect"];
        sfx.pause();
        sfx = new Audio("static/random_sfx/" + sfx_name +".mp3");
        sfx.play();
    }

    nextButton.addEventListener("click", nextPage);
    file_upload.addEventListener("change", uploadFiles);
    prevButton.addEventListener("click", prevPage);

    document.addEventListener("keydown", e => {
    switch (event.key) {
        case "ArrowRight":
            nextPage();
        break;
        case "ArrowLeft":
            prevPage();
        break;
    }});

    
})
