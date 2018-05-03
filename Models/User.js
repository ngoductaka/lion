const Users = require('./connect').Users

async function get (id=null) {
    const query = id?{"id":id}:null
    try{
        return await Users.find(query);
    }
    catch(err){
        console.log(err)
    }
};

async function login (data) {
    // const query = id?{"id":id}:null
    try{
        return await Users.find({
            "email": data.email,
            "password": data.password
        });
    }
    catch(err){
        console.log(err)
    }
    
};

async function update (data, userID) {
    try{
        const { email, username, password, image, bio, token } = data;
        const up = { email, username, password, image, bio, token } 
        return await Users.where( {id: userID}).update({ $set: up}) 
    }
    catch(err){
        console.log(err)
    }
}; 

async function save ( {email,token,username,image,password,bio} ) {
    try{
        const getall =  await get();
        const {length} = getall
        let id = getall[length-1]["id"]+1;
        let token_face = token ? token : id;
        const newUser = new Users({
            "id": id,
            "email": email,
            "token": token_face,
            "username": username,
            "image": image,
            "password": password,
            "bio": bio
        });
        return await newUser.save();
    } catch (err) {
        return {"errors":{
            "body": [  err.errmsg ]
            }
        }
    }
};

module.exports = { get, save,login,update }