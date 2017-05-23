exports.checkLogin = function(req,res,next){
  if(!req.session.user){
    return res.redirect('/users/login');
  }
  next();
}

exports.checkNotLogin = function(req,res,next){
  if(req.session.user){
    return res.redirect('back');
  }
  next();
}
