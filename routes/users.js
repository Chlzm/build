const express = require('express');
const router = express.Router();
const auth = require('../middle/auth');
const postemail = require('../config/emailconfig'); //邮件
router.get('/reg', auth.checkNotLogin, function(req, res) {
    res.render('user/reg');
});

router.post('/reg', auth.checkNotLogin, function(req, res) {
    //  此处需要修改，不传邮箱也无所谓。
    var user = req.body;
    if (user.password != user.repassword) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/users/reg');
    }
    delete user.repassword;
    if (user.email.length == 0) {
        delete user.email;
    }

    user.password = cipher(user.password, 'gaoquan');

    new Model('User')(req.body).save(function(err, user) {
        if (err) {

            req.flash('error', "数据库保存出错");
            return res.redirect('/users/reg');
        }
        req.flash('success', '恭喜你注册成功!');
        req.session.user = user;
        res.redirect('/');
    })
});


router.get('/login', auth.checkNotLogin, function(req, res) {
    res.render('user/login')
});

router.post('/login', auth.checkNotLogin, function(req, res) {
    var user = req.body;
    user.password = cipher(user.password, 'gaoquan');

    Model('User').findOne(user).exec(function(err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/users/login');
        }
        if (user) {
            req.session.user = user;
            res.redirect('/');
        } else {
            req.flash('error', '用户或密码不正确');
            res.redirect('/users/login');
        }
    })
});

router.get('/findPwd', auth.checkNotLogin, function(req, res) {
    res.render('user/findPwd')
});

router.post('/findPwd', auth.checkNotLogin, function(req, res) {
    var user = req.body;
    Model('User').findOne(user).exec(function(err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/users/findPwd');
        }
        if (user) {
            postemail({
                to: user.email,
                text: `${user.username}对应的密码是${decipher(user.password, 'gaoquan')}`
            }).then(() => {
                req.flash('success', '密码已发送到您的邮箱，请注意查收!');
                res.redirect('/users/login');
            })
        } else {
            req.flash('error', '用户或邮箱账号不正确');
            res.redirect('/users/findPwd');
        }
    })

});

router.get('/logout', auth.checkLogin, function(req, res) {
    req.session.user = null;
    return res.redirect('/users/login');
});

module.exports = router;
