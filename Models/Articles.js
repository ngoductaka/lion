const Articles = require('./connect').Articles
const Comments = require('./connect').Comments

const User = require('./User');

async function get({ tag = null, author = null, favorited = null, limit = 20, offset = 0 }, id) {
    if (id) {
        let user = await User.get(id)
        var feed = { "author": user[0]._id }
    }
    // return await user.where('tagList').in([tag]).where('author.username').equals(author).where('favorited').equals(favorited);
    let fe = feed ? feed : {}
    let au = author ? { 'author.username': author } : {}
    let ta = tag ? { 'tagList': { $in: [tag] } } : {}
    let fa = favorited ? { "favorited": favorited } : {}
    let query = { ...au, ...ta, ...fa, ...fe }
    let articles = await Articles.find(query).skip(offset).limit(limit)
        .select('slug title description body tagList createdAt updatedAt favorited favoritesCount author')
        .populate({
            path: 'author',
            select: 'username bio image',
        })
        .exec()
    return { "articles": articles , "articlesCount": articles.length}
};

async function slug(slug) {
    let article = await Articles.find({ "slug": slug })
    .select('slug title description body tagList createdAt updatedAt favorited favoritesCount author comments')
        .populate({
            path: 'author',
            select: 'username bio image',
        })
        .exec()
    return {'article':article}
}

const converSlug = str =>  str.split(' ').join("_")

async function save({title, description, body, tagList}, id) {
    let user = await User.get(id)
    // console.log
    let article = {
        "slug": converSlug(title),
        "title": title,
        "description": description,
        "body": body,
        "author": user[0]
    }
    let tag = tagList?{"tagList": tagList}:{};
    let up = {...article, ...tag}
    let newArticle = new Articles(up)
    return await newArticle.save()
}

async function update({title, description, body }, id, slu) {
    let user = await User.get(id)
    var ti={},glu={}
    if(title) {
        ti = {"title": title};
        glu = {"slug": converSlug(title) }
    }
    let de = description? {"description": description}: {};
    let bo = body? {"body": body}: {};

    let up = {...ti, ...de, ...bo, ...glu};

    let articleUp = await Articles.where( {"slug": slu}).update({ $set: up}) 
    // console.log(articleUp)
    if(articleUp.n !== 1){
        console.log(slu)
        if(title) return await slug(converSlug(title))
        else return await slug(slu)
    }else{
        return {
            "errors": {
                "body": [" can't find slug update false "]
            }
        }
    }

}

async function remove (slu) {
    let article = await Articles.where({"slug":slu}).findOneAndRemove()
    .select('slug title description body tagList createdAt updatedAt favorited favoritesCount author')
        .populate({
            path: 'author',
            select: 'username bio image',
        })
        .exec()
    return {'article':article}
}

async function addComment (comment, slu, id) {
    // console.log(comment, slu) ;
    let {body} = comment;
    let author = await User.get(id)
    // console.log(author[0])

    let co = {  
        "body": body,
        "author": author[0]
     }
    let newComment = new Comments(co)
    let commentSend= await newComment.save()

    let up = { "comments":commentSend  };
    let article = await Articles.where( {"slug": slu}).update({ $push: up}) 
    // console.log(article);

    return {
        "comment":commentSend
    }
}
module.exports = { get, slug, save, update, remove, addComment} 