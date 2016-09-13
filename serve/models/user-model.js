const Model = require('../libraries/model');
const UserSchema = require('../schemas/user-schema');


// Business Model layer, in this instance you can manage your business logic. For example,
// if you want to create a pet before creating a person, because you'll end up adding that
// pet to the person, this is the place.

// In libraries/model you have the basic support for RESTful methods. Because this class
// is extending from there, you got that solved.
// You can overwrite extended methods or create custom ones here. Also you can support
// more mongoose functionality like skip, sort etc.

class UserModel extends Model {


    checkLogin(account, password, cb) {
        UserSchema.findOne({ account: account }, function(err, user) {

            if (err) {
                cb(err, null);
                return;
            }
            if (user) {
                user.comparePassword(password, function(err, isMatch) {
                    if (err) {
                        cb(err, null);
                        return;
                    }
                    if (isMatch) {
                        cb(null, user);
                        return;
                    } else {
                        cb(null, null);
                    }

                });
            } else {
                cb(null, null);
            }


        });
    }
}

module.exports = new UserModel(UserSchema);
