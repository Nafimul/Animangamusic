"use strict";

document.addEventListener("DOMContentLoaded", function() {
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");
    const file_upload = document.getElementById("upload");
    const comicPage = document.getElementById("comic_page");
    const audio_source = document.getElementById("audio")
   
    let audio = new Audio();
    let page_urls = [];
    let page_num = 0;
    let DEFAULT_PAGE_URLS = ["static/comics/DBZ_CH124/003.jpg", "static/comics/DBZ_CH124/004.jpg", "static/comics/DBZ_CH124/005.jpg", "static/comics/DBZ_CH124/006.jpg"]
    page_urls = DEFAULT_PAGE_URLS;

    comicPage.src = "static/comics/DBZ_CH124/003.jpg";


    file_upload.addEventListener("change", () => {
        let files = file_upload.files;
        page_urls = new Array(files.length)
        for (let i = 0; i < page_urls.length; i++)
        {
            let url = window.URL.createObjectURL(files[i]);
            page_urls[i] = url
        }
    });

    function nextPage() {
        page_num++;
        playMusic("static/random_music/blues.mp3")
        displayCurrPage()
    }

    function prevPage() {
        playMusic("static/random_music/battle.mp3")
        page_num--;
        displayCurrPage()
    }

    function displayCurrPage() {
        console.log(page_num)
        console.log(page_urls[page_num])
        comicPage.src = page_urls[page_num]
    }

    function playMusic(url) {
        audio.pause();
        audio = new Audio(url);
        audio.play();
    }

    nextButton.addEventListener("click", nextPage)
    prevButton.addEventListener("click", prevPage)
})
