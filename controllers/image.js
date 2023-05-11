const Clarifai = require('clarifai');
const app = new Clarifai.App({
    apiKey: process.env.API_CLARIFAI //Insert your own personal CLARIFAI API KEY here 
});


const handleApiCall = (req, res) => {
    () => {
        console.log("testing");
    }
    app.models.predict('face-detection', req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Failed API'));
}

const handleImage = (req, res, db) => {
    const { id, boxesNum } = req.body;
    if (id > 0 && boxesNum > 0) {
        db.from('users')
            .select('entries')
            .eq('id', id)
            .then(oldData => {
                const newEntries = oldData.data[0].entries + boxesNum;
                db.from('users')
                    .update({ entries: newEntries })
                    .eq('id', id)
                    .then(_ => {
                        db.from('users')
                            .select()
                            .eq('id', id)
                            .then(data => { res.json(data.data[0].entries) })
                    })

            })
        //old way of tacking db
        /*
        db.increment('entries', boxesNum).from('users').where('id', id)
            .returning('entries')
            .then(entries => res.json(entries))
            .catch(err => res.status(400).json('ERROR'));
        */
    }
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}