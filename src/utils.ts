import debug from 'debug'


export const log = {
    init: debug('@pq:finder:init'),
    validate: debug('@pq:finder:validate'),
    getFiles: debug('@pq:finder:getFiles'),
    type: debug('@pq:finder:type'),
    dates: debug('@pq:finder:dates'),
    filter: debug('@pq:finder:filter'),
    sort: debug('@pq:finder:sort'),
}

// XTODO Finder is using ".gitignore" as a type - it should ignore the period if found at the beginning of the string

export const colors = {
    reset:"\x1b[0m",
    bright:"\x1b[1m",
    // dim:"\x1b[2m",
    // underscore:"\x1b[4m",

    // red:"\x1b[31m",
    // green:"\x1b[32m",
    yellow:"\x1b[33m",
    // blue:"\x1b[34m",
    // magenta:"\x1b[35m",
    // cyan:"\x1b[36m",
    // white:"\x1b[37m",
    // grey:"\x1b[2m",

    // RED:"\x1b[31m\x1b[1m",
    // GREEN:"\x1b[32m\x1b[1m",
    // YELLOW:"\x1b[33m\x1b[1m",
    // BLUE:"\x1b[34m\x1b[1m",
    // MAGENTA:"\x1b[35m\x1b[1m",
    // CYAN:"\x1b[36m\x1b[1m",
    // WHITE:"\x1b[37m\x1b[1m",
    // GREY:"\x1b[2m\x1b[1m",
}
