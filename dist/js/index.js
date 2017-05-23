$(function(){
  var data = new FormData();
  var Index = ({
    init:function(){
      this.bindUploadImage()
      this.deleteProd()
      this.addProd()
      this.bindSubmit()
      this.selectModel()
    },
    bindUploadImage:function(){
      $('body').on('change', 'input[type="file"]', function(){
        var form = $('<form enctype="multipart/form-data"></form>');
        var _this = $(this);
        form.append(_this.clone());
        form.ajaxSubmit({
          url : '/uploadFile',
          type:'POST',
          dataType:'JSON',
          success:function(res){
            if(res.code == 1){
              var siblingInput = _this.siblings('input');
              var name = _this.parent().parent().data('type');

              if(siblingInput.length){
                siblingInput.remove();
              }
              _this.after('<input type="hidden" name="'+name+'" data-name="'+ res.imgName +'" value="'+ res.imgUrl+'"/>')

              _this.closest('.input-container').find('.pic-file').html('<img src="../images/'+res.imgName+'"></img>')
            }

          }
        })
      })
    },

    bindSubmit: function(){
      $('#submitBtn').on('click', function(){
        //活动区域
        var activityName = $('#activityArea').find('input[name="activityName"]').val();
        var pageTitle = $('#activityArea').find('input[name="pageTitle"]').val();
        var bgColor = $('#activityArea').find('input[name="bgColor"]').val();
        var footerBgColor = $('#activityArea').find('input[name="footerBgColor"]').val();
        var backgroundImagePath = $('#activityArea').find('input[name="backgroundImage"]').val();
        var backgroundImage = $('#activityArea').find('input[name="backgroundImage"]').data('name');

        //活动1
        var products1 = [];
        [].slice.call($('.productArea1 .product')).forEach(function(val,item){
          products1.push(
            {
              'productName': $(val).find('input[name="productName"]').val(),
              'productPrice': $(val).find('input[name="productPrice"]').val(),
              'integralPrice': $(val).find('input[name="integralPrice"]').val(),
              'productLink': $(val).find('input[name="productLink"]').val(),
              'productDesc': $(val).find('input[name="productDesc"]').val(),
              'productImagePath': $(val).find('input[name="productImage"]').val(),
              'productImageName': $(val).find('input[name="productImage"]').data('name')
            }
          )
        })

        //活动2
        var products2 = [];
        [].slice.call($('.productArea2 .product')).forEach(function(val,item){
          products2.push(
            {
              'productName': $(val).find('input[name="productName"]').val(),
              'productPrice': $(val).find('input[name="productPrice"]').val(),
              'integralPrice': $(val).find('input[name="integralPrice"]').val(),
              'productLink': $(val).find('input[name="productLink"]').val(),
              'productImagePath': $(val).find('input[name="productImage"]').val(),
              'productImageName': $(val).find('input[name="productImage"]').data('name')
            }
          )
        })

        //模板
        var modelType = $('.model-control').find('.selected').data('value');

        var baseparams = {
          'activity': {
            'activityName': activityName,
            'pageTitle': pageTitle,
            'bgColor': bgColor,
            'footerBgColor': footerBgColor,
            'backgroundImagePath': backgroundImagePath,
            'backgroundImageName': backgroundImage
          },
          'modelType': modelType
        },params = null;

        if(modelType === 'model1'){
          delete window.flag;

          params = Object.assign({}, baseparams, {
            'products1': products1,
            'products2': products2
          });

          Object.keys(params.activity).forEach(function(value){
            isNothing(params.activity[value])
          })

          products1.forEach(function(val){
            Object.keys(val).forEach(function(value){
              isNothing(val[value])
            })
          })
          products2.forEach(function(val){
            Object.keys(val).forEach(function(value){
              isNothing(val[value])
            })
          })
        }else if(modelType === 'model2'){
          delete window.flag;

          params = Object.assign({}, baseparams, {
            'products1': products1
          })

          Object.keys(params.activity).forEach(function(value){
            isNothing(params.activity[value])
          })

          products1.forEach(function(val){
            Object.keys(val).forEach(function(value){
              isNothing(val[value])
            })
          })
        }else if(modelType === 'model3'){
          delete window.flag;

          params = Object.assign({}, baseparams, {
            'products2': products2
          })

          Object.keys(params.activity).forEach(function(value){
            isNothing(params.activity[value])
          })

          products2.forEach(function(val){
            Object.keys(val).forEach(function(value){
              isNothing(val[value])
            })
          })
        }

        var submitUrl = null;
        if(location.pathname === '/'){
          submitUrl = '/submit'
        }else{
          submitUrl = '/submit' + location.pathname.split('edit')[1]
        }

        if(window.flag === 0){
          layer.msg('表单的输入不能为空！');
        }else{
          delete window.flag;
          $.ajax({
            type: "post",
            url: submitUrl,
            data: params,
            dataType: "json",
            success: function (data) {
              if(data.code === 1){
                location.href = '/submit/' + data.id
              }
            }
          });
        }
      })
    },

    deleteProd: function(){//删除产品
      $('.container').on('click', '.deleteProd', function(){
        var productArea = $(this).closest('.product-box');
        if(productArea.find('.product').length > 1){
          $(this).closest('.product').remove();
        }
      })
    },

    selectModel: function(){
      $('.imgBox').on('click', function(){
        var index = $(this).index();
        $('.imgBox').removeClass('selected');
        $(this).addClass('selected');
        $('.productShow').show();
        if(index === 2){
          $('.productArea2').hide();
        }else if(index === 3){
          $('.productArea1').hide();
        }else if(index === 4){
            $('.productArea2').hide();
            $('.productArea1').hide();
        }
      });

      $('.imgBox').off('mouseenter').on('mouseenter', function(){
        $(this).find('.checkBig').show();
      })

      $('.imgBox').off('mouseleave').on('mouseleave', function(){
        $(this).find('.checkBig').hide();
      })

      $('.imgBox').on('click', '.checkBig', function(e){
        e.stopPropagation();
        $('.pop').show();
        $('.pop img').hide();

        if($(this).parent().index() === 1){
          $('.pop .model1').show();
        }else if($(this).parent().index() === 2){
          $('.pop .model2').show();
        }else if($(this).parent().index() === 3){
          $('.pop .model3').show();
        }

      });

      $('.close').on('click', function(){
        $('.pop').hide();
      })

    },

    addProd: function(){//添加产品
      $('.addProd').on('click',function(){

        if($(this).parent().text() === '活动1'){
          var html1 = `
          <div class="product row"><div class="col-sm-2"><label>产品名称</label><div class="input-container"><input class="form-control" type="text" name="productName"></div></div><div class="col-sm-1"><label>产品价格</label><div class="input-container"><input class="form-control" type="text" name="productPrice"></div></div><div class="col-sm-1"><label>积分价格</label><div class="input-container"><input class="form-control" type="text" name="integralPrice"></div></div><div class="col-sm-2"><label>产品链接</label><div class="input-container"><input class="form-control" type="text" name="productLink"></div></div><div class="col-sm-3"><label>产品描述</label><div class="input-container"><input class="form-control" type="text" name="productDesc"></div></div><div class="col-sm-1 input-img" data-type="productImage"><div class="input-container"><input class="file-control" type="file" name="inputFile"><div class="input-file pic-file"></div></div></div><div class="col-sm-1 last"><button class="btn btn-danger deleteProd btn-delete" type="button" style="float:right"></button></div></div>
          `
          $(this).parent().next().append(html1);
        }else if($(this).parent().text() === '活动2'){
          var html2 = `
          <div class="product row"><div class="col-sm-2"><label>产品名称</label><div class="input-container"><input class="form-control" type="text" name="productName"></div></div><div class="col-sm-2"><label>产品价格</label><div class="input-container"><input class="form-control" type="text" name="productPrice"></div></div><div class="col-sm-2"><label>积分价格</label><div class="input-container"><input class="form-control" type="text" name="integralPrice"></div></div><div class="col-sm-3"><label>产品链接</label><div class="input-container"><input class="form-control" type="text" name="productLink"></div></div><div class="col-sm-1 input-img" data-type="productImage"><div class="input-container"><input class="file-control" type="file" name="inputFile"><div class="input-file pic-file"></div></div></div><div class="col-sm-1 last"><button class="btn btn-danger deleteProd btn-delete" type="button" style="float:right"></button></div></div>
          `
          $(this).parent().next().append(html2);
        }
      })
    }
  }).init()
});

function isNothing(val){//非空验证
  if(val === null || val === undefined || val === ''){
    window.flag = 0;
    return null;
  }else{
    window.flag = 1;
    return val;
  }
}
