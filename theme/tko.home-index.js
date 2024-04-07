function fLoadMainIndex(sFunc){
  fCheckIfProduction();
  fLoadBanner(1);
  fLoadXML();
  fLoadSideBar();
  fLoadRecentBox();
  fLoadIndex(sFunc);
  fLoadOption();
  fLoadTKOToolbox()
  setTimeout(fCheckIndexUpdate, 4000);
  setTimeout(fSVTFolder, 6000);
  $('script[src*=home-jumpto]')[0] ? fLoadJumpToBox() : null ;
  fHidePopupDefault();
}

function fLoadXML(){
  var $xmlfile = $bProduction ? 'tko.home.prod.clr' : 'tko.home.clr'; 
  jqXHR = $.get($xmlfile, function(data){
    if(data.documentElement){
      $xmlDoc = $(data.documentElement)
      $oParentNode = data.documentElement;
      $oFunctionNode  = new Array();
      $($oParentNode.childNodes).each(function(i,e){
        e.tagName ? $oFunctionNode.push(e) : null; }); }
    else{
      $xmlDoc = $.parseXML(data);
      $xmlDoc = $($xmlDoc);
      $oParentNode = $xmlDoc.children()[0];
      $oFunctionNode  = $oParentNode.childNodes; }
  });
}

function fLoadIndex(sFunc){
  jqXHR.done(function(){
    //1. create tko-menu section, which will hold listing of all available documents
    //2. create a section (span) for each of the business functions named in sFunc
    //3. call fLoadDocsList to build list of available documents for each business function
    //   as long as list is not over $iVisibleDocs, continue adding documents into list
    //   if list reaches leng limit, add a popup-button
    var $oCanvas = $('<div />', {id: 'tko-menu'})
      .appendTo($('#canvas'));
      
    $($oFunctionNode).each(function(index, node){ 
      if($.inArray(node.tagName, sFunc.split("; "))>-1){
        var $oFunctionBox = $('<span />', {
          id: node.tagName})
          .addClass('function')
          .appendTo($oCanvas)
          .append($('<span />', {
            text: node.attributes.getNamedItem('name').value})
            .addClass('function-title'));
   
        $(node.childNodes).each(function(n, $oChildNode){
          if($($oFunctionBox).find("div.document").length < $iVisibleDocs){
            fLoadDocsList($oFunctionBox, $oChildNode, n); }
          else if($($oChildNode).find("active:contains(true)")[0]){
            if(!$($oFunctionBox).find(".popup-button")[0]){
              var $oButtonHolder = $('<div />')
                .addClass('popup-button')
                .appendTo($oFunctionBox)
                .append(
                  $('<span />', {
                    id: function(i, attr){return node.tagName + "_button";},
                    click: function(){fLoadPopup($oFunctionBox, node, $(this), true)},
                    //src: 'graphic/more.png'
                    html: function(){
                        var lang = $.jStorage.get("chn_home")
                        
                        switch(lang){
                            case true:
                            return '更多资料 &#9658;&#9658;';
                            break;
                                                        
                            default:
                            return 'More Products &#9658;&#9658;';
                        }
                    }
                  }).addClass('more')
                )
            }
          }
        });
      }
      fIndexCleanUp();
    });
  });
}

function fLoadDocsList(fn, child, index, tool){
  switch(child.tagName){
    case "manual":
      //check the children nodes of the current manual node:
      //  a. active's value is true ?
      //  b. legacy is null (non-existent) ?
      //  c. link has either 0 or 2 forward slashes (root file, or 2 folders deep)
      //if all these conditions are met, call fBuildDocLine to add individual documents in index
      if($(child).children("active").text().toLowerCase()=="true"
      && !$(child).children("legacy").text()
      && ($(child).children("link").text().split("/").length>2 
      || !new RegExp("/", 'i').test($(child).children("link").text()))){
        var $oLine = fBuildDocLine(child);
        $oLine = $($oLine).appendTo(fn);
      }  
      break;
    case "group":
      //check the children nodes of the current group node.
      //if there's multiple active child nodes, OR....
      //if subtree is forced and there is at least 1 active child node:
      //  1. depending whether tool is defined or not, use white or blue icon (arrow)
      //  2. create a hyperlink that will invoke fLoadPopup when clicked
      //else, if there is just one active child node (and subtree is not forced):
      //  1. make that one child the index entry  
      if($(child).find("active:contains(true)").length>1 
      || ($(child).is('[subtree=force]') 
      && $(child).find("active:contains(true)").length>0)){
        var $oIcon = tool ? "show_w.png" : "show_b.png"
        $oLine = $('<div />')
          .addClass('document')
          .appendTo(fn);
        $oLink = $('<a />',{
          id: function(n, attr){return $(fn).attr("id") + "_link_" +index; },
          html: child.attributes.getNamedItem("name").value + ' &#9658;',
          href: 'javascript: neg()',
          click: function(){fLoadPopup(fn, child, $(this)); } })
          .addClass('more')
          .appendTo($oLine)
          }
      else if($(child).find("active:contains(true)").length==1){
        var sGroupName = $(child).attr('name')
        var child = $(child).find("active:contains(true)").parent()
         
        if($(child).children("active").text().toLowerCase()=="true"
        && !$(child).children("legacy").text()
        && ($(child).children("link").text().split("/").length>2 
        || !new RegExp("/", 'i').test($(child).children("link").text()))){
          var $oLine = fBuildDocLine(child);
          $oLine = $($oLine).appendTo(fn);
        }
      }
      break;
  }
}

function fLoadOption(){
  jqXHR.done(function(){
    $('#option').append(
      $('<img />',{
        id: 'option-home',
        src: 'theme/graphic/ico_setting.png',
        //click: function(){fLoadModalXML('custom/home/option.clr', 2);}
        click: function(){
            var lang_store = $.jStorage.get("lang_home")
            switch(lang_store){
              case "chn":
              fLoadModalXML('custom/home/option-chn.clr', 0);
              break;
              
              default:
              fLoadModalXML('custom/home/option.clr', 0);
              }
        }
      }).addClass('option-home-select')
    ) 
  })
}

function fLoadPopup(fn, child, obj, more){
  jqXHR.complete(function(){
    //prepare the popup menu box if it doesn't exist yet
    if($("#" + $(obj).attr("id") + "_holder").length==0){
      var $oPopupHolder = $('<div />', {
        id: function(index, attr){
          return $(obj).attr("id") + "_holder"; } })
        .appendTo('#tko-menu')
        .addClass('popup-holder');
      var $oPopupShadow = $('<div />')
        .appendTo($oPopupHolder)
        .addClass('popup-shadow');
      var $oPopup = $('<div />', {
        id: function(index, attr){ 
          return $(obj).attr("id") + "_popup"; } })
        .appendTo($oPopupHolder)
        .addClass('popup-box');
        
      $(child.childNodes).each(function(index, $oChildNode){
        if(!more){fLoadDocsList($oPopup, $oChildNode, index); }
        else{
          var $oLine; 
          if($oChildNode.tagName){
            if($oChildNode.tagName=="manual"){
              $oLine = $($oChildNode).children("title").text(); }
            else{$oLine = $oChildNode.attributes.getNamedItem("name").value; }}
          if($(fn).text().indexOf($oLine)==-1){ fLoadDocsList($oPopup, $oChildNode, index); }
        }
      });
    
      //show popup menu if it's not yet shown
      $($oPopupHolder).fadeIn('fast')
      //position the popup box based on the location of the clicked item
      $($oPopupHolder).offset({ 
        "top" : obj.offset().top - $($oPopup).height() - 5, 
        "left" : obj.offset().left + obj.width() + 5 });
      //adjust the top position of the popup box if it'll truncate to the right
      if($(window).width() <= ($($oPopupHolder).width() + $($oPopupHolder).offset().left + 7)){
        $($oPopupHolder).offset({"left": obj.offset().left - $($oPopupHolder).width()+20}); }
      //adjust the top position of the container box if it'll truncate to the left
      if($($oPopupHolder).offset().left <=0 ){$($oPopupHolder).offset({"left": 5}); }
      //adjust the top position of the popup box if it'll truncate to the top
      if($($oPopupHolder).offset().top <= 0){$($oPopupHolder).offset({"top": 5}); }
      //adjust the height of the container
      $($oPopupHolder).height($($oPopup).height());
      //set the height of the popup shadow
      ($oPopupShadow).height($($oPopupHolder).height());
      ($oPopupShadow).offset({ 
        "top" : $($oPopupHolder).offset().top + 12, 
        "left" : $($oPopupHolder).offset().left + 10});
      $($oPopupShadow).css('opacity', 0.5);
      //get all popup menus that need to remain open and push it to $aKeepPopups 
      var $aKeepPopups = new Array();
      var $iInsLn = $($oPopupHolder).attr("id").match(/_popup/ig);
      var $sInsId = $($oPopupHolder).attr("id");
      if($($oPopupHolder).attr("id").match(/_popup/ig)){
        for(var i=0; i<=$iInsLn.length; i++){
          $aKeepPopups.push($sInsId);
          $sInsId = $sInsId.substring(0, $sInsId.lastIndexOf("_popup")) + "_holder"; }}
      else{ $aKeepPopups.push($sInsId); }
      //hide all popup holders that are not in the $aKeepPopups array    
      $(".popup-holder").each(function(index, popup){
        if($.inArray($(popup).attr("id"), $aKeepPopups)==-1){
          $(popup).fadeOut(function(){ $(popup).remove(); });
        }
      });
    }
  });
}

function fLoadRecentBox(){
  jqXHR.done(function(){
    if($.jStorage.get('tko-recent')){
      var $oHistBox = $('<div/>',{id: 'hist'})
        .appendTo($('#sidebar'));
      var $oHistLabel = $('<span/>',{text: 'Recently Viewed Documents'})
        .appendTo($oHistBox)
        .addClass('function-title');
      var cRecentDoc = $.jStorage.get('tko-recent')
        .split('-delimiter-');
      
      var cRecentDocList = []; var cRecentDocIndex = [];
      
      //parse all active manuals and see if anything matches in the cRecentDoc array
      //if there's a match, store the match to cRecentDocList, and store its index to cRecentDocIndex
      //matches are stored in cRecentDocList array for sorting purposes; 
      //index values are stored in cRecentDocIndex ensure there'll be no duplicates in the Recent sidebar
      var cActiveManual = $($xmlDoc).find("active:contains(true)").parent('manual');
      cActiveManual.each(function(cActiveManual_i, cActiveManual_o){
        var sRecentLink = $(cActiveManual_o).children('location')[0] 
          ? $(cActiveManual_o).children('location').text() 
          : $(cActiveManual_o).children('link').text()
         
         $(cRecentDoc).each(function(cRecentDoc_i, cRecentDoc_s){
           if(sRecentLink == cRecentDoc_s){
             if($.inArray(cRecentDoc_i, cRecentDocIndex)<0){
               var $oLine = fBuildDocLine($(cActiveManual_o)).data('order', cRecentDoc_i)
               cRecentDocIndex.push(cRecentDoc_i);
               cRecentDocList.push($oLine);  
             }
           }  
         }) 
      })
      
      //this sorts the objects in cRecentDocList array by their "order" 
      //order represents the objects' original index position in cRecentDoc
      //the lower the index (order), the "fresher" it was clicked
      cRecentDocList.sort(function(a,b){
        var A = $(a).data('order'); var B = $(b).data('order');
        if ( A < B){ return -1; } else if(A > B){ return 1; } else{ return 0; }
      })
    
      //this adds the objects--sorted by index (order value)--into the Recent sidebar
      //the link that was last clicked, which has the lowest index (order), is displayed on top
      $(cRecentDocList).each(function(cRecentDocList_i, cRecentDocList_o){
        $(cRecentDocList_o).appendTo($oHistBox);  
      })
    }
  });
}

function fLoadToolBox(sFunc){
  jqXHR.complete(function(){
    var $oCanvas = $("#sidebar");
    $($oFunctionNode).each(function(index, node){
      if($.inArray(node.tagName, sFunc.split("; "))>-1){
        var $oFunctionBox = $('<div />', {
          id: 'tool'})
          .appendTo($oCanvas)
          .addClass('tool')
          .append(
            $('<span />', {
                text: node.attributes.getNamedItem("name").value
            }).addClass('function-title')
          )
        $(node.childNodes).each(function(n, $oChildNode){
          fLoadDocsList($oFunctionBox, $oChildNode, n, true); 
        });
      }
    });
    //resize the sidebar after loading the index
    fResizeSidebar()
  });
}

function fBuildDocLine(child){
  var $sLink = $(child).children("link").text();
  var $sDocID = ($sLink.substring($sLink.lastIndexOf("/")+1)).toUpperCase();
  var $sGroup = $(child).children("group").text();
  var $sSubGr = $(child).children("subgroup").text();
  var $sTitle = $(child).children("title").text();
  var $sTarget = $(child).children("target").text();
  var $sClass = $(child).children("class") ? $(child).children("class").text() : null;
  var $sSubLk = $(child).children("location") ? $(child).children("location").text() : null;
  $sLink = fUseDefaultHTM($sTarget, $sLink, $sSubLk);
  
  if($(child).find("custfn").length>0){
    var sCustomFn = $(child).children("custfn").text()
    sCustomFn = sCustomFn.substring(0, sCustomFn.length-2);
    var $oLine = $('<div />').addClass('document')
      .append(
        $('<a />', {
          text: $sTitle,
          href: function(){
            var sVariable = $sClass 
              ?  "'" + $sLink + "', '" + $sClass + "'"
              :  "'" + $sLink + "'" ;
            return  "javascript: " + sCustomFn + "(" +sVariable + ")"
          },
          click: function(){
            $sSubLk ? fAddtoJStorage($sSubLk) : fAddtoJStorage($sLink);
          }
        })
      )
    return $oLine;
  }
  else{
    var $oLine = $('<div/>').addClass('document');
    var $oLink = $('<a/>',{
      text: $sTitle,
      href: $sLink,
      target: $sTarget, 
      click: function(){
        $sSubLk ? fAddtoJStorage($sSubLk) : fAddtoJStorage($(child).children("link").text());
      }
    }).appendTo($oLine)
    return $oLine;             
  }
}

function fAddtoJStorage(sClickedLink){
  var sRecent = $.jStorage.get('tko-recent');
  if(!sRecent){
    $.jStorage.set('tko-recent', sClickedLink); }
  else{
    var iClickedinRecent = sRecent.lastIndexOf(sClickedLink);
    var iRecentCount = sRecent.split('-delimiter-').length;
    if(iClickedinRecent == 0){
      /*do nothing, selected link is already first in tko-recent*/ }
    else if (iClickedinRecent > 0){
      //Clicked link is somewhere in tko-recent, make it first
      sRecent = sRecent.replace('-delimiter-' +sClickedLink , '');
      $.jStorage.set('tko-recent', sClickedLink + '-delimiter-' + sRecent); }
    else if(iRecentCount < 10){
      //Clicked link is not yet in tko-recent, add it (as first)
      $.jStorage.set('tko-recent', sClickedLink + '-delimiter-' + sRecent); }
    else{
      sRecent = sRecent.substring(0, sRecent.lastIndexOf('-delimiter-'));
      $.jStorage.set('tko-recent', sClickedLink + '-delimiter-' + sRecent); }
  }
}

function fUseDefaultHTM($sTarget, $sLink, $sSubLk){
  //if $sSubLk exists, use it as target link/file
  $sLink = $sSubLk ? $sSubLk : $sLink;   
    
  //this was added to make the links work outside the TKO browser
  if(!$bProduction && $sTarget=="_top"
    && $sLink.substring($sLink.lastIndexOf(".")).toUpperCase()==".HTM"
    && $sLink.toUpperCase().indexOf("NEW")==-1){
      $sLink = $sLink.replace($sLink.substring($sLink.lastIndexOf("/")+1), "default.htm"); }
  return $sLink;
}   

function fLoadSideBar(){
  jqXHR.done(function(){
    var $oSideBox = $('<span />', {id: 'sidebar'})
      .addClass('function')
      .prependTo($('#canvas'));
  });
}

function fLoadExtras(){
    jqXHR.complete(function(){
        var $oCanvas = $("#sidebar");
        var $oFldTool = $($xmlDoc).find("img").parent()
        //alert($oFldTool.length)
        var $oFunctionBox = $('<div />', {
            id: 'tool'})
        .appendTo($oCanvas)
        .addClass('tool')
        .append(
            $('<span />', {
                text: "Field Tools"
            }).addClass('function-title')
        )
        $oFldTool.each(function(){
            if($(this).find("active:contains(true)").length > 0 ){
                var oImg = $(this).find('img').text()
                var $oLine = fBuildDocLine($(this))
                .appendTo($oFunctionBox)
                .find('a').html(function(){
                    return $('<img>',{
                        src: oImg })
                        .addClass('field-tool')
                })
            }
        })
    })
}

function fIndexCleanUp(){
  jqXHR.complete(function(){
    $('span.function').each(function(index, element){
      if($(element).find('div.document').length==0){
        $(this).remove();
      }
    })
  })  
}

function fHidePopupDefault(){
  jqXHR.complete(function(){
    $(document).click(function(e){
      if(e.target && (!e.target.className || e.target.className != "more")){
        var $aKeepPopups = $('.popup-holder').map(function(){return $(this).attr("id")})
        $aKeepPopups.each(function(i,el){
          if((!e.target.parentNode.parentNode)
          || (!e.target.parentNode.parentNode.id)
          || ((e.target.parentNode.parentNode.id).indexOf(el.replace("_holder",""))==-1)){
            $("#" + el).fadeOut(function(){$(this).remove();});
          }
        })
      }
    });
    $(window).resize(function(){
      fResizeSidebar()
    });
  });  
}

function fCheckIndexUpdate(){
  jqXHR.complete(function(){
    fCheckNotifications();
    if($bProduction){
      var objDate = new Date();
      var intToday = objDate.getDate();
      var intLastRun = $.jStorage.get("LastTkoHomeRun", 0);
      if(intLastRun == intToday){
        $.get('tko.home.clr', function(){ top.location.href = "vbs/tko.home.exe"; })
        //$.get('tko.cleanup.clr', function(){ top.location.href = "vbs/tko.cleanup.exe"; }) 
        setTimeout(function(){top.location.href = "vbs/tko.cleanup.exe";}, 4000);
        }
      else{
        $.jStorage.set("LastTkoHomeRun", intToday);  
        top.location.href = "vbs/tko.home.exe";
        setTimeout(function(){top.location.href = "vbs/tko.cleanup.exe";}, 4000);
      }
      //top.location.href = "vbs/tko.cleanup.exe";
    }
  });
}

function fCheckNotifications(){
  //1. check if there are notifications (notification nodes in CLR file)
  //2. check if notification is active (active node) and not expired (expiration node)
  //3. no active modal window (#modal-bground) is currrently active ?
  //   a. if so, continue to step 4
  //   b. else, stop each loop   
  //4. check if path of selected notification is already in jstorage's tko-notification
  //5. if path is not yet stored, call fLoadModalXML to get the content of the xml file
  //$.jStorage.deleteKey("tko-notification") /****use this to flush tko-notification****/
  if($($oFunctionNode).find("notification")[0]){
    var cMessageNodes = new Array();
    var cNotification = $($oFunctionNode).find("notification")
      .each(function(cNotification_i, cNotification_o){
      if($(cNotification_o).children("active").text().toLowerCase()=="true"){
        var dExpiration = new Date($(cNotification_o).children('expiration').text())
        dExpiration = Date.UTC(dExpiration.getFullYear(), dExpiration.getMonth(), dExpiration.getDate())
        if(dExpiration > $.now()){
          if(!$('#modal-bground')[0]){
            var sLink = $(cNotification_o).children("link").text();
            var sNotification = $.jStorage.get('tko-notification','');
            if(sNotification.lastIndexOf(sLink)==-1){
              cMessageNodes.push(sLink) } }
          else { return false; }
        }                
      }
    })
    if(cMessageNodes[0])(
      fLoadModalXML(cMessageNodes, 1, 'tko-notification')
    )
  }
}

function neg(){}

function fLoadTKOToolbox(){
  var sPathToCheck = 'asc/h00/misc/';
  var sFileToCheck = 'asco_home_tko.txt'; 
  if ($bProduction){ //if in TKO Client
      $.get(sPathToCheck + sFileToCheck) //check if asco_home_tko.txt is in the path defined
          .fail(function(){ //if not (not downloaded by non-ASCO engineers), load Power and ASCO toolboxes
            fLoadExtras();
            fLoadToolBox("tools_na");
            fLoadToolBox("tools_asc");
          })
          .done(function(){ //if detected (downloaded by ASCO engineers), load ASCO toolbox ONLY
              fLoadToolBox("tools_asc");
              //fLoadExtras();
          })
  }
  else{ //if in TKO Local or Review Server
      fLoadExtras();
      fLoadToolBox("tools_na");
      fLoadToolBox("tools_asc");
      
  }
}

function fResizeSidebar(){
var outerHeight = 0;
$('.tool').each(function() {
  outerHeight += $(this).height();
});



if ($("#tko-menu").height() >= outerHeight){
    $("#sidebar").height($("#tko-menu").height()+$("#hist").height())
}
else{
    $("#sidebar").height(outerHeight+$("#hist").height())
}
}
