"use strict";

document.addEventListener("DOMContentLoaded", function() {
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");
    const file_upload = document.getElementById("upload");
    const comicPage = document.getElementById("comic_page");
    const audio_source = document.getElementById("audio")
   
    let audio = new Audio();
    let page_files;
    let page_urls = [];
    let effect_selections = []
    let page_num = 0;
    let DEFAULT_PAGE_URLS = ["static/comics/DBZ_CH124/003.jpg", "static/comics/DBZ_CH124/004.jpg", "static/comics/DBZ_CH124/005.jpg", "static/comics/DBZ_CH124/006.jpg"]
    page_urls = DEFAULT_PAGE_URLS;

    comicPage.src = "static/comics/DBZ_CH124/003.jpg";


    file_upload.addEventListener("change", () => {
        page_files = file_upload.files;
        page_urls = new Array(page_files.length)
        for (let i = 0; i < page_urls.length; i++)
        {
            let url = window.URL.createObjectURL(page_files[i]);
            page_urls[i] = url
        }
    });

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
        if (page_files) {
            comicPage.src = page_urls[page_num];
            let selection = await getGeminiEffectSelection(page_files[page_num]);
            console.log(selection)
            let music_url = "static/random_music/" + selection["mood"] + ".mp3";
            playMusic(music_url)
        }
    }
    
    async function getGeminiEffectSelection(page_file) {
        return {
            "music_gen_prompt" : "intense, dramatic orchestral music with high tension, sudden tragic climax, dark and cinematic",
            "mood" : "shock",
            "sound_effect" : "explosion",
            "slow_panel_effect" : "zoom_in",
            "probability_that_mood_changed_since_last_page" : 10
        }
        const formData = new FormData();
        formData.append('image', page_file);

        const result = await callApiGetJson('http://127.0.0.1:5000/api/img-data', {
            method: 'POST',
            body: formData
        });

        console.log(result)
    }

    function playMusic(url) {
        audio.pause();
        audio = new Audio(url);
        audio.play();
    }

    nextButton.addEventListener("click", nextPage)
    prevButton.addEventListener("click", prevPage)
})
