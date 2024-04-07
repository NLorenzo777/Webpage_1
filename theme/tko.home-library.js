var $bProduction ;
var $iVisibleDocs = 15;

function fCheckIfProduction(){
  var sFilePath = window.location.pathname;
  $bProduction = sFilePath.toLowerCase().indexOf('tkoclient') >= 0 ? true : false;
}

function fCreateLoadingIndicator(oLoadTarget){
  var oLoadMessage = $('<span />').appendTo(oLoadTarget)
    .append($('<img />',{src: 'theme/graphic/cue_loading.gif', align: 'middle', hspace: 10, vspace: 15}))
    .append($('<span />',{text: 'Loading, please wait...'}))
    .append($('<span />', {id: 'loading-extra-text'}))
  return oLoadMessage;  
}

function fCreateModalBackground(iActiveButton){
  var oModalBgr = $('<div />', {id: 'modal-bground'}).appendTo($("body")).css('opacity', 0.6);
  var oModalWrp = $('<div />', {id: 'modal-wrapper'}).appendTo($("body"));
  var oModalMsg = $('<span />', {id: 'modal-message'}).appendTo(oModalWrp);
  var oModalGht = $('<span />', {id: 'modal-csghost'}).appendTo(oModalWrp);
  var oModalBtn = $('<div/>')
    .appendTo(oModalMsg)
    .addClass('modal-button')
    .append(function(){
      if(iActiveButton > 1){
        return $('<span/>', {
          id: 'modal-tpopout',
          text: 'Pop-out' })
          .click(function(){
            var sImgPath = $(this)
              .closest('span[id=modal-message]')
              .children('img')
              .attr('src');
            window.open(sImgPath); })}
    })
    .append(function(){
      if(iActiveButton > 0){
        return $('<span/>', {
          id: 'modal-tclose',
          text: 'Close' })
          .click(function(){
            $('#modal-wrapper').fadeOut('fast', function(){
              $('#modal-wrapper').remove(); })
            $('#modal-bground').fadeOut('slow', function(){
              $('#modal-bground').remove(); }) }) }        
    })
    .append(function(){
      if(!iActiveButton || iActiveButton == 0){
        $(this).css('top', '-13px').css('right', '0px');
        return $('<img />', {
          id: 'modal-close',
          src: 'graphic/close.png',
          click: function(){
            $('#modal-wrapper').fadeOut('fast', function(){
              $('#modal-wrapper').remove(); })
            $('#modal-bground').fadeOut('slow', function(){
              $('#modal-bground').remove(); })
          }   
        })
      }          
    })

  return oModalMsg;
}

function fLoadBanner(){
  //identify the number of banner_?.jpg images in graphic folder (iImgs_availl)
  //this will be the basis for picking what banner image to display 
  var iImg_avail = 14;
  var iImg_pick = Math.ceil(Math.random() * iImg_avail) > 0 ? Math.ceil(Math.random() * iImg_avail) : 1;
  
  //if banner title doesn't exist yet, create it
  //if environment is non-production, banner should hyperlink to home
  if($(".tko-banner").find("#banner-title").length==0){
    var oBanner = $(".tko-banner")
      .append($("<span />", {id: "banner-photo"}))
      .append($("<img />", {id: 'banner-title', src: 'graphic/long-fieldb.png' }))
      .click(function(){!$bProduction ? top.location.href = 'default.htm' : null});
    fLoadBanner(); 
  }  
  //add photos to the banner until the entire banner area is filled with images
  //if user resizes the window and additional space is created, add more images
  //1. compare width of #banner-photo (immediate wrapper for the images) and .tko-banner
  //   if #banner-photo is less than .tko-banner, there is room for additional images
  //2. get the "index" (filename suffix) of images already in the banner (cImg_loaded)
  //   if random iImg_pick is not yet in the array cImg_loaded, use it to pick the image to add
  else if($(".tko-banner").width() > $("#banner-photo").width()){
    var cImg_loaded = []
    $("#banner-photo").find("img").each(function(oImg_i, oImg_o){
      var iImg_index = $(oImg_o).attr("src")
        .substring($(oImg_o).attr("src").lastIndexOf("/")+1)
        .replace("banner_", "");
      cImg_loaded.push(parseInt(iImg_index)) })
      
    if($.inArray(iImg_pick, cImg_loaded) == -1){
      $("<img />", {
        src: "graphic/banner_" + iImg_pick + ".jpg" })
        .addClass("rotate")
        .appendTo($("#banner-photo"))
        .fadeIn("medium", function(){
          fLoadBanner(); }); }
    else{
      fLoadBanner(); }
  }
  //if photos already fill the banner area, randomly replace banner photos:
  //1. find how many images were loaded in #banner-photo based on its width (iImg_loaded)
  //   this will be the basis for randomly picking which image will be replaced (based on index position)
  //2. check if #banner-photo data() exists and has value
  //   if data() is null/undefined, set value to index position of last loaded image
  //   #banner-photo data() will be used to ensure no same index position in used consecutively 
  //3. get the "index" (filename suffix) of images already in the banner (cImg_loaded)
  //   if random iImg_pick is not yet in the array cImg_loaded, use it to pick the image to add
  else{
    var iImg_loaded = $("#banner-photo img").length;
    var iImg_random = Math.floor(Math.random() * iImg_loaded)
  
    $("#banner-photo").data("last_img_pos") > -1
      ? $("#banner-photo").data("last_img_pos") 
      : $("#banner-photo").data("last_img_pos", iImg_loaded-1);
      
    if ($("#banner-photo").data("last_img_pos") != iImg_random){
      var cImg_loaded = []
      $("#banner-photo").find("img").each(function(oImg_i, oImg_o){
      var iImg_index = $(oImg_o).attr("src")
        .substring($(oImg_o).attr("src").lastIndexOf("/")+1)
        .replace("banner_", "");
        cImg_loaded.push(parseInt(iImg_index)) })
      
      if($.inArray(iImg_pick, cImg_loaded) == -1){
        var oImg_random = $("#banner-photo img")[iImg_random];
        $("#banner-photo").data("last_img_pos", iImg_random);
        
        $(oImg_random).fadeOut("fast",function(){
          $(this).attr("src", "graphic/banner_" + iImg_pick + ".jpg");
          $(this).fadeIn("slow");
          setTimeout(function(){
            fLoadBanner()
          }, 3000);
        });  
      }
      else{
        fLoadBanner(); 
      }
    }
    else{
      fLoadBanner();
    }
  }  
}

function fLoadDirectLoc(sLink){
window.open(sLink)
}

function fLoadFileAttachment(file){
  var fso = new ActiveXObject("Scripting.FileSystemObject"); 
  file = file.replace(/\\/g, "\\\\")
  if(fso.FileExists(file)){
    return objMl.Attachments.Add(file)
  }
}

function fLoadMailerActiveX(oForm){
  var rgxTo = new RegExp('[a-zA-Z0-9.-]*@[a-zA-Z0-9.-]*[a-zA-Z0-9.-]*', "i");
  var rgxCc = new RegExp('[^b]cc=*?[a-zA-Z0-9.-]*@[a-zA-Z0-9.-]*[a-zA-Z0-9.-]*', "i");
  var rgxBc = new RegExp('bcc=*?[a-zA-Z0-9.-]*@[a-zA-Z0-9.-]*[a-zA-Z0-9.-]*', "i");
  var rgxSj = new RegExp('subject[^;&]*', "i");
  var oFormPost = unescape(oForm.prop('action'));
  var sFormTo = oFormPost.match(rgxTo) ? oFormPost.match(rgxTo).toString() : null;
  var sFormCc = oFormPost.match(rgxCc) ? oFormPost.match(rgxCc).toString().replace(/[^b]cc=/i,'') : null;
  var sFormBc = oFormPost.match(rgxBc) ? oFormPost.match(rgxBc).toString().replace(/bcc=/i,'') : null;
  var sFormSj = oFormPost.match(rgxSj) ? oFormPost.match(rgxSj).toString().replace(/subject=/i,'') : null;
  
  if(window.ActiveXObject){
    objO = new ActiveXObject('Outlook.Application');
    objNS = objO.GetNameSpace('MAPI');
    objMl = objO.CreateItem(0);

    //If the sbumit button has a class, and classname starts with 'f' (for 'function')
    //then set the value of sFormExtra to the classname.
    //Assume that a function with that classname exists, and invoke it.
    var sFormExtra = oForm.find('input[type=submit]').attr('class')           
      && oForm.find('input[type=submit]').attr('class').substring(0,1) == 'f' 
      ? oForm.find('input[type=submit]').attr('class') : null;                
    sFormExtra ? window[sFormExtra](oForm) : null ;                           
  
    //Get the stored data from oForm via $.data(); 
    //this may the original data stored by fStyleMailderForm,
    //or the re-processed data by window[sFormExtra]
    var oFormData = oForm.data('data');  

    oFormData.find('td')
      .css('background-color', $('td').css('background-color'))
      .css('border', $('td').css('border'))
      .css('font-family', $('td').css('font-family'))
      .css('font-size', $('td').css('font-size'))
      .css('padding', $('td').css('padding'));

    sFormTo ? objMl.To = sFormTo : null;
    sFormCc ? objMl.Cc = sFormCc : null;
    sFormBc ? objMl.Bcc = sFormBc : null;
    sFormSj ? objMl.Subject = sFormSj : null;
    objMl.HTMLBody = oFormData[0].outerHTML;
    objMl.Display();
  }
  location.reload()
}

function fLoadModalHTM(sLink){
  $.get(sLink, function(data){
    var oModalCanvass = fCreateModalBackground();
    var oHTMContent = $('<div />', {html: data}).appendTo(oModalCanvass);
    var cDisabledLink = oHTMContent.find("a[disabled=disabled]")
    cDisabledLink.each(function(cDisabledLink_i, cDisabledLink_o){
      $(cDisabledLink_o).click(function(event){
        event.preventDefault();
        alert('You do not have access to this document.')  
      })
    })

    oModalCanvass.addClass('modal-content-htm')
  });
}

function fLoadModalXML(sLink, sModalStyle, sStoreKey){
  if($.isArray(sLink) && sLink.length > 0){
    var oLink = sLink; sLink = oLink.splice(0,1); } 
    
  $.get(sLink, function(data){
    if(data.documentElement){
      var cXmlRoot = data.documentElement
      var cXmlClass = cXmlRoot.tagName;
      var cXmlTree = new Array();
      $(cXmlRoot.childNodes).each(function(i,e){
        e.tagName ? cXmlTree.push(e) : null; }); }
    else{
      var cXmlTree = $($.parseXML(data)).children()[0].childNodes
      var cXmlClass = $($.parseXML(data)).children()[0].tagName;        
    }
    
    var oModalCanvass ;
    switch(sModalStyle){
      case 1:
        oModalCanvass = fCreateModalBackground(-1);
        oModalCanvass.addClass(cXmlClass);
        break;
      case 2:
        oModalCanvass = fCreateModalBackground(-1);
        oModalCanvass.addClass(cXmlClass);
        break;
      default:
        oModalCanvass = fCreateModalBackground(0);
        oModalCanvass.addClass(cXmlClass);
        break
    }
     
    $(cXmlTree).each(function(cXmlTree_i, cXmlTree_o){
      if($(cXmlTree_o).prop('tagName') == 'div'){
        var cItem = $(cXmlTree_o).children('*');
        $(cItem).each(function(cItem_i, cItem_o){
          var sTag = $(cItem_o).prop('tagName');
          var sTxt = $(cItem_o).text()
            .replace(/\[/g, "<")
            .replace(/\]/g, ">")
          var oWrt = $('<'+sTag +'/>', { html: sTxt }).appendTo(oModalCanvass);
          var cItemAttrib = fSetNodeAttribute(cItem_o, oWrt);
        })
      }
      else if($(cXmlTree_o).prop('tagName') == 'table'){
        var oModalFrame = $('<div />').appendTo(oModalCanvass).addClass('modal-iframe').hide();
        //var oLoadMessage = fCreateLoadingIndicator(oModalFrame);
        setTimeout(function(){
            var oModalTable = $('<table />').appendTo(oModalFrame);
            var cItem = $(cXmlTree_o).children('*');
            var cTableAttrib = fSetNodeAttribute(cXmlTree_o, oModalTable);
            $(cItem).each(function(cItem_i, cItem_o){
              var oLine = $('<tr />').appendTo(oModalTable);
              var cData = $(cItem_o).children('*');
              var cLineAttrib = fSetNodeAttribute(cItem_o, oLine);
              $(cData).each(function(cData_i, cData_o){
                var sLinkAttr = $(cData_o).attr('link');
                var sDisableAttr = $(cData_o).attr('disabled');
                var oCol = $('<' + $(cData_o).prop('tagName') + ' />', {
                  html: function(){
                    var sTxt = $(cData_o).text()
                        .replace(/\[/g, "<")
                        .replace(/\]/g, ">"); 
                    if(!sLinkAttr || sDisableAttr){ return sTxt; }
                    else{
                      var oLink = $('<a />', {
                        html: sTxt,
                        href: sLinkAttr,
                        target: function(){
                          /*var sExt = (sLinkAttr.substring(sLinkAttr.length-4)).toUpperCase();
                          return sExt == ".HTM" ? '_top' : '_blank' */
                          if (((sLinkAttr.substring(sLinkAttr.length-4)).toUpperCase() == ".HTM") || (sLinkAttr.toUpperCase().indexOf('SXH') >= 0) ){
                              return '_top'
                          }
                          else {
                              return '_blank'
                          }
                          }
                      })  
                      return oLink;
                    }
                  }    
                }).appendTo(oLine);
                var cColAttrib = fSetNodeAttribute(cData_o, oCol);
                fSetReviewSchematicLink()
              })  
            })
            $('#modal-message').animate({
                //height: '+=' + $('.modal-iframe').height(),
                width: '+=' + $('.modal-iframe').width()
                }, 'fast');
            $('.modal-iframe').fadeIn('fast');
            
            
        },10)
      
        
        /*var oModalTable = $('<table />').appendTo(oModalFrame).hide();
        var cItem = $(cXmlTree_o).children('*');
        var cTableAttrib = fSetNodeAttribute(cXmlTree_o, oModalTable);
        $(cItem).each(function(cItem_i, cItem_o){
          var oLine = $('<tr />').appendTo(oModalTable);
          var cData = $(cItem_o).children('*');
          var cLineAttrib = fSetNodeAttribute(cItem_o, oLine);
          $(cData).each(function(cData_i, cData_o){
            var sLinkAttr = $(cData_o).attr('link');
            var sDisableAttr = $(cData_o).attr('disabled');
            var oCol = $('<' + $(cData_o).prop('tagName') + ' />', {
              html: function(){
                var sTxt = $(cData_o).text()
                    .replace(/\[/g, "<")
                    .replace(/\]/g, ">"); 
                if(!sLinkAttr || sDisableAttr){ return sTxt; }
                else{
                  var oLink = $('<a />', {
                    html: sTxt,
                    href: sLinkAttr,
                    target: function(){
                      var sExt = (sLinkAttr.substring(sLinkAttr.length-4)).toUpperCase();
                      return sExt == ".HTM" ? '_top' : '_blank' }
                  })  
                  return oLink;
                }
              }    
            }).appendTo(oLine);
            var cColAttrib = fSetNodeAttribute(cData_o, oCol);
          })  
        })*/
      }
    })
    
    fSetModalAction(oModalCanvass, sModalStyle, sStoreKey, sLink);
  }).fail(function(){
    if(oLink && oLink.length>0){
      fLoadModalXML(oLink, sModalStyle, sStoreKey)
    }  
  })
}

function fSetModalAction(oModalCanvass, sModalStyle, sStoreKey, sStoreValue){
  switch(sModalStyle){
    case 1:
      oModalCanvass.append($('<div />')
        .addClass('modal-actionset')
        .append($('<input />', {
          type: 'button',
          value: "Okay, I've read this",
          click: function(){
            $('#modal-wrapper').fadeOut('fast', function(){
              $('#modal-wrapper').remove(); })
            $('#modal-bground').fadeOut('slow', function(){
              $('#modal-bground').remove(); })
            $.jStorage.set(sStoreKey, $.jStorage.get(sStoreKey,'') + '-delimiter-' + sStoreValue);  
          }
        }))
        .append($('<input />', {
          type: 'button',
          value: "Remind me later",
          click: function(){
            $('#modal-wrapper').fadeOut('fast', function(){
              $('#modal-wrapper').remove(); })
            $('#modal-bground').fadeOut('slow', function(){
              $('#modal-bground').remove(); })
          }
        }))
      )
      break;
    case 2:
      oModalCanvass.append($('<div />')
        .addClass('modal-actionset')
        .append($('<input />', {
          type: 'button',
          value: "Close",
          click: function(){
            $('#modal-wrapper').fadeOut('fast', function(){
              $('#modal-wrapper').remove(); })
            $('#modal-bground').fadeOut('slow', function(){
              $('#modal-bground').remove(); })
          }
        }))
      )
      break;
    default:
      break
  }
}

function fSetModalMessage(i){
  $('#modal-notification').length > 0 
    ? $('#modal-notification').remove() 
    : null //do nothing
    
  return oMessage = $('<div />', {
    id: 'modal-notification',
    html: function(){
      switch(i){
        case 1:
          return oHTML = '<strong>This form uses ActiveX control.</strong> ' 
            + 'When submitting this form, a security pop-up may appear&mdash;select YES to allow interaction and run the webscript. '
            + 'A draft email will then open in Microsoft Outlook containing the data that you are submitting. ' 
            + 'Be sure to review this draft email and confirm all information and attachments are correct. '
            + 'After verifying all information, send the email. '
          break;
        default:
          break
      }
    }  
  })
}

function fSetNodeAttribute(xml, html){
  var cAttrib = $(xml.attributes)
    .each(function(cAttrib_i, cAttrib_o){
      html.attr(cAttrib_o.name, cAttrib_o.value)
    })
}

function fStyleAutoSizeImage(rImage){
  var iImageHeight = rImage.height;
  var iImageWidth = rImage.width;
  var iHeightLimit = $('body').height() * 0.80;
  var iWidthLimit = $('body').width() * 0.80;
  var sLimiter;
  
  //resize target image depending on size of available real estate
  if(iImageHeight > iHeightLimit){
    sLimiter = 'height';
    iRatio = (parseInt(iHeightLimit)/parseInt(iImageHeight)).toFixed(2);
    iImageHeight = iRatio * iImageHeight;
    iImageWidth =  iRatio * iImageWidth; }
  if(iImageWidth > iWidthLimit){
    sLimiter = 'width';
    iRatio = (parseInt(iWidthLimit)/parseInt(iImageWidth)).toFixed(2);
    iImageHeight = iRatio * iImageHeight;
    iImageWidth =  iRatio * iImageWidth; }
  return  {height: iImageHeight, width: iImageWidth, limiter: sLimiter};
}

function fStyleConditionalEl($this, $val){
  if($this.attr('name')
    .toLowerCase()
    .indexOf('conditional')>=0){
      var cOption;
      switch($this.prop('type')){
        case 'select-one':
          cOption = $this.children('option')
          break;
        default:
          cOption = $('body').find('[name$='+ $this.attr('name') +']')
          break;
      }
      
    cOption.each(function(cOption_i, cOption_o){
      $('[class*="conditional-' + $(cOption_o).val() +'"]').hide(); })
    $('.conditional-' + $val).fadeIn();  
  }
}

function fStyleContentModal(){
  $('.ref-modal').click(function(){
    var bModalTarget = false, oClicked = $(this);
    var oModalCanvass = fCreateModalBackground(2);
    var cDynamicRef = $('[class|="ref-modal"],[class|="ref-target"]')
    cDynamicRef.each(function(cRef_i, cRef_o){
      if(bModalTarget){
        fStyleModalLoader($(cRef_o), oModalCanvass);
        return false;
      }  
      if($(cRef_o).is($(oClicked))){
        bModalTarget = true }
    })
  })
}

function fStyleContentModeless(){
  $('.ref-modeless').click(function(){
    var bModelessTarget = false, oClicked = $(this);
    var oModelessCanvass = fCreateModalBackground(2);
    var cDynamicRef = $('[class|="ref-modeless"],[class|="ref-target"]')
    cDynamicRef.each(function(cRef_i, cRef_o){
      if(bModelessTarget){
        fStyleModalLoader($(cRef_o), oModelessCanvass);
        return false;
      }  
      if($(cRef_o).is($(oClicked))){
        bModelessTarget = true }
    })
  })
}

function fStyleContentToggle(){
  $('.ref-dynamic').click(function(){
    //scripting this effect gave me the biggest challenge!
    var oClicked = $(this);
    var cDynamicRef = $('[class="ref-dynamic"],[class="ref-target"]') 
    var bDynamicTarget = false
    cDynamicRef.each(function(cRef_i, cRef_o){
      if(bDynamicTarget){
        $(cRef_o).fadeToggle();
        return false; }  
      if($(cRef_o).is($(oClicked))){
        bDynamicTarget = true }
    })
  })
}

function fStyleDocumentTips(){
  $('.warning, .caution, .note').each(function(cTip_i, cTip_o){
    var sTipLabel = $(cTip_o).html().substring(0, $(cTip_o).html().indexOf(':')+1)
    var sTipText = $(cTip_o).html().replace(sTipLabel, '')
    $(cTip_o).html('')
    var oTipLabel = $('<div>',{
      html: sTipLabel })
      .appendTo(cTip_o)
      .addClass(function(){
         return $(cTip_o).attr('class') + '-label'
      })
    var oTipText = $('<div>',{
      html: sTipText })
      .appendTo(cTip_o)
      .addClass(function(){
        return $(cTip_o).attr('class') + '-text'
      })
  })
  
  $('<img/>',{
      src: 'theme/graphic/cue_coming.png',
      alt: 'Click to Hide',
      click: function(){$(this).hide();}
  }).appendTo($('#coming-soon'))
}

function fStyleFilterableTable(){
  var cTable = $('th[class|=filter-header]');
  cTable.each(function(cTable_i, cTable_o){
    var oFilterContainer = $('<span/>').appendTo(cTable_o);
    var oFilter = $('<input/>', {
      type: 'text',
      title: 'Filter',
      size: 30,
      keyup: function(){
        var cCol = $(this).closest('table').find('tr').has('td')
          .css('display', 'table-row');
        var sSearchString = $(this).val().toLowerCase();
        var cColHide = cCol.filter(function(index){
          return $(this).text().toLowerCase().indexOf(sSearchString)==-1 })
        cColHide.css('display', 'none');
      }
    }).appendTo(oFilterContainer);
    var oFilterIcon = $('<img/>',{
      src: 'theme/graphic/ico_filter.gif',
      title: 'Filter',
      hspace: 5
    }).appendTo(oFilterContainer);
  })
}

function fStyleSortableTable(){
  $('th[class|=sort-header]').closest('table').each(function(cSortableTable_i, cSortableTable_o){
    var cHeader = $(cSortableTable_o).find('th[class|=sort-header]')
      .click(function(){
        //set classname of the clicked header
        $(this).attr('class', function(){
          $(cSortableTable_o).find('th[class|=sort-header]').not($(this)).attr('class', 'sort-header')
          return $(this).attr('class') == 'sort-header-desc' ? 'sort-header-asc' : 'sort-header-desc';
        })
        
        //create cColumnSortable, a collection of string values under the clicked header
        var sType = $(this).attr('data-type') ? $(this).attr('data-type') : 'text';
        var cColumnDefault = $(cSortableTable_o).find('td:nth-child(' + ($(this).index()+1)+ ')')
        var cColumnSortable = cColumnDefault.map(function(cColumnSortable_i, cColumnSortable_o){
          switch(sType){
            case 'date':
              //if data type is 'date', convert the date to UTC format
              //convert the UTC value to 15-character string to prepare for sorting
              var oDate = new Date($(cColumnSortable_o).text())
              var sValue = Date.UTC(oDate.getFullYear(), oDate.getMonth(), oDate.getDate())
              var iValueLength = 15 - sValue.toString().length
              for(var i=0; i< iValueLength; i++){sValue = '0' + sValue }
              break;
            default:
              var sValue = $(cColumnSortable_o).text();
              break;
          }
          return sValue + ' oRowIndex:' + cColumnSortable_i
        }).get();
        
        //sort cColumnSortable array based on classname of the clicked header
        $(this).attr('class') == 'sort-header-desc' ? cColumnSortable.sort().reverse() : cColumnSortable.sort();
        
        //rebuild the table based on new order of iRowIndex in cColumnSortable
        var oSortableRow = $(cSortableTable_o).find('tr:has(td)').detach();
        $(cColumnSortable).each(function(cColumnSortable_i, cColumnSortable_t){
          var iRowIndex = cColumnSortable_t.substring(cColumnSortable_t.lastIndexOf('oRowIndex'))
          iRowIndex = Number(iRowIndex.replace('oRowIndex:', ''));
          oSortableRow.eq(iRowIndex).appendTo($(cSortableTable_o))
        })
        
        $(cSortableTable_o).find('tr:even').addClass('tr-even');
        $(cSortableTable_o).find('tr:odd').addClass('tr-odd');
      })
    cHeader.eq(0).click();  
  })
}

function fStyleStoredForm(){
  $('div[class=stored-form]').each(function(cStoredForm_i, cStoredForm_o){
    //required: the input element needs to have an id
    //this sets the behavior of each input field based on its type.
    //if input is text or textarea, save data to cookie as you type,
    //if input is select or file, save data to cookie upon selection,
    //if input is select, fShowRelationField will show related data fields.
    //regarldess of input type, the background color changes to white.
    //background-color change is to remove color of retrieved cookie data.
    var bRetrievedData = false;
    $(cStoredForm_o).find('input[type="text"], input[type="file"], textarea')
      .filter(function(){return $(this).attr('name')})
      .val(function(){
        if($.jStorage.get($(this).attr('name'))){
          bRetrievedData = true;
          $(this).data('default-bground', $(this).css('background-color'));
          $(this).css("background", "pink");
          return $.trim($.jStorage.get($(this).attr('name'))); } 
        else{
          return $.trim($(this).val()); } })
      .keyup(function(){
        $.jStorage.set($(this).attr('name'), $(this).val());
        $(this).css("background", $(this).data('default-bground')); 
      });
        
    $(cStoredForm_o).find('select')
      .filter(function(){return $(this).attr('name')})
      .val(function(){
        if($.jStorage.get($(this).attr('name'))){
          bRetrievedData = true;
          $(this).data('default-bground', $(this).css('background-color'));
          $(this).change().css("background", "pink");
          fStyleConditionalEl($(this), $.jStorage.get($(this).attr('name')))
          return $.jStorage.get($(this).attr('name')); } 
        else{
          return $(this).val(); } })
      .change(function(){
        $.jStorage.set($(this).attr('name'), $(this).val());
        $(this).css("background", $(this).data('default-bground')); 
        fStyleConditionalEl($(this), $(this).val());
      });
        
    $(cStoredForm_o).find('input[type="radio"]')
      .filter(function(){return $(this).attr('name')})
      .each(function(cOpt_i, cOpt_o){
        if($.jStorage.get($(this).attr('name'))
        && $.jStorage.get($(this).attr('name'))==$(cOpt_o).val()){
          bRetrievedData = true;
          fStyleConditionalEl($(this), $.jStorage.get($(this).attr('name')));
          $(this).prop('checked','true'); 
          $(this).css('background','pink'); } })  
      .click(function(){
        $('input[name="' +$(this).attr('name') + '"]').css('background','');
        var sValue = $('input[name="' +$(this).attr('name') + '"]:checked').val();
        $.jStorage.set($(this).attr('name'), sValue); 
        fStyleConditionalEl($(this), $(this).val());
      })
  
    //this sets the behavior of "toggle" radiobutton 
    $(cStoredForm_o).find('input[type="radio"]')
      .filter('[name$="-toggle"]')
      .each(function(cOpt_i, cOpt_o){
        $(this).css('opacity', 0);
        if($.jStorage.get($(this).attr('name'))
        && $.jStorage.get($(this).attr('name'))==$(cOpt_o).val()){
          $(cStoredForm_o).find('label[for="' +$(cOpt_o).attr('id') + '"]').addClass('stored'); } })
      .click(function(){
        var sChecked = $(this).attr('id');
        var cRadio = $(cStoredForm_o)
          .find('[name="' +$(this).attr('name') + '"]')
          .each(function(cRadio_i, cRadio_o){
            $(cStoredForm_o).find('label[for="' +$(cRadio_o).attr('id') + '"]').removeClass(); })
        $(cStoredForm_o).find('label[for="' +$(this).attr('id') + '"]').addClass('checked') })
    
    //if bRetrievedData is true, then create an option to clear the stored data.
    if(bRetrievedData){
      var oRetrievedData = $('<span />', {
        text: "The fields highlighted below contain information saved from your last session. To clear the stored data, "   
      })
      .prependTo($(cStoredForm_o))
      .css("background", "pink")
      .css("display", "inline-block")
      .css("padding", "5px 10px")
      .append(
        $('<a />', {
          text: 'click here.',
          href: 'javascript: void(0)',
          click: function(){
            var bErase = confirm("Do you really want to clear all data from this form?\t");
            if (bErase){
              $(cStoredForm_o).find('input[type="text"], input[type="file"], textarea')
                .each(function(cElement_i, cElement_o){
                   $(this).val('');
                   $.jStorage.deleteKey($(this).attr('name'));
                   $(this).css('background','#ffffff') })
              $(cStoredForm_o).find('select')
                .each(function(cElement_i, cElement_o){
                   $(this).val('');
                   $.jStorage.deleteKey($(this).attr('name'));
                   $(this).css('background','inherit'); })
              $(cStoredForm_o).find('input[type="radio"]')
                .each(function(cElement_i, cElement_o){
                   $(this).removeProp('checked');
                   $.jStorage.deleteKey($(this).attr('name'));
                   $(this).css('background','inherit'); })
              $(cStoredForm_o).find('input[type="radio"]')
                .filter('[name$="-toggle"]')
                .each(function(cElement_i, cElement_o){
                   $(cStoredForm_o).find('label[for="' +$(cElement_o).attr('id') + '"]').removeClass();
                }
              )
              oRetrievedData.remove();
              location.reload()
            }
          }
        })      
      );
    }
  })
}

function fStyleMailerForm(){
  $('form[name=mailer-form]').each(function(cMailer_i, cMailer_o){
    $(cMailer_o).on('submit', function(){
      var bSubmit = true;
      //sets required fields: those whose names are prefixed with "required-"
      //if form is submitted with a required field unaccomplished, display reminder
      var cRequired = $(cMailer_o).find('[name|=required]:visible')
        .each(function(cRequired_i, cRequired_o){
          if((isNaN($(cRequired_o).val()) && $(cRequired_o).val().length <= 1)
          ||(!isNaN($(cRequired_o).val()) && $(cRequired_o).val() == 0)){
            alert('Please enter a value in ' + $(cRequired_o).attr('title') + '.');
            var sDefaultBground = $(cRequired_o).css('background-color');
            $(cRequired_o)
              .focus()
              .css('background','yellow')
              .on('key', function(){$(this).css('background',sDefaultBground); })
            bSubmit = false;
            return false;  
          }    
        })
      if(!bSubmit){
        return false; }
      else{
        //if all required fields are accomplished, build the form
        var sFormAction = unescape($(cMailer_o).prop('action'));
        var oFormData = $('<table />');
        var cInput = $(cMailer_o).find('input, textarea, select')
          .filter(function(){ return $(this).attr('name') ? true : false })
          .filter(':visible')
          .each(function(cInput_i, cInput_o){
            //write the form in HTML table format
             var oDataRow = oFormData.append(function(){
               if($(cInput_o).prop('type') != 'radio'
               && $(cInput_o).prop('type') != 'select-one'){
                 return $('<tr />')
                   .append($('<td />',{ text: $(cInput_o).attr('title')}))
                   .append($('<td />',{ html: $.trim($(cInput_o).val()).replace(/\r\n|\r|\n/g,"<br />")}))     
               }
               else if($(cInput_o).prop('type') == 'select-one'){
                 return $('<tr />')
                   .append($('<td />',{ text: $(cInput_o).attr('title')}))
                   .append($('<td />',{ text: function(){
                     if($(cInput_o).children('option:selected').val().length>2){
                       return $(cInput_o).children('option:selected').text()  
                     }   
                   }}))  
               }
               else{
                 if($(cInput_o).prop('checked')==true){
                   return $('<tr />')
                     .append($('<td />',{ text: $(cInput_o).attr('title')}))
                     .append($('<td />',{ text: $('label[for=' +$(cInput_o).attr('id')+ ']').text()}))
                 }  
               }
             })
            //this replaces the subject line with provided info, as needed
            var rgxInpt = new RegExp('#' + $(cInput_o).attr('title') + '#', "gi");
            sFormAction = sFormAction.replace(rgxInpt, $(cInput_o).val());
            
          })
        $(cMailer_o).prop('action', sFormAction);
        $(cMailer_o).data('data', oFormData)
        var oModalCanvass = fCreateModalBackground(1);
        var oModalMessage = fSetModalMessage(1)
        var oModalContent = oModalMessage
          .appendTo($('body'))
          .append(
            $('<span />')
              .append(
                $('<input />',{
                  type: 'button',
                  value: 'Continue',
                  click: function(){
                    var oParent = $(this).parent().empty();
                    var oLoadMessage = fCreateLoadingIndicator(oParent);
                    fLoadMailerActiveX($(cMailer_o));
                    $('#modal-close, #modal-tclose').click();
                  }
                })
              )
              .css('text-align', 'center')
              .css('display', 'block')
              .css('margin-top', '20')
          )
        
        fStyleModalLoader(oModalContent, oModalCanvass);
        //if ActiveX is present, form will use fLoadMailerActiveX
        //else, just submit as regular mail
        if(window.ActiveXObject){return false; }
        else{$('#modal-close, #modal-tclose').click();  
        }  
      }  
    })  
  })
  
}

function fStyleModalLoader(oModalContent, oModalCanvass){
  //set default state of modal canvass
  oModalCanvass
    .hide()
    .css('min-width', '20px').css('max-width', '80%')
    .css('min-height', '20px')
    .find('.modal-button').hide();
  
  //animation if ref-target's immediate child is image
  if($(oModalContent).children('img').length > 0
  && $(oModalContent).children('img').index()==0){
    var oImage = $(oModalContent).children('img').clone();
    var rImage = new Image(); rImage.src = oImage.attr('src');
    //this onload is to address cross-browser idiosyncracies
    oImage.get(0).onload = function(){
      var cDimension = fStyleAutoSizeImage(rImage);
      oModalCanvass
        .fadeIn('fast')
        .animate(
          {width: cDimension.width,
           height: cDimension.height},
          {duration: 'fast',
           complete: function(){
             oModalCanvass
               .css('width', function(){return cDimension.limiter=='height'? 'auto': '80%'})
               .css('height', function(){return cDimension.limiter=='height'? '80%' : 'auto'})
               .css('max-width', function(){return cDimension.limiter=='height'? null : rImage.width})
               .css('max-height', function(){return cDimension.limiter=='height'? rImage.height : null})
               .append(
                 oImage
                   .fadeTo('fast', 1)
                   .css('max-width', '100%')
                   .css('width', 'auto')
                   .css('max-height', '100%')
                   .css('height', 'auto'))
               .find('.modal-button').show();
           }
          }
        )
    } 
  }
  //animation if ref-target's immediate child is not an image
  else{
    oModalCanvass
      .fadeIn('medium')
      .animate(
       {width: oModalContent.css('width') 
          ? oModalContent.css('width') : oModalContent.width(),
        height: oModalContent.css('height') 
          ? oModalContent.css('height') : oModalContent.height()},
       {duration: 'fast', 
        complete: function(){
          oModalCanvass
            .css('width', parseInt((oModalContent.width()/$('body').width())*100) + '%')
            .css('height', 'auto')
            .append(
              $(oModalContent).clone(true)
              .fadeTo('medium', 1)
              .css('width', '100%')
            )
            .find('.modal-button').show().children('#modal-tpopout').remove()
        }
       }
     )
  }
}

function fStyleModalNotification(){
  if($('div[id|=modal-notification]').length>0){
    var oModalCanvass = fCreateModalBackground(2);
    var oModalContent = $('div[id|=modal-notification]');
    fStyleModalLoader(oModalContent, oModalCanvass);
  }
}