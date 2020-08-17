const Clarifai = require('clarifai');
const app = new Clarifai.App({
    apiKey: '83604008beb74133935f6a7643e73fdd'
});


const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Failed API'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    if (id > 0) {
        db.increment('entries', 1).from('users').where('id', id)
            .returning('entries')
            .then(entries => res.json(entries))
            .catch(err => res.status(400).json('ERROR'));
    }
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}