var jwt = require('jsonwebtoken');
const User = require('../Models/User'); 

module.exports = function(req, res, next) { 
    if( req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization') ) {
        User.get()
        .then(data=>{
            // console.log(  jwt.sign({  id: 1,  }, "dnd", { expiresIn: 600*600 }) )
            // console.log(req.headers.authorization )//dnd
            let xxx = req.headers['authorization'].split(' ');
            // let dd = jwt.verify(xxx[1], "dnd")
            // console.log("dd",dd);
            let hasdata = false;    
            data.forEach(e => {
                if(xxx[1]===e.token){
                    hasdata = true;
                    req.userId = e.id;
                    next();
                }
            });
            if(!hasdata) {
                res.status(401).json({
                    error: {
                        msg: 'Failed to authenticate token!'
                    }
                });
            }
        })
        .catch(err => { 
            return res.status(401).json({
                error: {
                    msg: 'Failed to get data'
                }
            });
        })
        // console.log(req.user)
    } else {
        /*
         * If there is no autorization header, return 401 status code with JSON
         * error message
         */
        return res.status(401).json({
            error: {
                msg: 'No token!'
            }
        });
    }
}