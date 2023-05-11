const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('blank')
    }
    const hash = bcrypt.hashSync(password);
    db
        .from('login')
        .insert({
            email: email,
            hash: hash
        })
        .then(
            db.from('users')
                .insert({
                    name: name,
                    email: email,
                    joined: new Date()
                })
                .select()
                .then(user => res.json(user.data[0]))
                .catch(err => res.status(400).json('duplicate'))
        )
        .catch(err => res.status(400).json('Failed registeration.'));
    //old way of tacking db
    /*
    db.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
            .into('login')
            .then(
                trx.insert({
                    name: name,
                    email: email,
                    joined: new Date()
                })
                    .into('users')
                    .returning('*')
                    .then(user => res.json(user[0]))
                    .catch(err => res.status(400).json('duplicate'))
            )
            .then(trx.commit)
            .catch(err => trx.rollback);
    })
        .catch(err => res.status(400).json('Failed registeration.'));
    */
}

module.exports = { handleRegister: handleRegister };