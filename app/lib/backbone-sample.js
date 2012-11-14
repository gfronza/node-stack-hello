var mongoose;
var db;
var WineModel;

exports.init = function(aMongoose, aDB) {
    mongoose = aMongoose;
    db = aDB;

    Wine = mongoose.Schema({
        "country": { type: String }, 
        "description": { type: String }, 
        "grapes": { type: String },
        "name": { type: String }, 
        "picture": { type: String },  
        "region": { type: String }, 
        "year": { type: String }
    });

    Wine.add({ another: "string"});

    WineModel = db.model("Wine", Wine);
}

exports.getWines = function(callback) {
    return WineModel.find(callback);
};

exports.getWine = function(id, callback) {
    return WineModel.findById(id, callback);
}

exports.addWine = function(wine, callback) {
    var wine = new WineModel(wine);
    wine.save(callback);
}

exports.awesome = function() {
    return "awesome";
}