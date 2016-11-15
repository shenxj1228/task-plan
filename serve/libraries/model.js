class Model {

    constructor(SchemaModel) {
        this.SchemaModel = SchemaModel;
    }

    create(input) {
        const newSchemaModel = new this.SchemaModel(input);
        return newSchemaModel.saveAsync();
    }

    update(id, updatedModel) {
        return this.SchemaModel
            .findByIdAndUpdate(id, updatedModel, { new: true })
            .execAsync();
    }

    find(query) {
        return this.SchemaModel
            .find(query,{password:0})
            .execAsync();
    }

    findOne(query, populate) {
        return this.SchemaModel
            .findOne(query,{password:0})
            .populate(populate || '')
            .execAsync();
    }

    findById(id, populate) {
        return this.SchemaModel
            .findById(id,{password:0})
            .populate(populate || '')
            .execAsync();
    }
    getCount(query) {
     return this.SchemaModel
            .find(query)
            .count()
            .execAsync();
    }
    findPerPage(query, pagination) {
        return this.SchemaModel
        .find(query,{password:0})
        .skip(pagination.offset)
        .limit(pagination.limit)
        .sort(pagination.sort)
        .execAsync();
    }
    remove(id) {
        return this.SchemaModel
            .findByIdAndRemove(id)
            .execAsync();
    }
    removeMultiple(query) {
        console.dir(query);
        return this.SchemaModel
            .find(query)
            .remove()
            .execAsync();
    }
}

module.exports = Model;
