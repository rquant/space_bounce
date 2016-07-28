//load and prepare the audio assets
spacebounce.audio = (function() {

    function init() {

            var audioPath = "audio/";
            var manifest = [
                {id: "Absorb", src: "absorb.wav"},
                {id: "Bounce", src: "fins_energy.wav"}
            ];

            createjs.Sound.alternateExtensions = ["wav", "mp3", "ogg"];
            createjs.Sound.registerManifest(manifest, audioPath);
    }

    return {
        init: init
    }
})();
