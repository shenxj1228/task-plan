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
            .find(query)
            .execAsync();
    }

    findOne(query, populate) {
        return this.SchemaModel
            .findOne(query)
            .populate(populate || '')
            .execAsync();
    }

    findById(id, populate) {
        return this.SchemaModel
            .findById(id)
            .populate(populate || '')
            .execAsync();
    }
    count(query){
        return this.SchemaModel
            .count(query)
            .execAsync();
    }
    findPerPage(query,pagination){
        return this.SchemaModel
            .find(query)
            .sort(pagination.sort)
            .skip(pagination.limit*pagination.offset)
            .limit(pagination.limit)
            .execAsync();
    }
    remove(id) {
        return this.SchemaModel
            .findByIdAndRemove(id)
            .execAsync();
    }
}

module.exports = Model;
