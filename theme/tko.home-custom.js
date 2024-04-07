/************************************
Use this JS to write custom scripts
*************************************/
function fLoadASCOModalXML(sLink){
  jqXHR = $.get(sLink, function(data){
    if(data.documentElement){
      $xmlDoc = $(data.documentElement) }
    else{
      $xmlDoc = $.parseXML(data);
      $xmlDoc = $($xmlDoc); }
    
    fCreateModalBackground(0);
    $('<div />', {
        text: 'This section lists the manuals needed for the service of ' +  $xmlDoc.find('description').text()+ ' products.'
    }).prependTo('#modal-message')
    $('<h4 />', {
        text: $xmlDoc.find('description').text()
    }).prependTo('#modal-message')
    fSetReviewSchematicLink()
    fCreateASCOSelTable($xmlDoc);
    fCreateASCODocTable($xmlDoc);
  })
}

function fCreateASCOSelTable(xml){
function fUniqueArray(text,arr_o){
        if ($.inArray(text, arr_o) == -1){
            arr_o.push(text)
            }
    }
    function fLoadOptions(arr_i, sel_o){
        sel_o.find('option').not(':first').remove()
        for(j=0; j<arr_i.length; j++) {
            $('<option />', {
                'value': arr_i[j],
                'html': arr_i[j]
            }).appendTo(sel_o)
        }
    }
function fCreateOptArray(sel_f, sel_t, sel_a) {
    var arr= []
    $(sel_f).change(function(){
    sel_a.find('option').not(':first').remove()
        var arr = []
        var val_f = $(sel_f).find(':selected').val()
        $.each(applText, function(i, val){
            if(val.substr(0,1) == val_f){
                var text = ((val.split(';'))[1]).split(',')
                text.sort()
                for (i=0;i<text.length; i++){
                    fUniqueArray(text[i].replace(' ', ''),arr)
                }
                fLoadOptions(arr, sel_t)
            }
        })
    })
    $(sel_t).change(function(){
        var arr = []
        var val_f = $(sel_f).find(':selected').val()
        var val_t = $(sel_t).find(':selected').val()
        $.each(applText, function(i, val){
            if(val.substr(0,1) == val_f && val.indexOf(val_t) > 0){
                var text = ((val.split(';'))[2]).split(',')
                for (i=0;i<text.length; i++){
                    fUniqueArray(text[i].replace(' ', ''),arr)
                    arr.sort((function(a, b){return a-b}))
                }
                fLoadOptions(arr, sel_a)
            }
        })
        
    })
}
xml.find('sel').each(function(){
    var selID = $(this).attr('id')
    $('<table />', {
    id: selID,
    html: '<tr></tr>'}).appendTo('#modal-message')
    $(this).find('opt').each(function(i){
    var optID = $(this).attr('id')
    var htm = $(this).text()
        $('<td />').css('background-color', 'white').appendTo($('#modal-message table').find('tr'))
        $('<select />', {id:optID}).appendTo($('#modal-message table').find('td').eq(i))
        $('<option />', {
            html:htm,
            value: ''
        }).appendTo($('#modal-message table').find('select').eq(i))
    })
})
    
    var applText = []
    var aFrame = []
    
    var appl = $(xml).find('pcode')
    appl.each(function(){
        fUniqueArray($(this).text(),applText)
        fUniqueArray($(this).text().substr(0,1),aFrame)
    })
    aFrame.sort()
    fLoadOptions(aFrame, $('#asc_frame'))
    fCreateOptArray($('#asc_frame'), $('#asc_type'), $('#asc_rate'))
}

function fCreateASCODocTable(man) {
    $('<div />').attr('id', 'docHolder').appendTo('#modal-message')
    $('#modal-close').click(function(){
        deleteAllCookies()
    })
    $('<ul />', {
        id:'asco-doc-tab'
        }).hide().appendTo('#docHolder')
    $('#asco-doc-tab').children().hide()
    
    $('<img />',{src: 'theme/graphic/cue_loading.gif', id:'loader'})
    .appendTo('#docHolder').hide()
        
    $('select').change(function(){
        var pFrame = $('#asc_frame').find(':selected').val()
        var pType = $('#asc_type').find(':selected').val()
        var pAmps = $('#asc_rate').find(':selected').val()
        
        fCreateAscoCookies(pFrame,pType,pAmps)
        
        var pApplMan = man.find("pcode").filter(function(){
            return (($(this).text().indexOf(pFrame) == 0) && 
            ($(this).text().indexOf(pType) >= 0) && 
            ($(this).text().indexOf(pAmps) >= 0))
        }).closest('manual')

        $('#asco-doc-tab').hide()
        $('#asco-doc-tab').children().remove()
        if((pFrame == '') || (pType == '') || (pAmps == '')){
            $('#docHolder').children().hide()
        }
        else if(pApplMan.length > 0) {
        $('#loader').fadeIn(100)
            pApplMan.each(function(){
                var mType = $(this).find('type').text()
                var mLink = $(this).find('link')
                var mCustFn = $(this).find('custfn')
                var mPart = $(this).find('part')
                var mCtrl = $(this).find('ctrl')
                var mAssy = $(this).find('assy')
                var mTypeArr = ['op_manual', 'service_bulletin', 'brochure', 'schematic', 'schematic_30', 'ctrlmodule', 'parts', 'lube','ddesignassy','gdesignassy','hdesignassy','jdesignassy','ddesignbom','gdesignbom3000','hdesignbomts','jdesignbom','gdesignbom1000','hdesignbombp','sdesignbom','ta_305787','ta_345337','ta_383394','ta_423252','ta_451921','ta_607364','ta_607829','ta_711180','ta_839744','ta_711180-001','ta_777720-002','ta_777720','ta_900598']
                var mHeadArr = ["Operator's Manual", 'Service Bulletin', 'Brochure', 'Schematic', 'Schematic with ACC. 30', 'Control Module', 'Parts List', 'Lube Instructions','Switch Assembly','Switch Assembly','Switch Assembly','Switch Assembly','D Design BOM Summary','G Design BOM Summary - 3000A','H Design BOM Summary - Transfer Switch','J Design BOM Summary','G Design BOM Summary - 1000A','H Design BOM Summary - Bypass Switch','S Design BOM Summary','Test and Adjustment - 305787','Test and Adjustment - 345337','Test and Adjustment - 383394','Test and Adjustment - 423252','Test and Adjustment - 451921','Test and Adjustment - 607364','Test and Adjustment - 607829','Test and Adjustment - 711180','Test and Adjustment - 839744','Test and Adjustment - 711180-001','Test and Adjustment - 777720-002','Test and Adjustment - 777720','Test and Adjustment - 900598']
                var aHref
                var aTarget
                var i = jQuery.inArray(mType, mTypeArr)
                
            if (mCustFn.length > 0) {
                var aHref = 'javascript:' + mCustFn.text() + '("' + mLink.text() + '")'
                var aTarget = ''
                }
            else if (mPart.length > 0) {
                var aHref = 'asc/h01/' + mPart.text()
                var aTarget = ''
            }
            else if (mCtrl.length > 0) {
                var aHref = 'asc/h02/' + mCtrl.text()
                var aTarget = ''
            }
            else if (mAssy.length > 0) {
                var aHref = 'asc/h02/' + mAssy.text()
                var aTarget = ''
            }
            else if (mLink.text().indexOf('xh') > 0) {
                var aHref = mLink.text()
            }
            else /*(mLink.length > 0)*/ {
                var aHref = mLink.text()
                var aTarget = '_blank'
            }

               
            $('<li />', {
                html: $('<a/>', {
                            'text': mHeadArr[i],
                            'href':aHref,
                            'target':aTarget
                        }
                        ).hover(function(){ //mouseover
                        $(this).closest('li').css({
                        'background-color':'gray'
                    })
                    $(this).css('color', 'white')
                },
                function(){ //mouseout
                    $(this).closest('li').css('background-color','#204060')
                    $(this).css('color', 'white')
                })
                })
            .addClass('link-box')                       
            .appendTo('#asco-doc-tab')
                
            })
            setTimeout(function(){
                $('#docHolder').children().hide()
                $('#asco-doc-tab').fadeIn(1000)
                if ( $('#asco-doc-tab').css('display') != 'none' ){
                $('.link-box a').each(function(){
                  var aHeight = $(this).height()
                  var liHeight = $(this).closest('li').height()
                  var liWidth = $(this).closest('li').width()
                  
                  var spacer = (liHeight - aHeight)/2
                  
                  $(this).css({
                      'padding-top': spacer + 'px',
                      height: liHeight - spacer + 'px',
                      width: liWidth
                  })
                })
                fSetReviewSchematicLink()
                }
            }, 1000)
        
        }
    })
}

function fLoadModalAscoHTM(sLink){
$('#modal-wrapper').fadeOut('fast', function(){
    $('#modal-wrapper').remove(); })
$('#modal-bground').fadeOut('slow', function(){
    $('#modal-bground').remove(); })
    setTimeout(function(){
        jqXHR = $.get(sLink, function(data){
        var oModalCanvass = fCreateModalBackground();
        var oHTMContent = $('<div />', {'html': data}).appendTo('#modal-message');
        var cDisabledLink = oHTMContent.find("a[disabled=disabled]")
        cDisabledLink.each(function(cDisabledLink_i, cDisabledLink_o){
          $(cDisabledLink_o).click(function(event){
            event.preventDefault();
            alert('You do not have access to this document.')  
          })
        })
        oModalCanvass.addClass('modal-content-htm')
      })
    }, 200)
;
}

function fCreateAscoCookies(coframe, cotype, corate){
   var date = new Date();
   var coChecker = 'true'
   date.setTime(date.getTime()+(300*1000));
   var expires = "; expires="+date.toGMTString();
    
    document.cookie = 'coCheck=' + coChecker
    document.cookie = "frame="+ coframe + expires + '; path = /'
    document.cookie = 'type=' + cotype + expires + '; path = /'
    document.cookie = 'rate=' + corate + expires + '; path = /'
}
    
function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function fCheckIfProduction(){
  var sFilePath = window.location.pathname;
  bProduction = sFilePath.toLowerCase().indexOf('tkoclient') >= 0 ? true : false;
  $bProduction = bProduction;
}

function fSetReviewSchematicLink(){
  
  if(!bProduction){
    if($('a[href*=sxh  ]')[0]){
      var sServerURL = "http://amerptkorv01.int.vertivco.com"
      $('a[href*=sxh  ]').each(function(cSchemLink_i, cSchemLink_o){
        if(location.toString().match(/^http([s]?):\/\/.*/)){
          $(cSchemLink_o).attr('target', '_blank')
          $(cSchemLink_o).attr('href', function(i, sSchemLink){
            sSchemLink = decodeURI(sSchemLink);
            sSchemLink = sSchemLink.substring(sSchemLink.lastIndexOf('sxh'));
            return sServerURL + "/sch?id=" + sSchemLink.replace('sxh  ', '')
          })  
        }
        else{
          $(cSchemLink_o).click(function(){
            sSchemReminder = 'You can only view schematics on the Review Server.\r'
                           + 'Would you like to open the TKO Review Server now?'
            bGoToRevServer = confirm(sSchemReminder) ? window.open(sServerURL + "/tko") : null;
            return false;
          })
        }
      })    
    }
  }    
}

function fLoadASCOModalNavHTM(sLink){
    $('#modal-close').click()
    jqXHR =  $.get(sLink, function(data){
    var oModalCanvass = fCreateModalBackground();
    var oHTMContent = $('<div />', {html: data}).appendTo(oModalCanvass);
    
    oModalCanvass.addClass('modal-content-htm')
    $('.modal-content-htm').find('h4').next('div').addClass('div-root')
    $('<img src="theme/graphic/cue_loading.gif" id="loader"/>').appendTo('.modal-content-htm').hide()
    $('<div />', {id: 'div_nav'}).appendTo('.modal-content-htm').insertAfter('.div-root').hide()
    $('<span />', {id: 'nav_home', text: $('.modal-content-htm').find('h4').text()}).css('font-weight', 'bold').appendTo('#div_nav')
    fLoadLinkLi()
    })
    
}

function fLoadLinkLi(){
    $('#loader').show()
    
    setTimeout(function(){
        $('.div-root div').each(function(){
        var attr = $(this).attr('name')
        if (typeof attr !== typeof undefined && attr !== false){
            
            $(this).prepend($('<span />', {
                html: attr  + ' &#9658;'
            }).click(function(){
                fClickLinkUl(attr)
            }).addClass('aDiv'))
            
            $(this).children('div').hide()
            $(this).children('table').hide()
            } 
            
        else if ($(this).children('img').length > 0){
            var divImg = $(this).children('img')
            var aImg = $('<a />', {
                html: divImg.css({
                'max-width': '100px',
                'max-height': '100px'
            }),
                href: divImg.attr('src'),
                target: '_Top'
            })
            $(this).html(aImg).css({
                margin: '2px'
            })
        }
        
        else {
          var ahref= $(this).attr('link')
          var atext= $(this).text()
          
          $(this).html($('<a/>', {
              href: ahref,
              html: atext,
              target: '_new'
          }))
          $(this).addClass('div_link')
          fSetReviewSchematicLink()
          fSetHomeTarget()
        }
  }) 
            $('#loader').fadeOut(500, function(){
            $('.div-root').fadeIn(100)
      })
      }, 500)

}

function fClickLinkUl(attr){

    var atChSpan = $('div[name="' + attr + '"]').children('span')
    $('.div-root, #div_nav').hide()
    $('#loader').fadeIn('100')
    
    $('#loader').fadeOut('1000', function(){
        $(atChSpan).hide()
        $(atChSpan).parent().siblings().hide()
        $(atChSpan).siblings().show()
        $(atChSpan).siblings().children('span').show()
        if ($(atChSpan).siblings().children('a').find('img').length > 0){
            $(atChSpan).siblings().css('display', 'inline')
        }
        else{
            $(atChSpan).siblings().children('div').hide()
            $(atChSpan).siblings().children('table').hide()
        }
        $('.div-root, #div_nav').show()
        //$('.div-root').children().show()
    })
    fCreateATSNavIndex(attr)
}

function fCreateATSNavIndex(attr){
    $('#div_nav span span').addClass('span_nav')
    
    $('<span />', {
        name: attr,
        html: ' <b>&gt;</b> ' + '<span>' + attr + '</span>'
    }).appendTo('#div_nav').css('font-size', '0.9em')
    
    $('#nav_home').click(function(){
        $('.div-root, #div_nav').hide()
        $('#loader').fadeIn('100')
        var divNavChild = $('#div_nav').children()
        
        $(divNavChild).each(function(){
            if ($(this).index() > 0) {
                $(this).remove()
            }
        })
        setTimeout(function(){
            $('#loader').fadeOut('1000', function(){
            $('.div-root').find('div').hide()
            $('.div-root').find('.aDiv').show()
            $('.div-root').find('table div').css("display", "block")
            $('.div-root').children().show()
            $('.div-root').show()
        })
        }, 1000)

    })
    $('.span_nav').click(function(){
        var attr = $(this).parent().attr('name')
        var parSpan = $(this).parent()
        var index = $(parSpan).index()
        var divNavChild = $('#div_nav').children()
        
        $(divNavChild).each(function(){
            if ($(this).index() >= index) {
                $(this).remove()
            }
        })
        fClickLinkUl(attr)
    })
}

function fLoadModalRowXML(sLink){
    fLoadModalXML(sLink)
    setTimeout(function(){
        var $modTableTd = $('#modal-wrapper').find('td')
        $modTableTd.hover(
            function(){
                $(this).css({
                    'background-color': '#dddddd', 
                    'cursor': 'default'
                })
                $(this).siblings().css('background-color', '#dddddd')
            }, 
            function(){
                $(this).css('background-color', '#eeeeee')
                $(this).siblings().css('background-color', '#eeeeee')
            })
    }, 500)
}

function fLoadClrSchem(sLink){ /*for clr modal with sxh (schem links)*/
    fLoadModalXML(sLink)
    setTimeout(function(){
        fSetReviewSchematicLink()
        fSetHomeTarget()
    }, 500)
}
function fSetHomeTarget(){
    $('#modal-wrapper a').each(function(){
        if (($(this).attr('href').indexOf('sxh') == 0)||($(this).attr('href').indexOf('exe') > 0)){
            $(this).attr('target', '_self')
        }
    })
}

function fVelocityNotes(){
    $('#modal-wrapper').fadeOut('fast', function(){
    $('#modal-wrapper').remove(); })
$('#modal-bground').fadeOut('slow', function(){
    $('#modal-bground').remove(); })
    fLoadModalXML('custom/site/cards/velocity-notes.clr')
}
function fCheckWin7OS(){
    if(window.navigator.userAgent.indexOf("Windows NT 6.1") != -1){
        return true
    }
}
function fSVTFolder(){
    var win7 = fCheckWin7OS()
    if (win7 || !$bProduction){/* */
        //alert("Win 7 detected. Do nothing. \nWin 7: " + win7 + "\n Client: " + $bProduction)
    }
    else{
        //alert("Win 7 not detected. Run SVT rename exe file.")
        top.location.href="vbs/tko.svt.exe"
    }
}

function fLoadCusModalXML(sLink, sModalStyle, sStoreKey){
$('#modal-close').click() 
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
                          var sExt = (sLinkAttr.substring(sLinkAttr.length-4)).toUpperCase();
                          var iScript = sLinkAttr.indexOf('script')
                          switch(sExt){
                              case '.HTM':
                              return '_top';
                              break
                              
                              case '.PDF':
                              return '_blank'
                              break;
                              
                              default:
                              return '_top'
                          }
                          //return sExt == ".HTM" ? '_top' : '_blank' 
                          }
                      })  
                      return oLink;
                    }
                  }    
                }).appendTo(oLine);
                var cColAttrib = fSetNodeAttribute(cData_o, oCol);
              })  
            })    
            $('#modal-message').animate({
                height: '+=' + $('.modal-iframe').height(),
                width: '+=' + $('.modal-iframe').width()
                }, 'fast');
            $('.modal-iframe').fadeIn('fast');
            fHiLightCrossData()
            },20)
      }
    })
    
    fSetModalAction(oModalCanvass, sModalStyle, sStoreKey, sLink);   
  }).fail(function(){
    if(oLink && oLink.length>0){
      fLoadModalXML(oLink, sModalStyle, sStoreKey)
    }  
  })
}

function fHiLightCrossData() {
    if ($('.cross-data')[0]){
        var $tab = $('.cross-data');
        var $modTableTd = $('.cross-data').find('td')
        $modTableTd.hover(
            function(){
                $(this).css({
                    'background-color': '#bbbbbb', 
                    'cursor': 'default'
                })
                $(this).siblings('td').css('background-color', '#cccccc')
            }, 
            function(){
                $(this).css('background-color', '#eeeeee')
                $(this).siblings('td').css('background-color', '#eeeeee')
            })
    }
}

function fLoadModalHTTP(sLink){
    var modal = fCreateModalBackground(0);
    var str = "An internet connection is required to access this link. Clicking the link below will open a new browser window."
    var divHolder = $('<div />')
    .css({
        'text-align': 'center'
    })
    .text(str)
    .appendTo(modal)
    
    var aHolder = $('<a />', {
        'href': sLink,
        'text': sLink,
        'target':'_new'
    }).css({
        'text-align': 'center',
        'display':'block',
        'margin':'20px auto'
    }).appendTo(divHolder)
    
    
}
function fLoadModalRCAXml(sLink, sModalStyle, sStoreKey){
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
                        target: '_blank'
                      }).css({
                          'cursor':'pointer'
                      })
                      .click(function(){
                            sLinkAttr.toUpperCase().indexOf('HTTP') >= 0 ? fOpenmyCEtvLink(sLinkAttr): window.open(sLinkAttr);
                        })
                        return oLink;
                    }
                  }    
                }).appendTo(oLine);
                var cColAttrib = fSetNodeAttribute(cData_o, oCol);
              })  
            })
            $('#modal-message').animate({
                width: '+=' + $('.modal-iframe').width()
                }, 'fast');
            $('.modal-iframe').fadeIn('fast');
            
            
        },10)
		
      }
    })
    
    fSetModalAction(oModalCanvass, sModalStyle, sStoreKey, sLink);
  }).fail(function(){
    if(oLink && oLink.length>0){
      fLoadModalXML(oLink, sModalStyle, sStoreKey)
    }  
  })
}

function fOpenmyCEtvLink(str){
    var shell = new ActiveXObject("WScript.Shell");
    shell.run("msedge "+str);
    
    //shell.run("Chrome "+str);   --for opening links in Google Chrome

}


function fOpenLink_YouTube1(){
    var shell = new ActiveXObject("WScript.Shell");
    shell.run("msedge "+"https://www.youtube.com/watch?v=IcWvte7dMOE");
}

function fOpenLink_SpareParts(){
    var shell = new ActiveXObject("WScript.Shell");
    shell.run("msedge "+"https://vertivco-my.sharepoint.com/:x:/r/personal/jiawendean_dong_vertivco_com/Documents/%E6%A1%8C%E9%9D%A2/%E5%A4%87%E4%BB%B6%E6%B8%85%E5%8D%95%E6%95%B4%E5%90%88/%E5%A4%87%E4%BB%B6%E6%B8%85%E5%8D%95%E6%9F%A5%E8%AF%A2%E5%B7%A5%E5%85%B7_UPS_v1.5.xlsx?d=weca366abda9a4af988fc900a9ed0e2b3&csf=1&web=1&e=uGDxwz");
}