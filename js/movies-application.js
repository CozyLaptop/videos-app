"use strict";
fetch('https://obtainable-scrawny-cactus.glitch.me/movies').then( response => {
    response.json().then( movies => {

        // users.forEach( userObj  => {
            // do something with the username login
            console.log(movies);
        // });
    });
});