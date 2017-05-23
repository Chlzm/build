const express = require('express');
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const auth = require('../middle/auth');
const multer = require('multer');
const router = express.Router();
const postemail = require('../config/emailconfig'); //邮件


//处理文件上传的中间件，只解析类型是multiple/form-data的类型
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `dist/images`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
})
let upload = multer({ storage: storage });
let imgFiles = [];

router.get('/', auth.checkLogin, function(req,res){
  res.render('index', {})
});
router.get('/gaodun',auth.checkLogin,(req,res)=>{
  res.render('indexGaodun',{})
})
router.get('/edit/:id', auth.checkLogin, function(req,res){
  let id = req.params.id;

  Model('Template').find({_id: id}).exec(function(err,info){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }else{
      let options = {
        modelType: info[0].modelType,
        activity: info[0].activity
      }

      if(info[0].modelType === 'model2'){
        let options2 = Object.assign({}, options, {
          productInfos1: info[0].products1
        })

        res.render('index', options2);
      }else if(info[0].modelType === 'model3'){
        let options3 = Object.assign({}, options, {
          productInfos2: info[0].products2
        })

        res.render('index', options3);
      }else{
        let options1 = Object.assign({}, options, {
          productInfos1: info[0].products1,
          productInfos2: info[0].products2
        })
        res.render('index', options1);
      }
    }
  })
})

router.get('/submit/:id', auth.checkLogin, function(req, res) {
  var id = req.params.id;
  Model('Template').find({_id: id}).exec(function(err,info){

    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }else{
        let model = info[0].modelType;//模板类型
        let id = info[0]._id;//数据的ID

        let options = null;

        if(model === 'model1'){
            let productInfos0 = [];
            let products2re = [];
            for(var i=0, len=info[0].products2.length; i<len; i+=3){
                products2re.push(info[0].products2.slice(i,i+3));
            }

            while(info[0].products1.length > 0 && products2re.length > 0){
                productInfos0.push({
                    products1: info[0].products1.shift(),
                    products2: products2re.shift()
                })
            }

            options = {
                activity: info[0].activity,
                productInfos1: info[0].products1,
                productInfos2: info[0].products2,
                productInfos0: productInfos0
            }

        }else if(model === 'model2'){
            options = {
                activity: info[0].activity,
                productInfos1: info[0].products1
            }
        }else if(model === 'model3'){
            options = {
                activity: info[0].activity,
                productInfos2: info[0].products2
            }
        }else if(model === 'model4'){
            options = {
                activity: info[0].activity,
                banners: info[0].banners
            }
        }

      res.render(`template/${model}.pug`,options);

      let compiledFunction = pug.compileFile(path.join(__dirname,`../views/template/${model}.pug`));

      let html = compiledFunction(options);
      fs.writeFile(path.join(__dirname,`../dist/html/${model}_${id}.html`),html,(err)=>{
        if(err){
          console.log(err);
        }
        /*req.session.user.email && postemail({
          to: req.session.user.email,
          text: "您有新的活动添加成功"
        })
          .then((data)=>{
              console.log("success")
          })*/
        });
    }
  })
});

router.post('/submit/:id?', function(req, res) {
  let userId = req.session.user._id;
  let activityId = req.params.id;

  if(!!activityId){
    Model('Template').update({_id: activityId}, {$set:Object.assign(req.body,{userId: userId})}, function(err,info){
      if(err){
        console.log(err)
        res.json({
          code:0
        })
      }else{
        res.json({
          code:1,
          id : activityId
        })
      }
    })
  }else{
    new Model('Template')(Object.assign(req.body,{userId: userId})).save(function(err,info){
      if(err){
        console.log(err)
        res.json({
          code:0
        })
      }else{
        res.json({
          code:1,
          id : info._id
        })
      }
    })
  }
});


router.post('/uploadFile', upload.array('inputFile'), function(req, res) {
  let inputFile = req.files[0];

  console.log(inputFile);

  res.json({
    code:1,
    imgUrl : inputFile.path,
    imgName: inputFile.filename
  })

});

module.exports = router;
