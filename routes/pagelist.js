const express = require('express');
const router = express.Router();
const fs = require('fs');
const archiver = require('archiver');
const rm = require('rimraf');
const mkdirp = require('mkdirp');
const path = require('path');
const async = require('async');
const auth = require('../middle/auth');

const pageSize = 3;


router.get('/:page?', auth.checkLogin, function(req,res){
  let _page = req.params.page ? req.params.page: 1;
  Model('Template').paginate({'userId': req.session.user._id,'status': 1}, { page: _page, limit: pageSize }, function(err, result) {
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }else{
      res.render('pagelist', result);
    }
  });
});

// 修改删除逻辑，拓展原来的表结构， 0为默认状态，删除就是将默认 status为0的状态修改为1
router.get('/delete/:id', auth.checkLogin, function(req,res){
    Model('Template').update(
      {
        '_id': req.params.id
      },
      {
        'status': 0
      }, function(error) {
        if (error) {
          req.flash('error',error);
          res.redirect('back');
        }else{
          res.redirect('/pagelist');
        }
    });
});

router.get('/download/:id', auth.checkLogin, function(req,res){
  let fileName = `download_${Date.now()}.zip`;
  let filePath = path.join(process.cwd(), `/download/${fileName}`);//文件打包地址
  let output = fs.createWriteStream(filePath);

  let archive = archiver('zip',{
    store: true
  });
  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  Model('Template').find({'_id': req.params.id}).exec(function(err, info){
    if(err){
      req.flash('error',err);
      res.redirect('back');
    }else{
      let html = `${info[0].modelType}_${info[0]._id}.html`;
      let htmlPath = path.resolve(__dirname, `../dist/html/${html}`);

      async.series([
        (cb) => {
          rm(path.join(process.cwd(), '/temp/*'), function(){
            cb(err, '删除temp目录下内容成功！')
          })
        },
        (cb) => {
          mkdirp(path.join(process.cwd(), '/temp/html'), function(error){//创建html文件夹
            if(error){
              console.log(error)
            }else{
              let rsHtml = fs.createReadStream(htmlPath);
              let wsHtml = fs.createWriteStream(path.resolve(__dirname, `../temp/html/${html}`));
              rsHtml.pipe(wsHtml);

              cb(err, '创建html成功！')
            }
          });
        },
        (cb) => {
          mkdirp(path.join(process.cwd(), '/temp/images'), function(error){//创建images文件夹
            if(error){
              console.log(error)
            }else{
              let rsbackgroundimagePath = fs.createReadStream(path.resolve(__dirname, `../${info[0].activity.backgroundImagePath}`));
              let wsbackgroundimagePath = fs.createWriteStream(path.resolve(__dirname, `../temp/images/${info[0].activity.backgroundImageName}`));
              rsbackgroundimagePath.pipe(wsbackgroundimagePath);

              info[0].products1.forEach((item,index) => {
                let rsimagePath = fs.createReadStream(path.resolve(__dirname, `../${item.productImagePath}`));
                let wsimagePath = fs.createWriteStream(path.resolve(__dirname, `../temp/images/${item.productImageName}`));
                rsimagePath.pipe(wsimagePath);
              });

              info[0].products2.forEach((item,index) => {
                let rsimagePath = fs.createReadStream(path.resolve(__dirname, `../${item.productImagePath}`));
                let wsimagePath = fs.createWriteStream(path.resolve(__dirname, `../temp/images/${item.productImageName}`));
                rsimagePath.pipe(wsimagePath);
              });

              cb(err, '创建images成功！')
            }
          });
        },
        (cb) => {
          archive.directory(path.join(process.cwd(), '/temp'));
          archive.finalize();
          cb(err, '下载成功！')
        }
      ],(err, result) => {
        console.log(result);
      })

      //下载文章
      output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        let stats = fs.statSync(filePath);
        if(stats.isFile()){
          res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename='+fileName,
            'Content-Length': stats.size
          });
          fs.createReadStream(filePath).pipe(res);
        }else{
          req.flash('error','下载文章失败');
        }
      });
    }
  })
});

module.exports = router;
