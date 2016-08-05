// get a random number between min and max
spacebounce.utils = spacebounce.utils || {};

spacebounce.utils.getRandomArbitrary = function(min, max) {
    return Math.random()*(max-min)+min;
}
