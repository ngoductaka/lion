const User = require('../Models/User');
const Articles = require('../Models/Articles');
const Comments = require('../Models/Comments');

const randtoken = require('rand-token');
const express = require('express');
const router = express.Router();

router.get('/users', require('../middlewares/auth.js'), async (req, res) => {
    try {
        const user = await User.get(req.userId);
        const { email, token, username, bio, image = null } = user[0];
        res.json({ "user": { email, token, username, bio, image } })
    }
    catch (err) {
        console.log("err get curent data ", err)
    }
});
router.post('/users', async (req, res) => {// create new user 
    // Required fields: email, username, password
    if (req.body.user.email == undefined || req.body.user.password == undefined || req.body.user.username == undefined) {
        res.send({
            "errors": {
                "body": ["Required fields: email, username, password"]
            }
        })
    }
    // Generate a 32 character alpha-numeric token:
    let token_ = randtoken.generate(32);
    req.body.user.token = token_;
    const user = await User.save(req.body.user);
    res.json(user);
});
router.post('/users/login', async (req, res) => {// login
    // console.log

    if (req.body.user.email == undefined || req.body.user.password == undefined) {
        res.send({
            "errors": {
                "body": ["email, password is require "]
            }
        })
    }
    let token_ = randtoken.generate(32);
    const user = await User.login(req.body.user);
    user[0].token = token_;
    User.update(user[0], user[0].id);
    res.send(user);
});
router.put('/users', require('../middlewares/auth.js'), async (req, res) => {
    // User.update(req.body.user, req.userId);
    let { email, username, password, image, bio } = req.body.user;
    let data = { email, username, password, image, bio };
    const user = await User.update(data, req.userId);
    res.send(user);
});
// articles
router.get('/articles', async (req, res) => {
    try {
        let { tag, author, favorited, limit, offset } = req.query;
        let query = { tag, author, favorited, limit, offset }
        const articleList = await Articles.get(query)
        res.json(articleList)
    }
    catch (err) {
        console.log("err get Articles data ", err)
    }
})

router.get('/articles/feed', require('../middlewares/auth.js'), async (req, res) => {
    try {
        let { tag, author, favorited, limit, offset } = req.query;
        let query = { tag, author, favorited, limit, offset }
        const articleList = await Articles.get(query, req.userId)
        res.json(articleList)
    }
    catch (err) {
        console.log("err get Articles data ", err)
    }
})
// /api/articles/:slug
router.get('/articles/:slug', require('../middlewares/auth.js'), async (req, res) => {
    try {
        // console.log(req.params.slug)
        const article = await Articles.slug(req.params.slug)
        res.json(article)
    }
    catch (err) {
        console.log("err /articles/", err)
    }
})
//3.4.8 Create Article
//  POST /api/articles
router.post('/articles', require('../middlewares/auth.js'), async (req, res) => {
    try {
        // console.log(req.userId)
        let { title, description, body } = req.body.article
        if (!title || !description || !body){
            res.send({
                "errors": {
                    "body": ["title, description, body is require "]
                }
            })
        }
        const article = await Articles.save(req.body.article, req.userId)
        res.json(article)
    }
    catch (err) {
        console.log("err /articles/articles", err)
    }
})
// 3.4.9 Update Article
router.put('/articles/:slug', require('../middlewares/auth.js'), async (req, res) => {
    const article = await Articles.update(req.body.article, req.userId, req.params.slug )
    res.json(article)
})
// 3.4.10 Delete Article
router.delete('/articles/:slug', require('../middlewares/auth.js'), async (req, res) => {
    const article = await Articles.remove(req.params.slug )
    res.json(article)
})
// 3.4.11 Add Comments to an Article
// POST /api/articles/:slug/comments
router.post('/articles/:slug/comments', require('../middlewares/auth.js'), async (req, res) => {
    let {body} = req.body.comment;
    if (!body){
        res.send({
            "errors": {
                "body": [" body is require "]
            }
        })
    }
    const article = await Articles.addComment(req.body.comment,req.params.slug, req.userId )
    res.json(article)
})
// 3.4.12 Get Comments from an Article
// GET /api/articles/:slug/comments
router.get('/articles/:slug/comments',  async (req, res) => {
    console.log(1)
    const comments = await Comments.get(req.params.slug)
    console.log(12)
    console.log(comments)
    res.json(comments)
})
// 3.4.13 Delete Comment
// DELETE /api/articles/:slug/comments/:id

router.delete('/articles/:slug/comments/:id',  async (req, res) => {
    const comments = await Comments.delete(req.params.slug, req.params.id) 
    res.json(comments)
})
module.exports = { router }