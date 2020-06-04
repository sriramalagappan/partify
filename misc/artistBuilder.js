/**
 * Build a string of all the artists in the array provided
 * @param {*} artistData Array of objets containing artist(s) info
 */
const artistBuilder = (artistData) => {
    let artists;
    let i;
    for (i = 0; i < artistData.length; i++) {
        if (i === 0) {
            artists = artistData[i].name
        } else {
            artists += ', ' + artistData[i].name
        }
    }
    return artists
}

export default artistBuilder
