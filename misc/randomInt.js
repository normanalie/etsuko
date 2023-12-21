// return a random number between [min ; max]
const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

exports.randomInt = randomInt
