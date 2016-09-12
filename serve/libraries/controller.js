class Controller {

    constructor(model) {
        this.model = model;
    }

    find(req, res, next) {
        if (req.headers['X-limit'] && req.headers['X-offset'] && req.headers['X-sortType']) {
          const pagination={'limit':req.headers['limit'],'offset':req.headers['X-offset'],'sort':req.headers['X-sortType']};
          const count=this.model.count(req.query);
          return this.model.findPerPage(req.query,pagination).then(collection=>res.set('X-count',count).status(200).json(collection))
          .catch(err => next(err));
        } else {
            return this.model.find(req.query)
                .then(collection => res.status(200).json(collection))
                .catch(err => next(err));
        }
    }

    findOne(req, res, next) {
        return this.model.findOne(req.query)
            .then(doc => res.status(200).json(doc))
            .catch(err => next(err));
    }

    findById(req, res, next) {
        return this.model.findById(req.params.id)
            .then(doc => {
                if (!doc) {
                    return res.status(404).end(); }
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
                    return res.status(404).end(); }
                return res.status(200).json(doc);
            })
            .catch(err => next(err));
    }

    remove(req, res, next) {
        this.model.remove(req.params.id)
            .then(doc => {
                if (!doc) {
                    return res.status(404).end(); }
                return res.status(204).end();
            })
            .catch(err => next(err));
    }

}

module.exports = Controller;
