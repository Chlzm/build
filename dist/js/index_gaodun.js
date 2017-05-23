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
    getBanners(){
      var data = [];
      $('#bannerArea').find('input[name="backgroundImage"]').each(function(){
        var _this = $(this);
        data.push({
            backgroundImagePath: _this.val(),
            backgroundImage: _this.data('name')
        })
      });
      return data;
    },
    bindSubmit: function(){
      $('#submitBtn').on('click', ()=>{
        //活动区域
        var activityName = $('#activityArea').find('input[name="activityName"]').val();
        var pageTitle = $('#activityArea').find('input[name="pageTitle"]').val();
        var bgColor = $('#activityArea').find('input[name="bgColor"]').val();
        var footerBgColor = $('#activityArea').find('input[name="footerBgColor"]').val();
        /*var backgroundImagePath = $('#activityArea').find('input[name="backgroundImage"]').val();
        var backgroundImage = $('#activityArea').find('input[name="backgroundImage"]').data('name');*/
        var banners = this.getBanners();
        //活动1


        //模板
        var modelType = $('.model-control').find('.selected').data('value');

        var baseparams = {
          'activity': {
            'activityName': activityName,
            'pageTitle': pageTitle,
            'bgColor': bgColor,
            'footerBgColor': footerBgColor,
            /*'backgroundImagePath': backgroundImagePath,
            'backgroundImageName': backgroundImage*/
          },
          banners,
          'modelType': modelType
        },params = {};
        if(modelType === 'model1'){
          delete window.flag;

        }else if(modelType === 'model2'){
          delete window.flag;


        }else if(modelType === 'model3'){
          delete window.flag;


        }

        var submitUrl = null;
        if(location.pathname === '/' || location.pathname === '/gaodun'){
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
            data: baseparams,
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
          var html1 = `
            <div class="product row">
                <div class="col-sm-3">
                    <label>课程包ID</label>
                    <div class="input-container">
                        <input class="form-control" type="text" name="classPackageID">
                    </div>
                </div>
                <div class="col-sm-3">
                    <label>展示的课程数量</label>
                    <div class="input-container">
                        <input class="form-control" type="text" name="showNumber">
                    </div>
                </div>
                <div class="col-sm-3 input-img" data-type="classBackgroundImage">
                    <div class="input-container">
                        <input class="file-control" type="file" name="inputFile">
                        <div class="input-file pic-file"></div>
                    </div>
                </div>
                <div class="col-sm-1 last"><button class="btn btn-danger deleteProd btn-delete" type="button" style="float:right"></button></div></div>
          `
          $(this).parent().next().append(html1);
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
