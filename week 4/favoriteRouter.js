const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Favorite = require('../models/favorite');
const Dish = require('../models/dishes');
const verify = require('./verify');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

.all(verify.verifyOrdinaryUser)

.get((req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
        
})

.post(function (req, res, next) {
    Favorite.find({user: req.user._id})
    .then(favorite => {
        if(favorite!=null || favorite!={}){
            // favorite document exist
            if(req.body.length){
                // body contains the data
                req.body.forEach(favDish => {
                    if(favorite.dishes.indexOf(favDish._id) == -1){
                        favorite.dishes.push(favDish._id);
                    }
                })
                favorite.save();
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
            }
            else {
                // no body is sent
                err = new Error('No dishes were sent in the body');
                err.status = '404';
                return next(err);
            }
        }
        else{
             // constructing favorite document
             Favorite.create({user: req.body.user._id})
             .then(favorite => {
                if(req.body.length){
                    req.body.forEach(favDish => {
                        favorite.dishes.push(favDish._id);
                    })
                    favorite.save();
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }, (err) => next(err));
                 }
                else{
                   // no body is sent
                    err = new Error('No dishes were sent in the body');
                    err.status = '404';
                    return next(err); 
                }
             })
        }
    })
    .catch((err) => next(err));
})

.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /favorites');
})

.delete(function (req, res, next) {
    Favorite.remove({'user': req.body.user})
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
        }, (err) => next(err)
    )
    .catch(err => next(err));
});

favoriteRouter.route('/:dishId')
.all(verify.verifyOrdinaryUser)

.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
        .then((favorites) => {
            if (favorites !== null) {
                //Check whether this dish is not already in the list of favorites
                if (favorites.dishes.indexOf(req.params.dishId) == -1){
                    favorites.dishes.push(req.params.dishId);
                    favorites.save()
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite)
                    }, (err) => next(err))
                }else{
                    console.log("Dish with id: " + req.params.dishId +" already in the list of favorites!");
                    err = new Error("Dish with id: " + req.params.dishId +" already in the list of favorites!");
                    err.status = 400;
                    next(err);
                };
                
                //Current user doesn't have favorites document
            } else {
                console.log("Favorite document for user with id:" + req.user._id + " not found\n Creating favorites document");
                let dishes = []

                dishes.push(req.params.dishId);

                Favorites.create({
                    "user": req.user._id,
                    "dishes": dishes
                })
                    .then((favorite) => {
                        console.log("Favorite created ", favorite);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }, (err) => next(err))
                    .catch((err) => next(err))
            }
        })
        .catch((err) => next(err));
})

.delete((req, res, next) => {
    Favorite.find(user: req.user._id)
    .then(favorite => {
        if(favorite!=null || favorite=={}){
            let found = false;
            favorite.dishes.forEach(favDish => {
                if(favDish._id == req.params.dishId){
                    found = true;
                    break;
                }
                if(found){
                    favorite.dishes.id(req.params.dishId).remove();
                    favorite.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    },err => next(err));

                }
                else{
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
        }
        else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    })
    .catch((err) => next(err));
});

module.exports = favoriteRouter;