/****** JS for parts research in TKO root ******/
var oTimer;
var sRootPath;

function fCheckThemePath(){
  if($('script[src*="tko.home-parts.js"]')[0]){
    sRootPath = $('script[src*="tko.home-parts.js"]').attr('src')
    sRootPath = sRootPath.substring(0, sRootPath.indexOf('theme'));
    sRootPath = sRootPath.length > 0 ? sRootPath : './' }
  else{
    sRootPath = './' }
}

function fCloseComponentBox_Close(oComRemove){
  oComRemove.animate({height: "0px"}, 'fast', function(){
    oComRemove.remove();  
  })    
}

function fCloseComponentBox_Scope(obj, bSelfIncl){
  //remove component explosions/implosions from previous event
  var sObjClass = obj.closest('[class|=component]').attr('class');
  var iCompLevel = Number(sObjClass.substring((sObjClass.lastIndexOf('-')+1)));
  var cRemove = $('[class|=component]').filter(function(){
    var iClass = $(this).attr('class');
    iClass = Number(iClass.substring((iClass.lastIndexOf('-'))+1));
    return bSelfIncl? iClass >= iCompLevel: iClass > iCompLevel }) 
  cRemove.each(function(cRemove_i, cRemove_o){
      fCloseComponentBox_Close($(cRemove_o));
    })
}

function fCloseComponentBox_Create(oBox){
  var oCloseContainer = $('<span />').appendTo(oBox).addClass('close-button');
  var oCloseBox = $('<img />', {
    src: sRootPath + 'theme/graphic/ico_close.gif',
    title: 'Close Window',
    click: function(){
      fCloseComponentBox_Scope($(this), true)
    }
  }).appendTo(oCloseContainer)
}

function fComponentBox_AddHeader(cCompChild, sSearch){
  var oCompBox = $('#bom [class|=component]').eq(0)
  var oCompHeader = $('<div />').appendTo(oCompBox).addClass('header');
  var oCompTitle = $('<div />')
    .appendTo(oCompHeader)
    .append($('<span />', {text: sSearch}))
    .append($('<span />').addClass('model-count'))
    .addClass('header-title');
  var oCompDetails = $('<div />').appendTo(oCompBox).addClass('details')
  var oCompLabel = $('<div />').appendTo(oCompHeader).addClass('label')
    .append($('<span />', {text: 'Number'}).addClass('number'))
    .append($('<span />', {text: 'Description'}).addClass('description'))
    .append($('<span />', {text: 'Item #'}).addClass('item'))
    /*.append($('<span />', {text: 'Rev.'}).addClass('revision'))
    .append($('<span />', {text: 'Drawing'}).addClass('drawing'))*/
    .append($('<span />', {text: 'Qty.'}).addClass('quantity'))
    .append($('<span />', {text: 'Use?'}).addClass('info'))
    
  var oFilterContainer = fFilterComponentBox_Create(oCompTitle);  //add the filter box
  var oCloseContainer = fCloseComponentBox_Create(oCompTitle); //add close button
  var cCompChildSorted = cCompChild.map(function(cCompChildSorted_i, cCompChildSorted_o){
    var sPart = $(cCompChildSorted_o).children('number').text();
    return sPart + ' oRowIndex:' + cCompChildSorted_i  
  }).get().sort();  //sort parts by part number

  //store the retrieved components and sorting in the comp box (for pagination)
  oCompDetails.data('cCompChild', cCompChild).data('cCompChildSorted', cCompChildSorted);
  fComponentBox_AddPagination(oCompDetails);
}

function fComponentBox_AddPagination(oCompDetails){
  var iLines = 100;
  var oCompBox = oCompDetails.closest('[class|=component]');
  var cCompChild = oCompDetails.data('cCompChild');
  var cCompChildSorted = oCompDetails.data('cCompChildSorted');
  var iPageFlip = Math.ceil(cCompChildSorted.length/iLines);
 
  //if the number of components > iLines, then create page selector
  if(oCompDetails.siblings('.pagination').length==0 && iPageFlip > 1){
    var oPagination = $('<span />', {text: 'Pages: '})
      .insertAfter(oCompDetails)
      .addClass('pagination')
      .data('total-lines', cCompChildSorted.length)
      
    for(var i=1; i<=iPageFlip; i++){
      var cCompScope = cCompChildSorted.splice(0, iLines)
      var oPageSelect = $('<span />', {
        text: i,
        click: function(){
          $(this).siblings('*').removeClass();
          $(this).addClass('selected');
          oCompDetails.empty();
          fCloseComponentBox_Scope($(this));
          fBuildLoadingIndicator(oCompBox);
          fComponentBox_AddItem($(this).data('scope'), oCompDetails);
          fComponentBox_EmptyCheck(oCompBox);
        }
      }).appendTo(oPagination)
        .data('scope', cCompScope)
    }
    //set initial value of cCompChildSorted to scope of Page 1
    oPagination.children('span').eq(0).click();
  }
  else{
    fBuildLoadingIndicator(oCompBox);
    fComponentBox_AddItem(cCompChildSorted, oCompDetails);
    fComponentBox_EmptyCheck(oCompBox);
  }
}

function fComponentBox_AddItem(cCompChildSorted, oCompDetails, iSlice){
  var iSliceAdd = 20;
  var iSliceFloor = iSlice ? iSlice : 0;
  var iSliceCeil = iSliceFloor + iSliceAdd;
  var cCompChild = oCompDetails.data('cCompChild');
  var cForWriting = cCompChildSorted.slice(iSliceFloor, iSliceCeil);
  
  $(cForWriting).each(function(cForWriting_i, cForWriting_o){
    var oForWriting = cForWriting_o.toString();
    var iRowIndex = Number((oForWriting.substring(oForWriting.lastIndexOf('oRowIndex'))).replace('oRowIndex:', ''))
    var oComponentItem = cCompChild.eq(iRowIndex);      
    var bModel = $(oComponentItem).children('modelno').length > 0 ? true : false
    var sDrawing = $(oComponentItem).children('drawing').text();
    var bDrawing = !sDrawing  || sDrawing == '' 
        || sDrawing == 'NONE' || sDrawing == 'CLOSE ACCOUNT'
        || sDrawing == 'SEE INFO BELOW' || sDrawing == 'SEE CATALOG' ? false : true ;
    
    var oCompLine = $('<div />')
      .appendTo(oCompDetails)
      .addClass(function(){
        var sLineClass =  $(oComponentItem).children('assembly').length > 0 ? 'assy' : 'item'
        return 'line-' + sLineClass;})
    var oCompLineKey = oCompLine.append($('<span />', {
        text: $(oComponentItem).children('assembly').length > 0 ? '+' : '' }).addClass('key'))
    var oCompLineNum = oCompLine.append($('<span />', {
        //text: $(oComponentItem).children('number').text(),
        html: $.trim($(oComponentItem).children('number').text()).replace(/\[/g, "<").replace(/\]/g, ">"),
        click: function(){fComponentBox_ClickItem(this, 'exploded')} }).addClass('number'))
    var oCompLineDsc = oCompLine.append($('<span />', {
        text: $(oComponentItem).children('description').text(),
        click: function(){fComponentBox_ClickItem(this, 'exploded')}}).addClass('description'))
    var oCompLineItm = oCompLine.append($('<span />', {
        text: $(oComponentItem).children('item').text(),
        click: function(){fComponentBox_ClickItem(this, 'exploded')}}).addClass('item'))
    /*var oCompLineRev = oCompLine.append($('<span />', {
        text: function(){
          var sRevNo = $(oComponentItem).children('revision').text();
          var iRevLength = sRevNo.length;
          for(var i=0; iRevLength >i; i++){
            if(sRevNo.substring(0,1) == '0'){sRevNo = sRevNo.substring(1) }
            else{ break }}
          return sRevNo; },
        click: function(){fComponentBox_ClickItem(this, 'exploded')}}).addClass('revision'))
    var oCompLineDwg = oCompLine.append($('<span />', {
        html: function(){
          if(!bDrawing){
            return '&nbsp;' }
          else if($($oBOM).attr('region') 
            && $($oBOM).attr('region').toLowerCase()=='lna'){
          //return '<a href="http://dbagileifs:8080/doc_app/attachments.jsp?partnumber='
            return '<a href="http://dbagileifs:8080/doc_app/search.jsp?a0=1001&m0=10&v0='
              + sDrawing + '" target="_blank">' + sDrawing + '</a>'               
          }
          else{
            return sDrawing
          }  
        },
        click: function(){
          if(!bDrawing 
          || !$($oBOM).attr('region') 
          || $($oBOM).attr('region').toLowerCase()!='lna'){
            fComponentBox_ClickItem(this, 'exploded'); }
        }}).addClass('drawing'))*/
    var oCompLineQty = oCompLine.append($('<span />', { 
        text: $(oComponentItem).children('quantity').text(),
        click: function(){fComponentBox_ClickItem(this, 'exploded')} }).addClass('quantity'))
    var oCompLineUse = oCompLine.append($('<span />', {
        html: function(){return bModel? '&nbsp;' : '?'},
        title: function(){return bModel? '' : 'Where Used?'},
        click: function(){
          bModel ? fComponentBox_ClickItem(this, 'exploded')
                 : fComponentBox_ClickItem(this, 'imploded')  
        } }).addClass(function(){return bModel ? 'info-model' : 'info-part'}))
    
    var oModelCounter = oCompDetails.closest('[class|=component]').find('.model-count');
    var oPagination = oCompDetails.siblings('.pagination');
    if(oPagination.length > 0){
      oModelCounter.html(function(){
        var iCompFloor = oPagination.children('.selected').text() == 1
          ? parseInt(oPagination.children('.selected').text())
          : ((oPagination.children('.selected').text()-1) * 100) + 1;
        var iCompCeil = iCompFloor == 1
          ? oCompDetails.find('div[class|=line]').length
          : oCompDetails.find('div[class|=line]').length + iCompFloor - 1;
        return "&nbsp;(Showing " + iCompFloor + "-" + iCompCeil + " of " 
          + oPagination.data('total-lines') + " records)"  
      })
    }
    else if(oCompDetails.find('div[class|=line]').length > 0){
      oModelCounter.html(function(){
        return "&nbsp;(" + oCompDetails.find('div[class|=line]').length + " records)" ;    
      })  
    }
  })

  if(cCompChildSorted.length>iSliceCeil){
    oTimer = setTimeout(function(){
      fComponentBox_AddItem(cCompChildSorted, oCompDetails, iSliceCeil)
    }, 10)      
  }
  else{
    clearTimeout(oTimer);
    oCompDetails.closest('[class|=component]').find('.loading-indicator').remove();
  }
}

function fComponentBox_ClickItem(obj, sClass){
  $(obj).closest('.details').find('[class$=exploded], [class$=imploded]').each(function(cSibling_i, cSibling_o){
    $(cSibling_o).attr('class', $(cSibling_o).attr('class').replace('-exploded', ''));
    $(cSibling_o).attr('class', $(cSibling_o).attr('class').replace('-imploded', ''));
  })  
  $(obj).closest('[class|=line]').attr('class', $(obj).closest('[class|=line]').attr('class') + '-' +sClass);
  
  //remove component explosions/implosions for previsously selected component, if any
  var sObjClass = $(obj).closest('[class|=component]').attr('class');
  var iCompLevel = Number(sObjClass.substring((sObjClass.lastIndexOf('-')+1)));
  var cRemove = $('[class|=component]').filter(function(){
    var iClass = $(this).attr('class')
    iClass = Number(iClass.substring((iClass.lastIndexOf('-'))+1))
  return iClass > iCompLevel });
  
  //then explode/implode the newly selected component if it's an assembly
  if(sClass=='imploded'
  ||(sClass=='exploded' && $(obj).closest('[class|=line]').children('.key').text()!='')){
    var sSearch = $(obj).closest('[class|=line]').children('.number').text();
    var iCompQty = $(obj).closest('[class|=line]').children('.quantity')
    fComponentCollection_Scope(sSearch, cRemove, sClass, iCompQty); }
  else{
    cRemove.each(function(cRemove_i, cRemove_o){
      fCloseComponentBox_Close($(cRemove_o));
    })
  }
}

function fComponentBox_Create(oCanvass, sClass){
  sClass = sClass ? sClass : 'exploded';
  var iCompCounter = $('[class|=component]').length;
  var oCompBox = $('<div />').prependTo(oCanvass)
    .addClass(function(){return 'component-' + sClass + '-' + iCompCounter });
  return oCompBox  
}

function fComponentBox_EmptyCheck(oCompBox){
  if(oCompBox.find('.details').children().length==0){
    oCompBox.find('.details')
      .append(
        $('<span />', {text: 'No record found for the search criteria.'})
          .addClass('description')
      )
  }  
}

function fComponentBox_Remove(){
    $('#bom').empty();
    $('#type-selector').remove();
}

function fComponentCollection_Scope(sSearch, cRemove, sClass, iCompQty){
  clearTimeout(oTimer);
  cSearchResult = [];
   //if sSearch exists, either function was invoked by search box, or a component was clicked to explode
   //if cRemove is !null, a component was clicked to explode; hence, cRemove.remove() then explode/implode
   //if cRemove is null, function was invoked by search; check if the search string's length is >=3
   //if search string's length is >=3, $('#bom').empty() then display the new search results.
   //if !sSearch, function was called by BOM browser; hence, $('#bom').empty() then display model numbers
  if(sSearch){
    if(cRemove){
      cRemove.remove();
      if(sClass == 'exploded'){
        var oCompBox = fComponentBox_Create('#bom', 'exploded');
        var cCompChild = $($oBOM).find('parent'); }
      if(sClass == 'imploded'){
        var oCompBox = fComponentBox_Create('#bom', 'imploded');
        var cCompChild = $($oBOM).find('number'); }
      var oLoadMessage = fStatusIndicator_Loading(oCompBox); }
    else{
      if(sSearch.length >= 3){
        $('#bom').empty();
        var oCompBox = fComponentBox_Create('#bom');
        var cCompChild = $($oBOM).find($('#search-column-var').val());
        var oLoadMessage = fStatusIndicator_Loading(oCompBox); }
      else{
        alert('Please enter at least 3 characters.') }
    }
  }
  else{
    $('#bom').empty();
    var oCompBox = fComponentBox_Create('#bom');
    var oLoadMessage = fStatusIndicator_Loading(oCompBox);
    var cCompChild = $($oBOM).find('part');
  }
  
  setTimeout(function(){
    fComponentCollection_Explode(oLoadMessage, sSearch, cCompChild, 0, cRemove, sClass, iCompQty);
  }, 500)        
}

function fComponentCollection_Explode(oLoadMessage, sSearch, cCompChild, iSegmentStart, cRemove, sClass, iCompQty){
  //if sSearch exists, explosion was either invoked by search box, or a component was clicked to explode/implode
  //..cCompChild is the scope of elements to be checked; if there's still elements to check, then fire away!
  //..if cCompChild's elements are all checked for matches, then create the component listing box.
  //if cRemove is !null and action is 'exploded', collect parent nodes whose text is equal to sSearch;
  //if cRemove is !null and action is 'imploded', collect parent nodes of sSearch
  //if cRemove is null, collect nodes (as identified in $('#search-column-var').val()) whose text contains sSearch 
  //if !sSearch, function was called by BOM browser; hence, just unload the model numbers to the display
  var iSegmentSlice = 50;
  
  $('#loading-extra-text').text(function(){
    var sLoadPercent = (iSegmentStart/cCompChild.length) * 100;
    sLoadPercent = sLoadPercent.toFixed(0);
    sLoadPercent = " (" +sLoadPercent + " %) "
    return sLoadPercent;
  })
  
  if(sSearch){
    if(iSegmentStart < cCompChild.length){
      var iSegmentEnd = iSegmentStart + iSegmentSlice;
      if(cRemove){
        if(sClass == 'exploded'){
          var cSegmentResult = cCompChild.slice(iSegmentStart, iSegmentEnd).filter(function(){
            return $(this).text() == sSearch; }).closest('part');
          $.merge(cSearchResult, cSegmentResult); }
        if(sClass == 'imploded'){
          if(iSegmentStart==0){
            cCompParent = cCompChild.filter(function(){
              if(!iCompQty){
                return $(this).text() == sSearch 
              }
              else{
                return $(this).text() == sSearch && $(iCompQty).text() == $(this).siblings('quantity').text()   
              }
            }).siblings('parent');
          }
          var cSegmentResult = cCompChild.slice(iSegmentStart, iSegmentEnd).filter(function(){
            var oCompNumber = $(this); var bReturn = false;
            cCompParent.each(function(cCompParent_i, cCompParent_o){
              if(!bReturn){
                if(oCompNumber.text() == $(cCompParent_o).text()){
                  //if match is already found, remove the parent node from cCompParent
                  cCompParent.splice(cCompParent_i,1);
                  bReturn = true;
                  return false;
                }
              }
            })
            return bReturn
          }).closest('part');
          $.merge(cSearchResult, cSegmentResult);            
        }  
      }
      else{
        var cSegmentResult = cCompChild.slice(iSegmentStart, iSegmentEnd).filter(function(){
          return $(this).text().toUpperCase().indexOf($.trim(sSearch).toUpperCase()) != -1 }).closest('part');
        $.merge(cSearchResult, cSegmentResult);                
      }
      
      oTimer = setTimeout(function(){
        fComponentCollection_Explode(oLoadMessage, sSearch, cCompChild, iSegmentEnd, cRemove, sClass)  
      }, 10)             
    }
    else{
      clearTimeout(oTimer);
      oLoadMessage.remove();
      
      if(cRemove){
        var sListType = sClass == 'exploded' ? ' Components ' : ' - Where Used ' 
        fComponentBox_AddHeader($(cSearchResult), sSearch + sListType); } 
      else{
        fComponentBox_AddHeader($(cSearchResult), 'Search Results '); }
    }
  }    
  else{
    if(iSegmentStart < cCompChild.length){
      var iSegmentEnd = iSegmentStart + iSegmentSlice;
      var cSegmentResult = cCompChild.slice(iSegmentStart, iSegmentEnd).filter(function(){
        return $(this).children('modelno').length > 0; });
      $.merge(cSearchResult, cSegmentResult);
      oTimer = setTimeout(function(){
        fComponentCollection_Explode(oLoadMessage, sSearch, cCompChild, iSegmentEnd, cRemove, sClass)  
      }, 10)         
    }
    else{
      clearTimeout(oTimer);
      oLoadMessage.remove();
      var sProductName = $('#product-selector option[value=\'' +$('#product-selector').val() +'\']').text();
      fComponentBox_AddHeader($(cSearchResult), sProductName + ' Model Numbers ');        
    }
  }
}

function fBuildLoadingIndicator(oTarget){
  var oLoadingIndicator = $('<div />')
    .addClass('loading-indicator')
    .appendTo(oTarget)
  var oLoadingWrapper = $('<div />')
    .addClass('wrapper')
    .appendTo(oLoadingIndicator)
    .css('opacity', 0.1)
  var oLoadingMessage = $('<table />')
    .appendTo(oLoadingIndicator)
    .append($('<tr />')
      .append($('<td />')
        .append($('<img />',{src: sRootPath + 'theme/graphic/cue_loading.gif'}))))
  
  return oLoadingIndicator;
}

function fFilterComponentBox_Create(oBox){
  var oFilterContainer = $('<span />').appendTo(oBox).addClass('filter-holder');
  var oFilterIconBox = $('<span />').appendTo(oFilterContainer);
/*  var oFilter = $('<input />', {
    type: 'text',
    size: 30,
    keyup: function(){
      var cCompLine = $(this).closest('[class|=component], [id|=assembly]').find('[class|=line]')
        .css('display', 'block');
      var sSearchString = $(this).val().toLowerCase();
      var cCompHide = cCompLine.filter(function(index){
        return $(this).text().toLowerCase().indexOf(sSearchString)==-1 })
      cCompHide.css('display', 'none');  
    }
  })
  .appendTo(oFilterContainer)*/
  
  var oFilterIcon = $('<img />', {
      src: sRootPath + 'theme/graphic/ico_filter.gif',
      title: 'Filter the items in the current list',
      click: function(){
        var oFilterBox = $(this).closest('[class|=component]').find('.filter-text');
        if(oFilterBox.length == 0){
          var oFilterTextBox = $('<span />')
            .prependTo(oFilterContainer)
            .addClass('filter-text');
          var oFilter = $('<input />', {
            type: 'text',
            title: 'Filter the items in the current list',
            size: 30,
            keyup: function(){
              var cCompLine = $(this).closest('[class|=component], [id|=assembly]')
                .find('[class|=line]')
                .css('display', 'block');
              var sSearchString = $(this).val().toLowerCase();
              var cCompHide = cCompLine.filter(function(index){
                return $(this).text().toLowerCase().indexOf(sSearchString)==-1 })
                cCompHide.css('display', 'none');
            }
          }).appendTo(oFilterTextBox);
          oFilter.focus();
        }
        else{
          oFilterBox.remove();  
          var cCompLine = $(this).closest('[class|=component], [id|=assembly]')
            .find('[class|=line]')
            .css('display', 'block');
        }

      }
  }).appendTo(oFilterIconBox)
    .addClass('filter-icon')
  
  return oFilterContainer
}

function fSearchBox_Create(){
  var oSearchContainer = $('#type-selector');
  var oSearchCriteriaBox = $('<span />', {id: 'search-box'}).appendTo(oSearchContainer);
  var oSearchCriteriaVar = $('<span />', {id: 'search-criteria-var'}).appendTo(oSearchCriteriaBox);

  var oSearchVarStr = $('<input />', {
    id: 'search-varstring',
    type: 'text',
    keyup: function(e){if(e.keyCode==13){fComponentCollection_Scope($(this).val());}}
  }).appendTo(oSearchCriteriaVar);
  
  var oColumnVar = $('<select />', {
    id: 'search-column-var',
    keyup: function(e){if(e.keyCode==13){fComponentCollection_Scope($('#search-varstring').val());}}
  }).appendTo(oSearchCriteriaVar)
    .append($('<option />',{value: 'number',text: 'Part Number'}))
    .append($('<option />',{value: 'description',text: 'Description'}))
  
  var oSearchImg = $('<img />', {
      src: sRootPath + 'theme/graphic/ico_search.gif',
      id: 'search-ico',
      title: 'Filter',
      click: function(e){
        fComponentCollection_Scope($('#search-varstring').val());    
      }
  }).appendTo(oSearchCriteriaBox);
  
  oSearchVarStr.focus();
}

function fSelectorProduct_Create(){
  jqXHR.done(function(){
    //if cPartsEnabled contains something, 
    // - create a select element, and set its change event;
    // - create options based on manual nodes in cPartsEnabled
    var cPartsEnabled = $($oTopicNode)
      .find('parts')
      .siblings('active:contains(true)')
      .closest('manual');
    
    cPartsEnabled.sort(function(a,b){
      var A = $(a).children('title').text().toLowerCase();
      var B = $(b).children('title').text().toLowerCase();
      if ( A < B){ return -1; }
      else if(A > B){ return 1; }
      else{ return 0; }  
    })
     
    if(cPartsEnabled.length>0){
      var oProductSelect = $('<select />', {
        id: 'product-selector',
        change: function(){
          $('#bom').empty();
          $('#segment-selector').remove();
          $('#type-selector').remove();
          $('#product-selector').val() != '' 
            ? fSelectorSegment_Create($('#product-selector').val()) 
            : null; 
        }
      }).appendTo('#selector')
        .append($('<option />', {value: '', text: '-- select a product --'}))
        
      cPartsEnabled.each(function(cPartsEnabled_i, cPartsEnabled_o){
        $('<option />', {
            text:  $(cPartsEnabled_o).children('title').text(),
            value: $(cPartsEnabled_o).children('link').text()
          }).appendTo(oProductSelect)
      })
    }
    else{
        $('#selector').html(function(){
          return "You do not have access to any of the parts databases at this time. Please check with your TKO Regional Administrator."
        })
    }
  });
}

function fSelectorSegment_Create(sProductPath){
  jqXHR.done(function(){
    var cSegmentNode = $($oTopicNode).find('link:contains(' +sProductPath + ')').siblings('parts');
    if(cSegmentNode.length > 1){
      var oSegmentSelect = $('<select />',{
          id: 'segment-selector',
          change: function(){
            $('#bom').empty();
            $('#type-selector').remove();
            if($('#segment-selector').val()!=''){
              var oSearchOptionBox = $('<span />',{id: 'type-selector'}).appendTo('#selector');
              var oModalContent = fStatusIndicator_Modal();
              var oModalCanvass = fCreateModalBackground(-1);
              $.when(fStyleModalLoader(oModalContent, oModalCanvass)).done(function(){
                setTimeout(function(){
                   fSelectorProduct_Load($('#segment-selector').val())
                 }, 1500);
              })
            }
          }
      }).appendTo('#selector')
        .append($('<option />', {value: '', text: '-- select a filter --'}))
        .focus();
  
      cSegmentNode.each(function(cSegmentNode_i, cSegmentNode_o){
        var sDbName = $(cSegmentNode_o).text();
        var sDbFile = $(cSegmentNode_o).attr('db');
        var sDbData = sProductPath.substring(0, sProductPath.lastIndexOf("/")) + "/" + sDbFile;
        $('<option />', {
          text:  sDbName,
          value: sRootPath + sDbData
        }).appendTo(oSegmentSelect);
      })        
    }
    else{
      $('#bom').empty();
      $('#type-selector').remove();
      var oSearchOptionBox = $('<span />',{id: 'type-selector'}).appendTo('#selector');
      var sDbData = sProductPath.substring(0, sProductPath.lastIndexOf("/")) + "/" + cSegmentNode.attr('db');
      var oModalContent = fStatusIndicator_Modal();
      var oModalCanvass = fCreateModalBackground(-1);
      $.when(fStyleModalLoader(oModalContent, oModalCanvass)).done(function(){
        setTimeout(function(){
          fSelectorProduct_Load(sRootPath + sDbData);
        }, 1500);
      })
    }
  });
}

/*function fSelectorProduct_Create(){
  jqXHR.done(function(){
    //if cPartsEnabled contains something, 
    // - create a select element, and set its change event;
    // - create options based on manual nodes in cPartsEnabled
    var cPartsEnabled = $($oTopicNode)
      .find('parts')
      .siblings('active:contains(true)')
      .closest('manual');
      
    if(cPartsEnabled.length>0){
      var oProductSelect = $('<select />', {
        id: 'product-selector',
        change: function(){
          $('#bom').empty();
          $('#type-selector').remove();
          if($('#product-selector').val()!=''){
            var oSearchOptionBox = $('<span />',{id: 'type-selector'}).appendTo('#selector')
            $.when(fBuildLoadingIndicator(oSearchOptionBox)).done(function(){
              setTimeout(function(){
                fSelectorProduct_Load($('#product-selector').val())
              }, 100);
            })
          }
        }
      }).appendTo('#selector')
        .append($('<option />', {value: '', text: '-- select a product --'}))
        
      cPartsEnabled.each(function(cPartsEnabled_i, cPartsEnabled_o){
        var cPartsEnabledDb = $(cPartsEnabled_o).children('parts')
        var sPartsEnabledPt = $(cPartsEnabled_o).children('link').text();
        cPartsEnabledDb.each(function(cPartsEnabledDb_i, cPartsEnabledDb_o){
          var sDbName = $(cPartsEnabledDb_o).text();
          var sDbFile = $(cPartsEnabledDb_o).attr('db');
          var sDbData = sPartsEnabledPt.substring(0, sPartsEnabledPt.lastIndexOf("/")) + "/" + sDbFile;
          $('<option />', {
            text:  sDbName,
            value: sDbData
          }).appendTo(oProductSelect)
        })
      })
    }
  });
}
*/
function fSelectorProduct_Load(sPath){
  //load parts data for the selected product
  jqXHR = $.get(sPath, function(data){
    if(data.documentElement){
      $xmlPrt = $(data.documentElement)
      $oBOM = data.documentElement; }
    else{
      $xmlPrt = $.parseXML(data);
      $xmlPrt = $($xmlPrt);
      $oBOM = $xmlPrt.children()[0]; }
    fSelectorType_Create();
  }).done(function(){
    $('#modal-wrapper').fadeOut('fast', function(){
      $('#modal-wrapper').remove(); })
    $('#modal-bground').fadeOut('slow', function(){
      $('#modal-bground').remove(); })
  })
}

function fSelectorType_Create(){
  var oSearchOptionBox = $('#type-selector')
  var oSearchBrowseBox = $('<span />',{
    text: 'Assembly Browser',
    click: function(){fSelectorType_Load($(this))} })
    .appendTo(oSearchOptionBox)
    .prepend($('<input>',{
      type: 'radio', 
      value: 'browser',
      name: 'type-selector' }))
  var oSearchSearchBox = $('<span />',{
    text: 'Quick Search',
    id: 'quick-search',
    click: function(){fSelectorType_Load($(this))} })
    .appendTo(oSearchOptionBox)
    .prepend($('<input>',{
      type: 'radio', 
      value: 'search',
      name: 'type-selector' }))
}

function fSelectorType_Load(oType){
  $('#type-selector').find('input:radio').prop('checked', false);
  oType.find('input:radio').prop('checked', true);
  var sTypeSelected = oType.children('input:radio').attr('value');
  
  clearTimeout(oTimer);
  cSearchResult = [];
  $('#bom').empty(); 
  $('#search-box').remove();
  
  switch(sTypeSelected){
    case 'browser':
      setTimeout(function(){  
        fComponentCollection_Scope();
      }, 10);
      break;
    default:
      fSearchBox_Create();
      break;
  }
}

function fStatusIndicator_Flash(oLoadTarget){
  var oLoadMessage = fStatusIndicator_Loading(oLoadTarget);
  return $.Deferred(function(){ 
    var self = this;
    setTimeout(function(){
      oLoadMessage.remove();
      self.resolve();  
    },500)
  });
}

function fStatusIndicator_Loading(oLoadTarget){
  var oLoadMessage = $('<div />').appendTo(oLoadTarget)
    .append($('<img />',{src: sRootPath + 'theme/graphic/cue_loading.gif', align: 'middle', hspace: 10, vspace: 15}))
    .append($('<span />',{text: 'Searching parts database, please wait...'}))
    .append($('<span />', {id: 'loading-extra-text'}))
  return oLoadMessage;  
}

function fStatusIndicator_Modal(oLoadTarget){
  $('#modal-notification').remove();
  var oModalContent = $('<div>', {
    id: 'modal-notification',
    text: 'Loading the parts database of the selected product, please wait...'
  })
    .appendTo($('body'))
    .css('width', '370px')
    .css('text-align', 'center');
    
  return oModalContent;  
}

function fXmlLoad_PartsData(){
  fCheckThemePath();
  fXmlLoad_TkoIndex();
  fSelectorProduct_Create();
  
  //for testing only
  jqXHR.done(function(){
    //$('#product-selector').val('pwr/m03/m03.htm');
    //$('#product-selector').change();
  })
  
}

function fXmlLoad_TkoIndex(){
  var $xmlfile = $bProduction ? 'tko.home.prod.clr' : 'tko.home.clr';
  $xmlfile = sRootPath + $xmlfile
  jqXHR = $.get($xmlfile, function(data){
    if(data.documentElement){
      $xmlHome = $(data.documentElement)
      $oHomeRoot = data.documentElement;
      $oTopicNode  = new Array();
      $($oHomeRoot.childNodes).each(function(i,e){
        e.tagName ? $oTopicNode.push(e) : null; }); }
    else{
      $xmlHome = $.parseXML(data);
      $xmlHome = $($xmlHome);
      $oHomeRoot = $xmlHome.children()[0];
      $oTopicNode  = $oHomeRoot.childNodes; }
  });
}
