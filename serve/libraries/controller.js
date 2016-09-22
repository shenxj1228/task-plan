class Controller {

    constructor(model) {
        this.model = model;
    }

    find(req, res, next) {

        if (req.query.sort != undefined && req.query.limit != undefined && req.query.offset != undefined) {

            const pagination = { 'limit': req.query.limit, 'offset': req.query.offset, 'sort': req.query.sort };
            this.model.getCount(req.query.filter).then(count => {
                return this.model.findPerPage(req.query.filter, pagination).then(collection =>{ res.status(200).json({count:count,docs:collection})})
                    .catch(err => next(err));
            });
        } else {
            //console.dir(req.query);
            return this.model.find(req.query.filter)
                .then(collection => res.status(200).json(collection))
                .catch(err => next(err));
        }
    }

    findOne(req, res, next) {
        return this.model.findOne(req.query.filter)
            .then(doc => res.status(200).json(doc))
            .catch(err => next(err));
    }

    findById(req, res, next) {
        return this.model.findById(req.params.id)
            .then(doc => {
                if (!doc) {
                    return res.status(404).end();
                }
                return res.status(200).json(doc);
            })
            .catch(err => next(err));
    }

    create(req, res, next) {

        this.model.create(req.body)
            .then(doc => res.status(201).json(doc))
            .catch(err => next(err));
    }

    update(req, res, next) {
        this.model.update(req.params.id, req.body)
            .then(doc => {
                if (!doc) {
                    return res.status(404).end();
                }
                return res.status(200).json(doc);
            })
            .catch(err => next(err));
    }

    remove(req, res, next) {
        this.model.remove(req.params.id)
            .then(doc => {
                if (!doc) {
                    return res.status(404).end();
                }
                return res.status(204).end();
            })
            .catch(err => next(err));
    }

}

module.exports = Controller;
