"use strict";
fetch('https://obtainable-scrawny-cactus.glitch.me/movies').then( response => {
    response.json().then( movies => {

         var html = "";
        movies.forEach( movie  => {
            html+= movie.title
        });
        $(".loading").html(html)
            // do something with the username login
            // console.log(movies);
        // });
    });
});