<!--
function fBuildCustomList(){
  if($('div[id|=custom-list]').length>0){
    var sFileName = $('meta[name=Filename]').attr("content");
    var cCustomList = $('div[id|=custom-list]');
    var cCustomListPipe = []
    
    cCustomList.each(function(cCustomList_i, cCustomList_o){
      var oCustomListIndex = $(cCustomList_o).addClass('index')
      var cCustomListFilter = $(cCustomList_o).children('span.filter').remove();
      var cCustomListSource = $(cCustomList_o).children('span.source').remove();
      var cCustomListOrder = $(cCustomList_o).children('span.order').remove();
      var cCustomListField = $(cCustomList_o).children('span').remove();
      var oLoadMessage = fStyleLoadingIndicator($(cCustomList_o));
      
      //store the collections as data to the table object
      //these data will be collected later by fBuildCustomList_scope
      $(cCustomList_o).data('filter', cCustomListFilter);
      $(cCustomList_o).data('source', cCustomListSource);
      $(cCustomList_o).data('order', cCustomListOrder);
      $(cCustomList_o).data('field', cCustomListField);
      $(cCustomList_o).data('loading', oLoadMessage);
      cCustomListPipe.push($(cCustomList_o).attr('id'));
      
      //scope the content of each custom-list
      fBuildCustomList_scope(cCustomListPipe);
    })  
  }  
}

function fBuildCustomList_build(oCustomList, cCustomListNode, cCustomListField, oLoadMessage, cCustomListPipe){
  var iHangingIndent = 15;
  if(cCustomListNode.length>0){
    var cCustomListSplice = cCustomListNode.splice(0,2);
    $(cCustomListSplice).each(function(cCustomListSplice_i, cCustomListSplice_o){
      var oCustomListRow = $('<div/>')
        .appendTo(oCustomList)
        .addClass('index-link-container')
        .css('margin-left', iHangingIndent)
        .hide();
      
      $(cCustomListField).each(function(cCustomListField_i, cCustomListField_o){
        var sCustomListField_type = $(cCustomListField_o).attr('class');
        var sCustomListField_node = $(cCustomListField_o).attr('title');
        var sCustomListField_text = $(cCustomListSplice_o).children(sCustomListField_node).text(); 
          sCustomListField_text = sCustomListField_text.replace(/\[/g, "<").replace(/\]/g, ">"); 
             
        var oCustomListColumn = $('<span/>',{
          html: fTransformNode($(cCustomListSplice_o), sCustomListField_type, sCustomListField_node, sCustomListField_text),
          title: function(){
            //if text was trimmed, add title attribute to column
            if($.trim(sCustomListField_text).length < $.trim($(cCustomListSplice_o).children(sCustomListField_node).text()).length){
             return $(cCustomListSplice_o).children(sCustomListField_node).text()
            }
          }
        })
          .appendTo(oCustomListRow)
          .addClass('custom-index-detail');
      })
      //if topic is 'wip', either highlight it or remove it, depending on whether environment is production or not 
      if($(cCustomListSplice_o).closest('topic[wip]')[0]){
        bProduction ? null : oCustomListRow.find('span').css('background', 'yellow');
        if($($(cCustomListSplice_o).closest('topic[wip]')[0]).attr('wip').toLowerCase().indexOf('new')>=0){
          bProduction 
            ? oCustomListRow.find('a').removeAttr('href')
            : null
        }  
      }    
    })
   
    setTimeout(function(){
      fBuildCustomList_build(oCustomList, cCustomListNode, cCustomListField, oLoadMessage, cCustomListPipe);  
    },15)
  }
  else{
    oLoadMessage.remove();
    fStyleMultiColumnIndex(oCustomList)
    oCustomList.hide();
    oCustomList.find('.index-link-container').show();
    oCustomList.fadeIn('fast',function(){
      fBuildCustomList_scope(cCustomListPipe)
    });
    fBuildTopicShortcut();
  }
}

function fBuildCustomList_scope(cCustomListPipe){
  if(cCustomListPipe[0]){
    //collect the data stored in the custom-list object
    var oCustomList = $('#' + cCustomListPipe.splice(0,1));
    var oLoadMessage = oCustomList.data('loading');
    var cCustomListFilter = oCustomList.data('filter');
    var cCustomListSource = oCustomList.data('source');
    var cCustomListOrder  = oCustomList.data('order');
    var cCustomListField  = oCustomList.data('field');
    
    jqXHR.done(function(){
      var cCustomListScope  = fScopeCollection(oCustomList, cCustomListFilter, cCustomListSource, cCustomListOrder);
      fBuildCustomList_build(oCustomList, cCustomListScope, cCustomListField, oLoadMessage, cCustomListPipe);
    })
  }  
}

function fBuildCustomIndex(){
  if($('div[id|=custom-index]').length>0){
    var iHangingIndent = 15;
    var oCustomIndex = $('div[id|=custom-index]').addClass('index')
    var oCustomFilter = $('div[id|=custom-filter]').children('span').remove();
    var cCustomField = $('div[id|=custom-index]').children('span').remove();
    var sFileName = $('meta[name=Filename]').attr("content");
    var oLoadMessage = $('<div/>').appendTo($('div[id|=custom-index]'))
      .append($('<img/>',{src: '../../theme/graphic/cue_loading.gif', align: 'middle', hspace: 10}))
      .append($('<span/>',{text: 'Loading index, this may take a while...'}))
    jqXHR.done(function(){
      oLoadMessage.remove();
      var oFileNode = $($oDocRoot).find("link:contains(" +sFileName + ")").parent('topic');
      var cChildNode = oCustomFilter.length >0 
        ? oFileNode.children('topic:has(' +oCustomFilter.attr('class') + ':contains(' +oCustomFilter.text() + '))')
        : oFileNode.children('topic');
      var cChildNode_skip = oFileNode.children(':not(topic)');
      var cChildNode_sort = cChildNode.map(function(){
        return $(this).children(cCustomField.attr('class')).text() + 'oRowIndex:' + $(this).index()  
      }).get().sort()
    
      $(cChildNode_sort).each(function(cChildNode_i, cChildNode_t){
        var iRowIndex = Number((cChildNode_t.substring(cChildNode_t.lastIndexOf('oRowIndex:'))).replace('oRowIndex:',''))
        var cChildNode_o = oFileNode.children().eq(iRowIndex);
        var oLinkContainter = $('<div/>')
          .appendTo(oCustomIndex)
          .css("margin-left", iHangingIndent)
          .addClass('index-link-container')
          
        $(cCustomField).each(function(cCustomField_i, cCustomField_o){
            var sNodeName = $(cCustomField_o).attr('class');
            var oElement;
            if(sNodeName=='title'){
              oElement = $('<a/>', {
                href: $(cChildNode_o).children("link").text(),
                text: $(cChildNode_o).children("title").text()})
              fSetHyperlinkAttr(oElement) }
            else{
               oElement = $('<span/>', {
                 text: $(cChildNode_o).children(sNodeName).text()})
            }
            oElement
              .appendTo(oLinkContainter)
              .addClass('custom-index-detail')
        })
      })
      fStyleMultiColumnIndex(oCustomIndex)
    })
  }
}

function fBuildCustomSelector(){
  /*future enhancement*/
}

function fBuildFlexiTable(){
  if($('div[id|=custom-table]').not('[flagged]')[0]){
    var sFileName = $('meta[name=Filename]').attr("content");
    var cFlexiTable = $('div[id|=custom-table]').not('[flagged]').attr('flagged', 'true');
    var cFlexiPipe = [];
    
    cFlexiTable.each(function(cFlexiTable_i, cFlexiTable_o){
      var oFlexiContainer = $(cFlexiTable_o).addClass('table-index')
      var cFlexiFilter = $(cFlexiTable_o).children('span.filter').remove();
      var cFlexiSource = $(cFlexiTable_o).children('span.source').remove();
      var cFlexiHeader = $(cFlexiTable_o).children('span.header').remove();
      var cFlexiOrder = $(cFlexiTable_o).children('span.order').remove();
      var cFlexiField = $(cFlexiTable_o).children('span').remove();
      var oLoadMessage = fStyleLoadingIndicator($(cFlexiTable_o));

      //create the generic table, based on the cFlexiField collection
      var sColumn_label = cFlexiField.map(function(){return $(this).text()}).get().join(', ')
      var sColumn_type = cFlexiField.map(function(){return $(this).attr('class')}).get().join(', ')
      var oFlexiTable = fGenericBuildTable($(cFlexiTable_o), sColumn_label, sColumn_type);
      
      //store the collections as data to the table object
      //these data will be collected later by BuildFlexiPipe
      oFlexiTable.data('filter', cFlexiFilter);
      oFlexiTable.data('source', cFlexiSource);
      oFlexiTable.data('field', cFlexiField);
      oFlexiTable.data('loading', oLoadMessage);
      oFlexiTable.hide().find('tr th').addClass('sort-header');
      cFlexiPipe.push($(cFlexiTable_o).attr('id'));
      
      //if cFlexiHeader exists, create a table header/banner
      if(cFlexiHeader[0]){
        oFlexiTable.prepend(
          $('<tr />').append(
            $('<th>', {
              html: cFlexiHeader.text(), 
              colspan: cFlexiField.length })
              .addClass(cFlexiHeader.attr('title'))
              .addClass('head')
          )
        )
      }
    })

    //scope the content of each table
    fBuildFlexiTable_scope(cFlexiPipe);
  }
}

function fBuildFlexiTable_build(oFlexiTable, cFlexiNode, cFlexiField, oLoadMessage, cFlexiPipe){
  if(cFlexiNode.length>0){
    var cFlexiSplice = cFlexiNode.splice(0,10);
    $(cFlexiSplice).each(function(cFlexiSplice_i, cFlexiSplice_o){
      var oFlexiRow = $('<tr/>').appendTo(oFlexiTable);
      $(cFlexiField).each(function(cFlexiField_i, cFlexiField_o){
        var sFlexiField_type = $(cFlexiField_o).attr('class');
        var sFlexiField_node = $(cFlexiField_o).attr('title');
        var sFlexiField_text ;
        //is sFlexiField_node equal to 'revision', and is there at least 1 log entry under it?
        //if so, set sFlexiField_text to the date attribute of revision log in index position 0
        //else, set sFlexiField_text to the value of the sFlexiField_node's node 
        if(sFlexiField_node == 'revision'){
          if($(cFlexiSplice_o).children(sFlexiField_node)[0]
          && $(cFlexiSplice_o).children(sFlexiField_node).children('log[date]')[0]){
            var sFlexiField_text = $(cFlexiSplice_o)
              .children(sFlexiField_node)
              .children('log[date]').attr('date'); }
          else if($(cFlexiSplice_o).children('issue')[0]){
            sFlexiField_text = $(cFlexiSplice_o).children('issue').text(); } }
        else{
          sFlexiField_text = $(cFlexiSplice_o).children(sFlexiField_node).text(); 
          sFlexiField_text = sFlexiField_text.replace(/\[/g, "<").replace(/\]/g, ">"); }
             
        var oFlexiColumn = $('<td/>',{
          valign: 'top',
          html: fTransformNode(cFlexiSplice_o, sFlexiField_type, sFlexiField_node, sFlexiField_text),
          title: function(){
            //if text was trimmed, add title attribute to column
            if($.trim(sFlexiField_text).length < $.trim($(cFlexiSplice_o).children(sFlexiField_node).text()).length){
               return $(cFlexiSplice_o).children(sFlexiField_node).text()
            }
          }
        }).appendTo(oFlexiRow)
        
        //if topic is 'wip', either highlight it or remove it, depending on whether environment is production or not 
        if($(cFlexiSplice_o).closest('topic[wip]')[0]){
          bProduction ? null : oFlexiRow.find('a, span').css('background', 'yellow');
          if($($(cFlexiSplice_o).closest('topic[wip]')[0]).attr('wip').toLowerCase().indexOf('new')>=0){
            bProduction 
              ? oFlexiColumn.remove()
              : null
          }  
        }
      })  
    })
    
    setTimeout(function(){
      fBuildFlexiTable_build(oFlexiTable, cFlexiNode, cFlexiField, oLoadMessage, cFlexiPipe);  
    },15)
  }
  else{
    //when content for current table has completely loaded:
    //1. remove the loading message
    //2. sort the content of the table
    //3. fadeIn the table
    oLoadMessage.remove();
    oFlexiTable.find('th[class|=sort-header]')[0].click();
    oFlexiTable.find('th[class|=sort-header]')[0].click();
    
    if(oFlexiTable.find('td').length == 0){
       var cusTableNote = $('<span>').html('There is no active ' +  $(oFlexiTable).find('th').eq(0).text() + ' for this product at the moment.')
         var emptyMessage = $('<div/>')
                            .addClass('note')
                            .insertAfter($(oFlexiTable)).hide()
                            .append($('<div/>').text('Note:').addClass('note-label'))
                            .append($('<div/>').html(cusTableNote).addClass('note-text'))
                            .css('max-width', '470px')
        $(emptyMessage).fadeIn('fast', function(){})
        setTimeout(function(){
            if(cFlexiPipe.length==0){
              fBuildTopicShortcut(); }
            else{
              fBuildFlexiTable_scope(cFlexiPipe); }
        },20)
    }
    else{
      oFlexiTable.fadeIn('fast',function(){
      //if there's no more object in the cFlexiPipe, add topic shortcut as needed
      //otherwise, continue to build table based on object in the cFlexiPipe
      setTimeout(function(){
        if(cFlexiPipe.length==0){
          fBuildTopicShortcut(); }
        else{
          fBuildFlexiTable_scope(cFlexiPipe); }
      },20)
    });
    }
  }
}

function fBuildFlexiTable_scope(cFlexiPipe){
  if(cFlexiPipe[0]){
    //collect the data stored in the custom-list object
    var oFlexiTable = $('#' + cFlexiPipe.splice(0,1)).children('table');
    var oLoadMessage = oFlexiTable.data('loading');
    var cFlexiFilter = oFlexiTable.data('filter');
    var cFlexiSource = oFlexiTable.data('source');
    var cFlexiOrder  = oFlexiTable.data('order');
    var cFlexiField  = oFlexiTable.data('field');
    
    jqXHR.done(function(){
      var cFlexiNodeScope = fScopeCollection(oFlexiTable, cFlexiFilter, cFlexiSource, cFlexiOrder);
      fBuildFlexiTable_build(oFlexiTable, cFlexiNodeScope, cFlexiField, oLoadMessage, cFlexiPipe);
    })
  }  
}

function fBuildCustomTable(){
  if($('div[id|=techtip]').length>0){
    var cTechTip = $('div[id|=techtip]');
    var sFileName = $('meta[name=Filename]').attr("content");
    
    cTechTip.each(function(cTechTip_i, cTechTip_o){
      var sTechTip_type = $(cTechTip_o).attr('id').replace('techtip-', '')
      var cFilter = $(cTechTip_o).children('span.filter').remove();
      var cColumn = $(cTechTip_o).children('span').remove();
      var oLoadMessage = $('<div/>').appendTo($(cTechTip_o))
        .append($('<img/>',{src: '../../theme/graphic/cue_loading.gif', align: 'middle', hspace: 10}))
        .append($('<span/>',{text: 'Loading index, this may take a while...'}))

      jqXHR.done(function(){
        oLoadMessage.remove();
        var sColumn_label = cColumn.map(function(){return $(this).text()}).get().join(', ')
        var sColumn_type = cColumn.map(function(){return $(this).attr('class')}).get().join(', ')
        var oTechTipTable = fGenericBuildTable($(cTechTip_o), sColumn_label, sColumn_type);
        $(oTechTipTable).find('tr th').addClass('sort-header');
        
        var oTechTipNode = $($oDocRoot);
        $(cFilter).each(function(cFilter_i, cFilter_o){
          var sFilter_node = $(cFilter_o).attr('title');
          var sFilter_text = $(cFilter_o).text();
          oTechTipNode = oTechTipNode.find(sFilter_node + ":contains('" +sFilter_text+ "')").parent('topic')
        })

        oTechTipNode = oTechTipNode
          .find("applicability:contains('" +sFileName+ "')")
          .siblings("type:contains(" +sTechTip_type + ")").parent('topic');

        $(oTechTipNode).each(function(oTechTipNode_i, oTechTipNode_o){
          var oTechTipRow = $('<tr/>').appendTo(oTechTipTable)
          $(cColumn).each(function(cColumn_i, cColumn_o){
            var sColumn_type = $(cColumn_o).attr('class');
            var sColumn_node = $(cColumn_o).attr('title');
            //is sColumn_node equal to 'revision', and is there at least 1 log entry under it?
            //if so, set sColumn_text to the date attribute of revision log in index position 0
            //else, set sColumn_text to the value of the sColumn_mnde's node 
            if(sColumn_node == 'revision'){
              if($(oTechTipNode_o).children(sColumn_node)[0]
              && $(oTechTipNode_o).children(sColumn_node).children('log[date]')[0]){
                var sColumn_text = $(oTechTipNode_o)
                  .children(sColumn_node)
                  .children('log[date]').attr('date'); }
              else if($(oTechTipNode_o).children('issue')[0]){
                var sColumn_text = $(oTechTipNode_o).children('issue').text(); } }
            else{
              var sColumn_text = $(oTechTipNode_o).children(sColumn_node).text(); 
              sColumn_text = sColumn_text.replace(/\[/g, "<").replace(/\]/g, ">"); }
              
            var oColumn_val;
            var oTechTipCol = $('<td/>',{
              valign: 'top',
              html: function(){
                //if class contains 'trim', trim the text to the desired length
                if(sColumn_type.indexOf('trim-')>-1){
                  var iLimit = sColumn_type.substring(sColumn_type.indexOf('trim-')).replace('trim-', '');
                  sColumn_text = fGenericShortenText(sColumn_text, iLimit)
                }
                //if class contains 'link', create oColumn_val, which is a link object 
                if(sColumn_type.indexOf('link')>-1){
                  if($(oTechTipNode_o).children(sColumn_node).siblings('link').length>0){
                    var sFileType = $(oTechTipNode_o).children(sColumn_node).siblings('link').text()
                     .substring($(oTechTipNode_o).children(sColumn_node).siblings('link').text()
                       .lastIndexOf(".")
                     ).toUpperCase()
                    if(sFileType!=".PNG" && sFileType!=".GIF" && sFileType!=".JPG"){
                      oColumn_val = $('<a/>',{
                        href: $(oTechTipNode_o).children(sColumn_node).siblings('link').text(),
                        html: sColumn_text }) }
                    else{
                      oColumn_val = $('<span/>',{
                        html: sColumn_text,
                        click: function(){
                          var oModalCanvass = fCreateModalBackground(2);
                          var cRef_o = $(this).siblings('.ref-target').clone();
                          fStyleModalLoader(cRef_o, oModalCanvass)
                        }
                      }).addClass('ref-modal') 
                    }
                  }  
                }
                //if current column is 'description', check if there is a corresponding sibling link node;
                //if there is none, create oColumn_val, which is a link object that points to 'supersededby'
                if(sColumn_node=='description' 
                && $(oTechTipNode_o).children(sColumn_node).siblings('link').length==0
                && $(oTechTipNode_o).children(sColumn_node).siblings('supersededby').length>0){
                  oColumn_val = $('<a/>',{
                    href: $(oTechTipNode_o).children(sColumn_node).siblings('supersededby').text(),
                    html: sColumn_text
                  })
                }
                //if oColumn_val exists and it a link object, add the correct target attribute
                //if oColumn_val is a span and class is 'ref-modal', set the 'ref-target' object
                //else set sColumn_text as oColumn_val
                if(oColumn_val && $(oColumn_val).is('a')){
                  oColumn_val.attr('target', function(){
                    var sFileType = oColumn_val.attr('href').substring(oColumn_val.attr('href').lastIndexOf('.')+1).toUpperCase();
                    return sFileType == 'HTM' ? '_self' : '_blank';  
                  })}
                else if(oColumn_val && $(oColumn_val).is('span') && $(oColumn_val).attr('class')=='ref-modal'){
                  var sFileName = $(oTechTipNode_o).children(sColumn_node).siblings('link').text()
                  oColumn_val = $('<span/>',{
                    html: oColumn_val })
                  oColumnImgHolder = $('<span/>')
                    .addClass('ref-target')
                    .appendTo(oColumn_val)
                  var oColumnImg = $('<img/>',{
                    src: sFileName})
                    .appendTo(oColumnImgHolder)
                }  
                else{
                  oColumn_val = sColumn_text; }
                  
                return oColumn_val;
              },
              title: function(){
                //if text was trimmed, add title attribute to column
                if($.trim(sColumn_text).length < $.trim($(oTechTipNode_o).children(sColumn_node).text()).length){
                   return $(oTechTipNode_o).children(sColumn_node).text()
                }
              }
            }).appendTo(oTechTipRow)
          })
        })
      })
    })
  }
}

function fBuildDocumentFavButton(){
  //1. If there's favorite node(s) in CLR, create Favorite button
  //2. Bind mousedown and mouseup events to the Favorite button
  if($($oDocRoot).find("favorite").length > 0){
    $('<span/>',{
      id:'menu-button-favorite',
      text: 'Field Favorites',
      mousedown: function(){
        $(this).attr("class","menu-button-select");},
      mouseup: function(){
        $(this).attr("class","menu-button");
        jqXHR.done(function(){
          if($('#menu-holder-favorite').length==0){
            fClearAllMenuHolder()
            fBuildDocumentFavorite();}
          else {
            $('#menu-holder-favorite').remove();  
          }
        })
      }
    })
    .appendTo('#menu-bar')
    .addClass('menu-button')
  }
}

function fBuildDocumentFavorite(){
  //1. Create oDocumentFavoriteHolder = div that will hold the document favorite
  //2. Get cFavoriteNode = all favorite nodes
  //3. Write all favorites with cFavoriteNode.each loop
    
  var oDocumentFavoriteHolder = $('<div/>',{
    id:'menu-holder-favorite'})
    .appendTo('body')
    .addClass('menu-holder')
    .css("left", function(){return $('#menu-button-favorite').offset().left});
    
  var cFavoriteNode = $($oDocRoot).find("favorite");
  cFavoriteNode.each(function(cFavoriteNode_i, cFavoriteNode_o){
    var oLinkContainter = $('<div/>').appendTo(oDocumentFavoriteHolder)
    
    var oLink = $('<a/>', {
      href: $(cFavoriteNode_o).children("link").text(),
      text: $(cFavoriteNode_o).children("title").text()}) 
    .appendTo(oLinkContainter);
    fSetHyperlinkAttr(oLink)
  })
}

function fBuildDocumentFooter(){
  jqXHR.done(function(){
    var sDocYear = $oDocRoot.getAttribute('released')
    var sThisYear = (new Date).getFullYear();
    var sDate = sDocYear == sThisYear ? sThisYear : sDocYear + '-' + sThisYear
    
    $('<div/>', {
      id: 'copyright',
      html: '<span>Vertiv Confidential and Proprietary Information</span>'
      +'<br/>&copy ' +sDate + ' Vertiv Co. All Rights Reserved.'
      +'<br/>Last Updated: ' + $('meta[name=Revised]').attr("content")
    })
    .appendTo('body')
    .addClass('copyright')
    
    $('#copyright').find('span').css({
        'font-size': '1.1em',
        'font-weight': 'bold',
        margin: '5px'
    })
    
  })
}

function fBuildDocumentHistory(){
  if($('div[id|=revision-history]')[0]){
    jqXHR.done(function(){
      var cHistoryNode;
      
      //create cRevisedYear, a collection of years the doc was revised
      var cRevisedYear = [];
      var cRevisedNode = $($oDocRoot).find('log');
      $(cRevisedNode).each(function(cRevisedNode_i, cRevisedNode_o){
        var oDate = new Date($(cRevisedNode_o).attr('date'));
        !isNaN(oDate) && $.inArray(oDate.getFullYear(), cRevisedYear) == -1
        ? cRevisedYear.push(oDate.getFullYear()) : null ;
      })
      
      //if doc has been revised across multiple years, create a <select> element
      //when user selects a year from list, display the logs for the selected year
      if(cRevisedYear.length > 1){
        cRevisedYear.sort().reverse();
        var oFilterDiv = $('<div/>', {
          id: 'revision-filter' })
          .appendTo($('#revision-history'))
        var oFilterTxt = $('<span/>', { 
          text: 'Select a year from the drop-down list: ' })
          .appendTo(oFilterDiv)
        var oFilterOpt = $('<select/>', {
          change: function(){
            $('#revision-history').children('table').remove();
            cHistoryNode = $($oDocRoot).find('log[date$='+ oFilterOpt.val() +']');
            fBuildDocumentHistory_prep(cHistoryNode);
            fStyleSortableTable();
          }
        })
        
        //add the revision years to the <select> element
        $(cRevisedYear).each(function(cRevisedYear_i, cRevisedYear_v){
          $('<option/>', {
            value: cRevisedYear_v,
            text: cRevisedYear_v })
            .appendTo(oFilterOpt)
        })
        
        oFilterOpt.appendTo(oFilterDiv)
        cHistoryNode = $($oDocRoot).find('log[date$='+ oFilterOpt.val() +']');
      }
      else {
        cHistoryNode = cRevisedNode;
      }
      
      fBuildDocumentHistory_prep(cHistoryNode);      
    })
  }
}

function fBuildDocumentHistory_prep(cHistoryNode){
  var oHistoryDiv  = $('div[id|=revision-history]');
  var sHistoryCol  = 'Revision, Topic, Revision Details';
  var sHistoryTyp  = 'date, link, text';
  var oHistoryTab  = fGenericBuildTable(oHistoryDiv, sHistoryCol, sHistoryTyp);
  var oLoadMessage = fStyleLoadingIndicator(oHistoryDiv);
  
  oHistoryTab.hide();
  oHistoryTab.find('tr th').addClass('sort-header');
  fBuildDocumentHistory_build(oHistoryTab, cHistoryNode, oLoadMessage)
}

function fBuildDocumentHistory_build(oHistoryTable, cHistoryNode, oLoadMessage){
  if(cHistoryNode.length>0){
    var cHistorySplice = cHistoryNode.splice(0,5);
    
    $(cHistorySplice).each(function(cHistorySplice_i, cHistorySplice_o){
      var sDate  = $(cHistorySplice_o).attr('date');
      var sTopic = fGenericShortenText($(cHistorySplice_o).closest('topic').children('title').text(), 30)
      var sLink  = fGenericBuildHyperLink(sTopic, $(cHistorySplice_o).closest('topic').children('link').text());
      var sDesc  = fGenericShortenText($(cHistorySplice_o).text(), 100);
          sDesc  = sDesc.replace(/\[/g, "<").replace(/\]/g, ">");

      sLink.css({
        background: function(){
          //if log entry is for a wip, and it is the latest entry for that wip
          //or, if log entry is a descendant of a wip that is a new topic ? 
          //highlight the log if environment is non-production
          if(($(cHistorySplice_o).parent().parent().attr('wip')
           && $(cHistorySplice_o).index()==0)
          || ($(cHistorySplice_o).closest('topic[wip]').length>0
           && $(cHistorySplice_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0)){
            return bProduction ? $(this).css('background') : 'yellow' ; }
        } 
      })
    
      var oHistoryNode = $('<tr />')
        .appendTo($('div[id|=revision-history]').find('table'))
        .append($('<td />',{html: sDate, valign: 'top' }))
        .append($('<td />',{html: sLink, valign: 'top' }))
        .append($('<td />',{html: sDesc, valign: 'top' }))
        .css({
          display: function(){
            //if log entry is for a wip, and it is the latest entry for that wip
            //or, if log entry is a descendant of a wip that is a new topic ? 
            //hide the log if environment is production
            if(($(cHistorySplice_o).parent().parent().attr('wip')
             && $(cHistorySplice_o).index()==0)
            || ($(cHistorySplice_o).closest('topic[wip]').length>0
             && $(cHistorySplice_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0)){
              return bProduction ? 'none' : $(this).css('display'); }  
          }  
        })
    })

    setTimeout(function(){
      fBuildDocumentHistory_build(oHistoryTable, cHistoryNode, oLoadMessage);  
    },15)
  }
  else{
    oLoadMessage.remove();
    oHistoryTable.find('th[class|=sort-header]')[0].click();
    oHistoryTable.find('th[class|=sort-header]')[0].click();
    oHistoryTable.fadeIn('fast');
  }
}

function fBuildDocumentMenu(){
  $('<div/>',{id:'menu-bar'}).appendTo('body');
  var cHistory = fTrackDocumentHistory();
  jqXHR.done(function(){
    fBuildPartsButton();
    fBuildTopicMapButton(cHistory);
    fBuildDocumentFavButton();
    //fBuildDocumentSearch();
    fBuildTopicHistButton();
    fBuildTopicHertButton();
    fBuildTopicSafetyButton();
    fBuildTopicIdButton();
    
    fSetDocumentMenuWidth($('#menu-bar'));
  })
}

function fSetDocumentMenuWidth(menu){
    var menuSpan = menu.children('span')
    var menuWidth = 0
    $(menuSpan).each(function(){
        menuWidth = menuWidth + $(this).outerWidth()
    })
    $(menu).css('min-width', menuWidth + 'px')
}

function fBuildDocumentSearch(){
  $('<span/>',{
    id:'menu-button-search',
    text: 'Quick Search',
    mousedown: function(){
      $(this).attr("class","menu-button-select");},
    mouseup: function(){
      $(this).attr("class","menu-button");
    }
  })
  .appendTo('#menu-bar')
  .addClass('menu-button')
}

function fBuildDocumentSafety(){
  //1. Create oDocumentSafetyHolder = div that will hold the document safety reminders
  //2. Get cSafetyNode = all safety nodes
  //3. Write all safety nodes with cSafetyNode.each loop
    
  var oDocumentSafetyHolder = $('<div/>',{
    id:'menu-holder-safety'})
    .appendTo('body')
    .addClass('menu-holder')
    .css("left", function(){return $('#menu-button-safety').offset().left});
    
  var sFileName = $('meta[name=Filename]').attr("content");  
  var cSafetyNode = $($oDocRoot).find("safety");
  cSafetyNode = cSafetyNode.find("applicability:contains(" +sFileName + ")").parent();
  
  cSafetyNode.each(function(cSafetyNode_i, cSafetyNode_o){
    var oLink = $('<a/>', {
      href: $(cSafetyNode_o).children("link").text(),
      text: $(cSafetyNode_o).children("title").text()}) 
    .appendTo(oDocumentSafetyHolder);
    fSetHyperlinkAttr(oLink)
  })
}

function fBuildRootMap(){
  var oDocumentMapHolder = $('<div/>',{
    id:'menu-holder-map'})
    .appendTo('body')
    .addClass('menu-holder');
  var oSectionHolder = $('<div/>')
    .appendTo(oDocumentMapHolder)
    .addClass('menu-holder-section')
  var cFileNode = $($oDocRoot).children('topic');

  cFileNode.each(function(cFileNode_i, cFileNode_o){
    var oLinkContainter = $('<div/>')
      .appendTo(oSectionHolder)
      .append($('<a/>', {
          href: $(cFileNode_o).children("link").text(),
          text: $(cFileNode_o).children("title").text()})
        .css({
          background: function(){
            //is top-level topic a wip ?
            //if so, and environment is non-prod, highlight the top-level topic :
            //if environment is production, do not highlight the topic ;
            if($(cFileNode_o).attr('wip')){
              return bProduction ? $(this).css('background') : 'yellow'; }
          }  
        })
      )
      .css({
        display: function(){
          //is top-level topic a wip && is it a new section ?
          //if so, and environment is non-prod, keep it displayed :
          //if environment is production, hide the wip ;
          if($(cFileNode_o).attr('wip')
          && $(cFileNode_o).attr('wip').toLowerCase().indexOf('new')>=0){
            return bProduction ? 'none' : $(this).css('display'); }  
        }  
      })

    fSetHyperlinkAttr(oLinkContainter.children('a'));
  })
}

function fBuildTopicHert(){
  //1. Create oDocumentHertHolder = div that will hold the HERT links
  //2. Get cHertNode = all HERT nodes
  //3. Write all HERT nodes with cHertNode.each loop
    
  var oDocumentHertHolder = $('<div/>',{
    id:'menu-holder-hert'})
    .appendTo('body')
    .addClass('menu-holder')
    .css("left", function(){return $('#menu-button-hert').offset().left});

  var sFileName = $('meta[name=Filename]').attr("content");  
  var cHertNode = $($oDocRoot).find("hert");
  cHertNode = cHertNode.find("applicability:contains(" +sFileName + ")").parent();
  
  cHertNode.each(function(cHertNode_i, cHertNode_o){
    var oLink = $('<a/>', {
      href: $(cHertNode_o).children("link").text(),
      text: $(cHertNode_o).children("title").text()}) 
    .appendTo(oDocumentHertHolder);
    fSetHyperlinkAttr(oLink)
  })
}

function fBuildTopicHertButton(){
  //1. Get sFileName = name of current file based on Filename meta tag
  //2. Get cHertNode = node(s) that contain sFileName (as "applicability")
  //3. Create Document HERT button if cHertNode count is not zero.
  //4. Bind mousedown and mouseover events
  var sFileName = $('meta[name=Filename]').attr("content");
  var cHertNode = $($oDocRoot).find("hert")
  cHertNode = cHertNode.find("applicability:contains(" +sFileName + ")").parent('hert');
  if(cHertNode.length > 0){
    $('<span/>',{
      id:'menu-button-hert',
      text: 'HERT Chart',
      mousedown: function(){
        $(this).attr("class","menu-button-select");},
      mouseup: function(){
        $(this).attr("class","menu-button");
        $(this).css('background-color', 'red');
        jqXHR.done(function(){
          if($('#menu-holder-hert').length==0){
            fClearAllMenuHolder()
            fBuildTopicHert();}
          else {
            $('#menu-holder-hert').remove();  
          }
        })
      }
    })
    .appendTo('#menu-bar')
    .addClass('menu-button')
    .css('background-color', 'red');
  }
}

function fBuildTopicHistButton(){
  //1. Get sFileName = name of current file based on Filename meta tag
  //2. Get cFileNode = topic node(s) where sFileName appears
  //3. Get iHistLogs = count logs for the cFileNode with cFileNode.each loop
  //4. Create Document History button if iHistLogs is not zero.
  //5. Bind mousedown and mouseover events

  var sFileName = $('meta[name=Filename]').attr("content");
  var cFileNode = $($oDocRoot).find("link:contains(" +sFileName + ")").parent('topic');
  var iHistLogs = 0;
  cFileNode.each(function(cFileNode_i, cFileNode_o){
    iHistLogs = iHistLogs + $(cFileNode_o).children('revision').find('log').length; })
  if(iHistLogs > 0){
    $('<span/>',{
      id:'menu-button-history',
      text: 'Topic History',
      mousedown: function(){
        $(this).attr("class","menu-button-select");},
      mouseup: function(){
        $(this).attr("class","menu-button");
        jqXHR.done(function(){
          if($('#menu-holder-history').length==0){
            fClearAllMenuHolder()
            fBuildTopicHistory();}
          else {
            $('#menu-holder-history').remove();  
          }
        })
      }
    })
    .appendTo('#menu-bar')
    .addClass('menu-button')
  }
}

function fBuildTopicHistory(){
  //1. Create oDocumentHistoryHolder = div that will hold the document history
  //2. Get sFileName = name of current file based on Filename meta tag
  //3. Get cFileNode = topic node(s) where sFileName appears
  //4. Get cRevisionNode = all logs directly under the cFileNode
  //5. Write the logs of cFileNode with cRevisionNode.each loop
    
  var oDocumentHistoryHolder = $('<div/>',{
    id:'menu-holder-history'})
    .appendTo('body')
    .addClass('menu-holder')
    .css("left", function(){return $('#menu-button-history').offset().left});
    
  var sFileName = $('meta[name=Filename]').attr("content");
  var cFileNode = $($oDocRoot).find("link:contains(" +sFileName + ")").parent('topic');
    
  cFileNode.each(function(cFileNode_i, cFileNode_o){
    var cRevisionNode = $(cFileNode_o).children('revision').find('log');
    cRevisionNode.each(function(cRevisionNode_i, cRevisionNode_o){
        $('<div/>',{
          html: "<span>" + $(cRevisionNode_o).attr('date') + "</span>   " + $.trim($(cRevisionNode_o).text()).replace(/\[/g, "<").replace(/\]/g, ">")
        })
        .appendTo(oDocumentHistoryHolder)
        .css({
          background: function(){
            //is this log entry the latest revision entry for a wip ?
            //if so, and environment is non-prod, highlight the log entry 
            if($(cRevisionNode_o).index()==0
            && $(cRevisionNode_o).parent().parent().attr('wip')){
              return bProduction ? $(this).css('background') : 'yellow' ; }
            //else, is log entry a descendant of a wip that is a new topic ?
            //if so, and env is non-prod, highlight the entry (in effect, all revision entries)
            else if($(cRevisionNode_o).closest('topic[wip]').length > 0
            && $(cRevisionNode_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0){
              return bProduction ? $(this).css('background') : 'yellow' ;  
            }  
          },
          display: function(){
            //is this log entry the latest revision entry for a wip ?
            //if so, and environment is production, hide the log entry
            if($(cRevisionNode_o).index()==0
            && $(cRevisionNode_o).parent().parent().attr('wip')){
              return bProduction ? 'none' : $(this).css('display'); }  
            //else, is log entry a descendant of a wip that is a new topic ?
            //if so, and env is prod, hide the entry (in effect, all revision entries)  
            else if($(cRevisionNode_o).closest('topic[wip]').length > 0
            && $(cRevisionNode_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0){
              return bProduction ? 'none' : $(this).css('display') ;  
            }    
          }
        })
    })
  })
}

function fBuildTopicIdButton(){
  var sFileName = $('meta[name=Filename]').attr("content")
    .toUpperCase().replace(".HTM", "");
  
  $('#menu-bar')
    .append($('<span/>', {
      id: 'menu-button-topic',
      text: "Topic ID# ",
      mouseover: function(){
        if(!document.queryCommandSupported('copy')){
          $(this).css('cursor','text'); }},
      mousedown: function(){
        if(document.queryCommandSupported('copy')){
          $(this).attr("class","menu-button-select"); }},
      mouseup: function(){
        if(document.queryCommandSupported('copy')){
          $(this).attr("class","menu-button");
          fSelectObjText('topic-id');
          document.execCommand('copy');
          fSelectObjText('null');
          alert("Topic ID was copied to your clipboard!")
        }}
    }).append($('<span />', {
        id: 'topic-id',
        text: sFileName }))
      .addClass('menu-button')  
  )

  $('#menu-button-topic')
    .css('position', 'absolute')
    .css('right', '0px')
    .css('margin', '0px')
    .css('padding', '0px 5px')
    .css('color', 'orange')
    
}

function fBuildTopicIndex(){
  //1. Get sFileName = name of current file based on Filename meta tag
  //2. Get cFileNode = topic node(s) where sFileName appears
  //3. Get cChildNode = subtopic(s) under the current topic
  //4. Create oIndexHolder = div that will hold the index
  //5. Create the index by looping through cChildNode
  //   cChildNode may need be hidden, so script does just that
  if($('div[id|=index]').length>0){
    jqXHR.done(function(){
      var oIndex = $('div[id|=index]')
        .addClass('index')
        .hide();
      var sFileName = $('meta[name=Filename]').attr("content");
      var cFileNode = $($oDocRoot).find("link:contains(" +sFileName + ")").parent('topic, doc');
      var cChildNode = cFileNode.find('topic');
      var iHangingIndent = 15;
    
      var oIndexHolder = $('<div/>',{
        text: function(){
            return cFileNode.prop('tagName')=='topic'?
             "IN THIS SECTION:" : "WHAT'S INSIDE:" }})
      .appendTo(oIndex)
      .addClass("label")
      
      cChildNode.each(function(cChildNode_i, cChildNode_o){
        var iChildLevel = $(this).parentsUntil(cFileNode).length +1
      
        if(iChildLevel>1 && $(cChildNode_o).children("hide").text()=='true'){
          /*do nothing: do not write link*/ }
        else if($(cChildNode_o).parents('collection-techtip').length==0){
          var oLinkContainter = $('<div/>')
            .appendTo(oIndex)
            .append(
              $('<a/>', {
                  href: $(cChildNode_o).children("link").text(),
                  text: $(cChildNode_o).children("title").text() })
                .css({
                  background: function(){
                    //is topic a wip, or descendant of a wip that is a new section ?
                    //if so, and env is non-prod, highlight the appropriate wips
                    if($(cChildNode_o).attr('wip')
                    ||($(cChildNode_o).closest('topic[wip]').length>0
                    && $(cChildNode_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0)){
                      return bProduction ? $(this).css('background-color') : 'yellow';  
                    }  
                  },
                  marginLeft: function(){
                    return iChildLevel * iHangingIndent;        
                  }  
                })
            )
            .addClass('index-link-container')
            .css({
              //is topic a wip that is a new section, or decendant of a wip that is a new section ?
              //if so, and env is prod, hide the topic (in effect, all descendants of the wip-new)
              display: function(){
                if(($(cChildNode_o).attr('wip')
                 && $(cChildNode_o).attr('wip').toLowerCase().indexOf('new')>=0)
                || ($(cChildNode_o).closest('topic[wip]').length>0)
                 && $(cChildNode_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0){
                  return bProduction ? 'none' : $(this).css('display'); }
                }
            })
          
          fSetHyperlinkAttr(oLinkContainter.children('a'));          
        }
      })
      fStyleMultiColumnIndex(oIndex);
      oIndex.fadeIn('fast');
    })
  }
}

function fBuildTopicMapButton(cHistory){
  var sFileName = $('meta[name=Filename]').attr("content");
  var cFileNode = $($oDocRoot).find("link:contains(" +sFileName + ")").parent('topic');
 
  var bIsRootNode = $($oDocRoot).find("link:contains(" +sFileName + ")").parent('doc')[0] ? true : false;
  var bIsTopicNode = cFileNode[0] ? true : false;
  var bHasParentNode = cFileNode.siblings('link')[0] ? true : false;
  var bIsCollection = cFileNode.parents().filter(function(){
      return $(this).prop('tagName').toLowerCase().indexOf('collection')>-1})[0] ? true : false;

  //if current topic is a wip, highlight topic title
  $('h1').html($('<span />', {
    text: $('h1').text() })
    .css({
      background: function(){
        return !bProduction 
        && (cFileNode.attr('wip')
        || cFileNode.closest('topic[wip*=new]')[0])  
        ? 'yellow' : $('this').css('background'); }
    })
  )

  $('<span/>',{
    id: 'menu-button-map',
    text: function(){
      //if bRootNode, current page is either the home or top-level index
      //if #preview, current page is the home page, so use 'Document Map'
      //otherwise, use 'Back to Home'
      if(bIsRootNode){
        return $('#preview')[0] ? 'Document Map' : 'Back to Home' ; }
      //if current page is a topic node, check if it is part of a collection
      //if it is part of a collection and bHasParentNode, use 'Go To Parent'
      //if it is part of a collection but !bHasParentNode, use 'Back to Index'
      //otherwise, use 'Document Map'
      else if(bIsTopicNode){
        if(bIsCollection){
          return bHasParentNode ? 'Go to Parent' : 'Back to Index' }
        else{
          return 'Document Map' ; }}  
      //if current page is neither a topic node or the root node, use 'Back to Home'
      else  {
        return 'Back to Home'; }
    },
    mousedown: function(){ $(this).attr("class","menu-button-select");},
    mouseup: function(){ $(this).attr("class","menu-button"); 
      jqXHR.done(function(){
        if(!$('#menu-holder-map')[0]){
          fClearAllMenuHolder();
          //if bRootNode, current page is either the home or top-level index
          //if #preview, Document Map button invokes fBuildRootMap()
          //if !#preview, Back to Home button links to home page
          if(bIsRootNode){
            if($('#preview')[0]){fBuildRootMap()}
            else{location.href=$($oDocRoot).children('link').text(); } 
          }
          //if bTopicNode and !bIsCollection, Document Map invokes fBuildTopicMap()
          //if bTopicNode but bIsCollection, check bHasParentNode
          //if bHasParentNode, Go To Parent links to mapped parent
          //if !bHasParentNode, Back to Index links to the appropriate cHistory topic. 
          else if(bIsTopicNode){
            if(bIsCollection){
              if(bHasParentNode){
                location.href = cFileNode.siblings('link').text(); }
              else{
                //if cHistory is a subtopic of the current file, the Back to Index button will loop
                //hence, make sure the selected cHistory is not a subtopic of the current file
                var cSubTopic = cFileNode.find('link').map(function(){return $(this).text()}).get();
                var sTargetIndex;
                for(var i=cHistory.length-1;i>=0;i--){
                  if($.inArray(cHistory[i],cSubTopic)==-1){
                    //if both cHistory[i] and current file are part of collections, 
                    //they will treat each other as index--this will cause a 'loop';
                    //hence, make sure the selected cHistory[i] is not part of collection
                    var oHistNode = $($oDocRoot).find("link:contains(" +cHistory[i] + ")").parent('topic');
                    var bHistIsCollection = oHistNode.parents().filter(function(){
                      return $(this).prop('tagName').toLowerCase().indexOf('collection')>-1})[0] ? true : false;
                    if(oHistNode && !bHistIsCollection){
                      sTargetIndex = cHistory[i];
                      break;     
                    }
                  }
                }
                location.href=sTargetIndex? sTargetIndex : $($oDocRoot).children('link').text();
              }
            }
            else{
              fBuildTopicMap();  }  
          }  
          else  {
            location.href=$($oDocRoot).children('link').text(); }
        }
        else{
          $('#menu-holder-map').remove();  
        }
      })
    }
  }).appendTo('#menu-bar')
    .addClass('menu-button')
}

function fBuildTopicMap(){
  //1. Create oDocumentMapHolder = div that will hold the document map
  //2. Get sFileName = name of current file based on Filename meta tag
  //3. Get cFileNode = topic node(s) where sFileName appears
  //4. Get cParentNode = ancestors of the cFileNode node(s)
  //5. Write the ancestors of cFileNode with cParentNode.each loop
  //6. Write the siblings of cFileNode with cSiblingNode.each loop
  
  var iHangingIndent = 9; 
  var oDocumentMapHolder = $('<div/>',{
    id:'menu-holder-map'})
    .appendTo('body')
    .addClass('menu-holder');
  var sFileName = $('meta[name=Filename]').attr("content");
  var cFileNode = $($oDocRoot).find("link:contains(" +sFileName + ")").parent('topic');
  //trace ancestors  
  cFileNode.each(function(cFileNode_i, cFileNode_o){
    var cParentNode = $($(cFileNode_o).parents().toArray().reverse());
    var oSectionHolder = $('<div/>')
      .appendTo(oDocumentMapHolder)
      .addClass('menu-holder-section');
      
    cParentNode.each(function(cParentNode_i, cParentNode_o){
      var oLinkContainter = $('<div/>')
        .appendTo(oSectionHolder)
        .append($('<a/>', {
            href: $(cParentNode_o).children("link").text(),
            text: $(cParentNode_o).children("title").text()})
          .css({
            background: function(){
              //is ancestor topic a wip, or is it descendant of a wip for a new topic ?
              //if so, and environment is non-production, highlight it
              if($(cParentNode_o).attr('wip')
              ||($(cParentNode_o).closest('topic[wip]').length>0
              && $(cParentNode_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0)){
                return bProduction ? $('this').css('background') : 'yellow' ; }},
            marginLeft: function(){
              return cParentNode_i * iHangingIndent; }  
          })
        )
        
      fSetHyperlinkAttr(oLinkContainter.children('a'));
    })
    
    //get siblings
    var cSiblingNode = $(cFileNode_o).parent().children("topic");
    cSiblingNode.each(function(cSiblingNode_i, cSiblingNode_o){
      if($(cSiblingNode_o).children("link").text()==sFileName){
        var oSpanContainter = $('<div/>')
          .appendTo(oSectionHolder)
          .append($('<span/>', {
            text: $(cSiblingNode_o).children("title").text() })
            .css({
              background: function(){
                //is current topic a wip, or a descendant of a wip that is a new section ?
                //if so, and envirnoment is non-production, highlight the wip
                if($(cSiblingNode_o).attr('wip')
                ||($(cSiblingNode_o).closest('topic[wip]').length>0
                && $(cSiblingNode_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0)){
                  return bProduction ? $(this).css('background-color') : 'yellow'; }},
              marginLeft: function(){
                return (cParentNode.length) * iHangingIndent;}
            })
            .addClass("selected"))
      }
      else if($(cSiblingNode_o).children("hide").text()=='true'){
          /*do nothing: do not write link*/ }
      else{
        var oLinkContainter = $('<div/>')
          .appendTo(oSectionHolder)
          .append($('<a/>',{
              href: $(cSiblingNode_o).children("link").text(),
              text: $(cSiblingNode_o).children("title").text()})
            .css({
              background: function(){
                //is sibling topic a wip, or a descendant of a wip that is a new section ?
                //if so, and envirnoment is non-production, highlight the wips
                if($(cSiblingNode_o).attr('wip')
                ||($(cSiblingNode_o).closest('topic[wip]').length>0
                && $(cSiblingNode_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0)){
                  return bProduction ? $(this).css('background-color') : 'yellow'; }},
              marginLeft: function(){
                return (cParentNode.length) * iHangingIndent  }})
          )
          //is sibling topic a wip that is new, or a descendant of a wip that is new ?
          //if so, and environment is production, hide the sibling topic
          .css({
            display: function(){
              if(($(cSiblingNode_o).attr('wip') 
               && $(cSiblingNode_o).attr('wip').toLowerCase().indexOf('new')>=0)
              || ($(cSiblingNode_o).closest('topic[wip]').length>0
               && $(cSiblingNode_o).closest('topic[wip]').attr('wip').toLowerCase().indexOf('new')>=0)){
                return bProduction ? 'none' : $(this).css('display'); }}    
          })  
        
        fSetHyperlinkAttr(oLinkContainter.children('a'));
      }
    })
  })
}

function fBuildTopicPreview(){
  if($('#preview').length>0){
    jqXHR.done(function(){
      var sFileName = $('meta[name=Filename]').attr("content");
      var cFileNode = $($oDocRoot).find("link:contains(" +sFileName + ")").parent('topic, doc');
      var oIndexHolder = $('<div/>',{
        text: function(){
          return cFileNode.prop('tagName')=='topic'?
          "IN THIS SECTION:" : "WHAT'S INSIDE:" }})
      .appendTo($('#preview'))
      .addClass("label")
      
      cFileNode.each(function(cFileNode_i, cFileNode_o){
        var cChildTopic = $(cFileNode_o).children('topic');
        cChildTopic.each(function(cChildTopic_i, cChildTopic_o){
          var oLinkContainter = $('<div/>')
            .appendTo($('#preview'))
            .css({
              //is top-level topic a wip for a new section ?
              //if so, and env is prod, hide it
              display: function(){
                if($(cChildTopic_o).attr('wip')
                && $(cChildTopic_o).attr('wip').toLowerCase().indexOf('new') >= 0){
                  return bProduction ? 'none' : $(this).css('display'); }
                }
            })
            
          var oLink = $('<a/>', {
              href: $(cChildTopic_o).children("link").text(),
              text: $(cChildTopic_o).children("title").text()})
            .css({
              //if top-level topic is a wip and env is non-prod, highlight it
              background: function(){
                if($(cChildTopic_o).attr('wip')){
                  return bProduction ? $(this).css('background-color') : 'yellow';   
                }  
              }  
            })  
          .appendTo(oLinkContainter)  
        })
      })
      
    })
  }  
}

function fBuildTopicSafety(){
  //1. Create oDocumentHertHolder = div that will hold the safety links
  //2. Get cSafetyNode = all safety nodes
  //3. Write all Safety nodes with cSafetyNode.each loop
    
  var oDocumentSafetyHolder = $('<div/>',{
    id:'menu-holder-safety'})
    .appendTo('body')
    .addClass('menu-holder')
    .css("left", function(){return $('#menu-button-safety').offset().left});

  var sFileName = $('meta[name=Filename]').attr("content");  
  var cSafetyNode = $($oDocRoot).find("safety");
  cSafetyNode = cSafetyNode.find("applicability:contains(" +sFileName + ")").parent();
  
  cSafetyNode.each(function(cSafetyNode_i, cSafetyNode_o){
    var oLink = $('<a/>', {
      href: $(cSafetyNode_o).children("link").text(),
      text: $(cSafetyNode_o).children("title").text()})
      .appendTo(oDocumentSafetyHolder)
    fSetHyperlinkAttr(oLink)
    

  })
}

function fBuildTopicSafetyButton(){
  //1. Get sFileName = name of current file based on Filename meta tag
  //2. Get cSafetyNode = node(s) that contain sFileName (as "applicability")
  //3. Create Document Safety Bulletins button if cSafetyNode count is not zero.
  //4. Bind mousedown and mouseover events
  var sFileName = $('meta[name=Filename]').attr("content");
  var cSafetyNode = $($oDocRoot).find("safety")
  cSafetyNode = cSafetyNode.find("applicability:contains(" +sFileName + ")").parent('safety');
  if(cSafetyNode.length > 0){
    $('<span/>',{
      id:'menu-button-safety',
      text: 'Safety Bulletins',
      mousedown: function(){
        $(this).attr("class","menu-button-select");},
      mouseup: function(){
        $(this).attr("class","menu-button");
        $(this).css('background-color', 'red');
        jqXHR.done(function(){
          if($('#menu-holder-safety').length==0){
            fClearAllMenuHolder()
            fBuildTopicSafety();}
          else {
            $('#menu-holder-safety').remove();  
          }
        })
      }
    })
    .appendTo('#menu-bar')
    .addClass('menu-button')
    .css('background-color', 'red');
  }
}

function fBuildTopicShortcut(){
  //jqXHR is to ensure all elements are already loaded on the page
  jqXHR.done(function(){
    var iScrollHeight = $('body').prop('scrollHeight')
    if($('h2').length> 1 
    && (iScrollHeight * 3/5 > screen.height)
    && !$('#shortcut')[0]){  
      var iHangingIndent = 15;
      var oShortcutContainer = $('<div/>',{
          id: 'shortcut'
      })
        .insertAfter('h1')
        .hide();
      var oShortcut = $('<span/>',{
        id: 'ref-shortcut',
        text: 'On this Page:' })
        .appendTo(oShortcutContainer)
        .addClass("label")
      
      $('h2').each(function(cHeader_i, cHeader_o){  
        var oQuickTop = $('<img/>',{
          src: '../../theme/graphic/cue_top.png',
          title: 'Back to top of page',
          click: function(){
            $('html, body').animate({scrollTop: '0px'}, 300)} })
          .appendTo($(cHeader_o))
          .addClass('quick-top')
      })
    }
    
    $('h2').each(function(cHeader_i, cHeader_o){
      var oLinkHolder = $('<div/>').appendTo(oShortcutContainer)
      var oLink = $('<span/>',{
        text: $(cHeader_o).text(),
        click: function(){
           $('html, body').animate({scrollTop: $(cHeader_o).parent('div.section').offset().top}, 300)}})
        .appendTo(oLinkHolder)
        .css('margin-left', iHangingIndent)
        .addClass('selector-shortcut-option')
    })
    oShortcutContainer ? oShortcutContainer.fadeIn() : null;
  })
}

function fCheckIfProduction(){
  var sFilePath = window.location.pathname;
  bProduction = sFilePath.toLowerCase().indexOf('tkoclient') >= 0 ? true : false;
  $bProduction = bProduction;
}

function fClearAllMenuHolder(){
  $('.menu-holder').remove();    
}

function fClearProcedureChecklist(){
  var iSavedProgress = $('li[id^=step]').find('input[type=checkbox]:checked').length
  if(iSavedProgress>0){
    var sConfirm
      = "This will delete your saved progress in all the procedures on this page. "
      + "Click OK to continue deleting your saved progress, or click Cancel."
    var bConfirm = window.confirm(sConfirm)
    if(bConfirm){
      var sCurrentFile = $('meta[name=Filename]').attr("content");
      $('li[id^=step]').each(function(cStep_i, cStep_o){
        var jStoreKey = sCurrentFile + '-' + $(cStep_o).prop('id');
        var cCheckBox = $(cStep_o).children('input[type=checkbox]')
          .css('background', '#ffffff')
          .prop('disabled', false)
          .prop('checked', false)
        $.jStorage.deleteKey(jStoreKey, 0)
      })
      $('[class|=tip-checklist-procedure]').remove();
    }
  }
  else{
    alert('There are no saved progress to delete at this time.')  
  }
}

function fCreateLoadingIndicator(oLoadTarget){
  var oLoadMessage = $('<span />').appendTo(oLoadTarget)
    .append($('<img />',{src: '../../theme/graphic/cue_loading.gif', align: 'middle', hspace: 10, vspace: 15}))
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
        $(this).css('top', '-16px').css('right', '0px');
        return $('<img />', {
          id: 'modal-close',
          src: '../../graphic/close.png',
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

function fGenericBuildTable(oTarget, sColumn, sColumnType){
  var oTable = $('<table/>').appendTo(oTarget);
  var oHeaderRow = $('<tr/>').appendTo(oTable);
    
  var cColumn = sColumn.split(', ');
  var cColumnType = sColumnType.split(', ');
  $(cColumn).each(function(cColumn_i, cColumn_s){
    var oHeaderColumn =   $('<th/>',{
      text: cColumn_s})
    .appendTo(oHeaderRow)
    .attr('data-type', cColumnType[cColumn_i])
  })
  
  return oTable;
}

function fGenericBuildHyperLink(sNodeText, sNodeLink){
  var oLink = $('<a/>',{
    text: sNodeText,
    href: sNodeLink })
  return oLink;  
}

function fGenericShortenText(sNodeText, iLength){
  var sText = $.trim(sNodeText)
  if(sText.length>iLength){
    sText = sText.substring(0,iLength-3);
    sText = $.trim(sText.substring(0, sText.lastIndexOf(' ')))
    sText = sText + '...' }
  return sText;
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

function fLoadRemindersToTechDoc(){
  if(!bProduction){
    var sMessage = "";
    if($('#hert-menu').length>0){
      sMessage = sMessage
        + "- Delete the hard-coded HERT charts on this page.\t\r\n   "
        + "HERT charts should be coded in CLR instead.r\n" }
    if($('#topic-history').length>0){
      sMessage = sMessage
        + "- Delete the hard-coded topic history on this page.\t\r\n   "
        + "Topic history should be coded in CLR instead.r\n" }
    if($('#tab-dynamic').length>0){
      sMessage = sMessage
        + "- This page has an element with ID name 'tab-dynamic'.\t\r\n   "
        + "Please change the ID to class instead.r\n" }
    if($('#tab-selector').length>0){
      sMessage = sMessage
        + "- This page has an element with ID name 'tab-selector'.\t\r\n   "
        + "Please change the ID to class instead.r\n" }
    if($('#def-popup').length>0){
      sMessage = sMessage
        + "- This page has an element with ID name 'def-popup'.\t\r\n   "
        + "Please change the ID to class instead.r\n" }
    if($('.def-popup').length>0 
    && $('.def-popup').find('dl').length>0
    && !$('.def-popup').find('dl').attr('id')){
      sMessage = sMessage
        + "- The DL under the 'def-popup' element has no ID.\t\r\n   "
        + "Please assign a unique ID to this DL for the script to work.\t\r\n   "
        + "You can also use this ID to apply CSS style to the elements.r\n" }
    if(sMessage.length>5){
      sMessage = "Things to fix on this page:\r\n" + sMessage
      alert(sMessage);
    }
  }
}

function fLoadXMLDatabase(){
  jqXHR = $.get('tko.topic.clr', function(data){
    if(data.documentElement){
      $xmlDoc = $(data.documentElement)
      $oDocRoot = data.documentElement;
      $oTopicNode  = new Array();
      $($oDocRoot.childNodes).each(function(i,e){
        e.tagName ? $oTopicNode.push(e) : null; }); }
    else{
      $xmlDoc = $.parseXML(data);
      $xmlDoc = $($xmlDoc);
      $oDocRoot = $xmlDoc.children()[0];
      $oTopicNode  = $oDocRoot.childNodes; }
  });
}

function fScopeCollection(oScopeObj, cScopeFilter, cScopeSource, cScopeOrder){
  //collect the data stored in the custom-list object
  //try to build cScopeNode based on cScopeFilter first because cScopeFilter usually returns a smaller collection
  //if cScopeNode is built based on cScopeSource first, the collection is larger; hence, the script runs slower
  var cScopeNode = $();
  $(cScopeFilter).each(function(cScopeFilter_i, cScopeFilter_o){
    var sScopeNode = $(cScopeFilter_o).attr('title');
    var sScopeText = $(cScopeFilter_o).text();
    cScopeNode = cScopeNode.add($($oDocRoot).find(sScopeNode).filter(function(){
      return $(this).text().toLowerCase().indexOf(sScopeText.toLowerCase()) > -1
    }).closest('topic') ); 
  })
  $(cScopeSource).each(function(cScopeSource_i, cScopeSource_o){
    var sScopeNode = $(cScopeSource_o).attr('title');
    var sScopeText = $(cScopeSource_o).text();
    cScopeNode = $(cScopeFilter)[0] 
      ? $(cScopeNode).find(sScopeNode).filter(function(){
          return $(this).text().toLowerCase().indexOf(sScopeText.toLowerCase()) > -1
      }).closest('topic') 
      : cScopeNode.add($($oDocRoot).find(sScopeNode).filter(function(){
          return $(this).text().toLowerCase().indexOf(sScopeText.toLowerCase()) > -1
      }).closest('topic')) ;
  })
  
  if(cScopeOrder){
    var bOrderAscend = cScopeOrder.text().toLowerCase().indexOf('desc')==-1 ? true : false ;
    cScopeNode.sort(function(a,b){
      var A = $(a).children(cScopeOrder.attr('title')).text().toLowerCase();
      var B = $(b).children(cScopeOrder.attr('title')).text().toLowerCase();
      if(bOrderAscend){
        if ( A < B){ return -1; }
        else if(A > B){ return 1; }
        else{ return 0; } }
      else{
        if ( A > B){ return -1; }
        else if(A < B){ return 1; }
        else{ return 0; }  
      }
    })    
  }   
 
  return cScopeNode;
}

function fSelectObjText(element) {
  if($('#' +element)[0]){
    if(document.body.createTextRange){
      var range = document.body.createTextRange();
      range.moveToElementText(document.getElementById(element));
      range.select(); }
    else if (window.getSelection){
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(document.getElementById(element));
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  else{
    if(document.body.createTextRange){
      var range = document.body.createTextRange();
      range.collapse(true); range.select(); }
    else{
      var selection = window.getSelection();
      selection.removeAllRanges();
    }  
  }
}

function fSetGenericDocumentClick(){
  //If clicked element does not have a class that starts with "menu",
  //then invoke fClearAllMenuHolder to remove all open document menu
  $('body').click(function(event){
    var cTargetAncestor = $.merge($(event.target), $(event.target).parentsUntil('body'))
    cTargetAncestor = cTargetAncestor.map(function(){return $(this).attr('class')}).get()
    if($.inArray('menu-button',cTargetAncestor)>-1
    || $.inArray('menu-holder',cTargetAncestor)>-1){
      /*do nothing*/ }
    else{ fClearAllMenuHolder() }  
  })
}

function fSetHyperlinkAttr(oLink){
  var sLinkFileType = oLink.attr('href');
  sLinkFileType = (sLinkFileType.substring(sLinkFileType.lastIndexOf('.'))).toUpperCase();
  sLinkFileType.indexOf('.HTM') > -1 ? oLink.attr('target', '_self') : oLink.attr('target', '_blank');
  return oLink;
}

function fSetModalMessage(i){
  $('#modal-notification').length > 0 
    ? $('#modal-notification').remove() 
    : null //do nothing
    
  return oMessage = $('<div />', {
    id: 'modal-notification',
    html: function(){
      if(i==1){
        return oHTML = '<strong>This form uses ActiveX control.</strong> ' 
         + 'When submitting this form, a security pop-up may appear&mdash;select YES to allow interaction and run the webscript. '
         + 'A draft email will then open in Microsoft Outlook containing the data that you are submitting. ' 
         + 'Be sure to review this draft email and confirm all information and attachments are correct. '
         + 'After verifying all information, send the email. '
      }  
    }  
  })
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
      $('#conditional-' + $(cOption_o).val()).hide(); })
    $('#conditional-' + $val).show();  
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

function fStyleContentOverlay(){
  $('.ref-overlay').click(function(){
    var bModalTarget = false, oClicked = $(this);
    var oModalCanvass = fCreateModalBackground(1);
    var cDynamicRef = $('[class|="ref-overlay"],[class|="ref-target"]')
    cDynamicRef.each(function(cRef_i, cRef_o){
      if(bModalTarget){
        fStyleOverlayLoader($(cRef_o), oModalCanvass);
        return false;
      }  
      if($(cRef_o).is($(oClicked))){
        bModalTarget = true }
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
    var oTipHolder = $('<div>')
      .appendTo(cTip_o)
      .addClass(function(){
        return $(cTip_o).attr('class') + '-text'
      })
 
    var oTipText = $('<span>',{
      html: sTipText })
      .appendTo(oTipHolder)
    
    var iWidthLimit = $('body').width() * 0.85;
    if($(cTip_o).is(':visible') && oTipText.width() < iWidthLimit){
      $(cTip_o).css('max-width', oTipText.outerWidth()+10)
    }
  })
  
  if($('#coming-soon').length>0){
    $('<img/>',{
      src: '../../theme/graphic/cue_coming.png',
      alt: 'Click to Hide',
      click: function(){$(this).hide();}
    }).appendTo($('#coming-soon'))      
  }
}

function fStyleFilterableTable(){
  var cTable = $('th[class|=filter-header]').not(':has(img[src*=ico_filter])');
  cTable.each(function(cTable_i, cTable_o){
    var oFilterContainer = $('<span />')
      .appendTo(cTable_o)
      .css('padding-left', '10px')
    var oFilter = $('<input/>', {
      type: 'text',
      title: 'Filter',
      size: 30,
      css: {
        'font-size': '11px'  
      },
      keyup: function(){
        var sSearchString = $(this).val().toLowerCase();
        var cCol = $(this).closest('table').find('tr').has('td')
        cCol.css('display', function(){
            return $(this).text()
              .toLowerCase()
              .indexOf(sSearchString)==-1
              ? 'none'
              : 'table-row'
        })
      },
      focusout: function(){
        var sSearchString = $(this).val().toLowerCase();
        var cCol = $(this).closest('table').find('tr').has('td')
        cCol.css('display', function(){
            return $(this).text()
              .toLowerCase()
              .indexOf(sSearchString)==-1
              ? 'none'
              : 'table-row'
        })
      }
    }).appendTo(oFilterContainer);
    var oFilterIcon = $('<img/>',{
      src: '../../theme/graphic/ico_filter.gif',
      title: 'Filter',
      hspace: 5
    }).appendTo(oFilterContainer);
  })
}

function fStyleLoadingIndicator(obj){
  return $('<div/>').appendTo(obj)
    .append($('<img/>',{src: '../../theme/graphic/cue_loading.gif', align: 'middle', hspace: 10}))
    .append($('<span/>',{text: 'Loading content, please wait...'}))
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
  var objDate = new Date();
  var intToday = objDate.getDate();
  var sModalKey = $('meta[name=Filename]').attr("content") + '_modal';
  var intLastModal = $.jStorage.get(sModalKey);
  
  if(($('div[id|=modal-notification]').length>0) && (intLastModal != intToday)){
    var oModalCanvass = fCreateModalBackground(2);
    var oModalContent = $('div[id|=modal-notification]');
    fStyleModalLoader(oModalContent, oModalCanvass);
    
    $.jStorage.set(sModalKey, intToday);
   
  }
}

function fStyleMultiColumnIndex(oIndex){
  var iIndexColumn = parseInt(oIndex.attr('id').substring(oIndex.attr('id').lastIndexOf('-')+1));
  if($.isNumeric(iIndexColumn) && iIndexColumn > 1){
    var iIndexRow = Math.ceil((oIndex.children('div.index-link-container').length)/iIndexColumn);
    var iSliceStart = 0, iSliceEnd = iIndexRow;
    
    for(var i=0; i<iIndexColumn;i++){
      var iCount = oIndex.children('div.index-link-container').length
      var oIndexColumn = $('<div/>')
        .appendTo(oIndex)
        .addClass('index-column')
      var cIndexRow = oIndex.children('div.index-link-container').slice(iSliceStart, iSliceEnd)
        .detach()
        .appendTo(oIndexColumn)
    }
    
  //this extra line prevents oIndex from collapsing (CSS)
  $('<div/>')
    .appendTo(oIndex)
    .css('clear', 'both')
  }
}

function fStyleOverlayLoader(oModalContent, oModalCanvass){
  //set default state of modal canvass
  oModalCanvass
    .hide()
    .css('min-width', '20px')
    .css('min-height', '20px')
    .find('.modal-button').hide();
  
  //animation if ref-target's immediate child is image
  if($(oModalContent).children('img').length > 0
  && $(oModalContent).children('img').index()==0){
    var oImage = $(oModalContent).children('img').clone();
    var rImage = new Image(); rImage.src = oImage.attr('src');
    //this onload is to address cross-browser idiosyncracies
    oImage.get(0).onload = function(){
      oModalCanvass
        .fadeIn('fast')
        .animate(
          {width: oModalContent.width(),
           height: oModalContent.height()},
          {duration: 'fast',
           complete: function(){
             oModalCanvass
               .append(
                 oImage
                   .fadeTo('fast', 1))
               .find('.modal-button').show();
           }
          }
        )
    } 
  }
}

function fStyleParamSetDefinition(){
  var cPopup = $('#def-popup, .def-popup');
  cPopup.each(function(cPopup_i, cPopup_o){
    var oTermContainer = $('<div/>',{
      id: function(){return $(cPopup_o).find('dl').attr('id') + '-container';}})
    .appendTo($(cPopup_o))
      
    var cTerm = $(cPopup_o).find('dl').find('dt');
    cTerm.each(function(cTerm_i, cTerm_o){
      $('<div/>', {
        mouseover: function(){
          $(this).fadeTo(0, 0.2);
          var iTop = $(this).position().top + $(this).height();
          $('div .definition').eq(cTerm_i)
            .fadeTo(0, 1)
            .css('top', iTop) },
        mouseout: function(){
          $(this).fadeTo(0, 0)
          $('div .definition').eq(cTerm_i).fadeTo(0, 0)}  
      })    
      .appendTo(oTermContainer)
      .addClass('parameter')
      .fadeTo(0, 0)
    })
 
    var cDefinition = $(cPopup_o).find('dl').find('dd');
    cDefinition.each(function(cDefinition_i, cDefinition_o){
      $('<div/>', {
        html: $(cDefinition_o).html()})    
      .appendTo(oTermContainer)
      .addClass('definition')
      .fadeTo(0, 0)
    })    
  })
  cPopup.find('dl').remove();
}

function fStyleProcedureChecklist(){
  var sCurrentFile = $('meta[name=Filename]').attr("content");  
  $('div[class=cheklist-procedure]').each(function(oProcCheckList_i, oProcCheckList_o){
    
    //move the list a bit to give space to the checkbox
    $(oProcCheckList_o).children('ol, ul')
    
    //for all list items that have an ID:
    //add a checkbox, which when clicked, gets stored (jStorage) and disabled
    //before a clicked checkbox is stored, ask for confirmation from the user.
    var cStep = $(oProcCheckList_o).find('li[id^=step]')
    cStep.each(function(cStep_i, cStep_o){
      var jStoreKey = sCurrentFile + '-' + $(cStep_o).prop('id');
      var bPerformed = $.jStorage.get(jStoreKey, 0)
      $('<input>', {
        type: 'checkbox',
        change: function(){
          if($(this).prop('checked')){
            var sConfirm 
              = 'Please confirm that you have performed this step by clicking OK.\r\n' 
              + 'If you have not performed this step yet, please click CANCEL.';
              
            var oConfirm = window.confirm(sConfirm)
            if(oConfirm){
              $.jStorage.set(jStoreKey, 1);
              $(this).prop('disabled', true); }
            else{
               $(this).prop('checked', false); }
          }
        }
      })
        .prependTo($(cStep_o))
        .css('position', 'absolute' ).css('left', -9)
        .prop('checked', function(){return bPerformed==1 ? true : false})
        .prop('disabled', function(){return bPerformed==1 ? true : false})
        .css('background', function(){return bPerformed==1 ? 'pink': '#ffffff'})
        
    })
    
    //check if any of the procedures have been performed already;
    //if so, add a note on how to clear the stored-and-disabled checkboxes
    if($(oProcCheckList_o).find('input[type=checkbox]:checked').length > 0){
      $('<span />')
        .prependTo($(oProcCheckList_o))
        .append(
          $('<span />', {
            html: "The highlighted checkboxes identify the steps that you have performed."
          })
            .css('background', 'pink')
            .css('padding', '5px')
            .css('white-space','nowrap')
            .addClass('tip-checklist-procedure')
        )
    }
  })  
}

function fStyleSectionHeader(){
  $('h2').each(function(cHeader_i, cHeader_o){
    var oHeaderPadding = $('<div/>')
      .insertBefore($(cHeader_o))
      .addClass('section-padding')      
  })
}

function fStyleSortableTable(){
  jqXHR.done(function(){
    $('th[class|=sort-header]').closest('table:not([flagged])').each(function(cSortableTable_i, cSortableTable_o){
      $(cSortableTable_o).attr('flagged', 'true'); //this is to indicate that table is already sortable
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
          return $.jStorage.get($(this).attr('name')); } 
        else{
          return $(this).val(); } })
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
            }
          }
        })      
      );
    }
  })
}

function fDeleteStoredData(){
  var bErase = confirm("Do you really want to clear all data from the form?\t");
  if (bErase){
    var cInput = $(':input').each(function(cInput_i, cInput_o){
      var sInputName = $(cInput_o).attr("name");
      var sInputValue = $.jStorage.deleteKey(sInputName);
      location.reload();
    })
  }  
}

function fStyleTableCodeSelector(){
    //1. If #tab-definition or .tab-definition exists, get cSegment
    //2. Create oDynamicPnHolder = div to hold the button-selectors
    var cTableDefinition = $('#tab-definition, .tab-definition');
    if(cTableDefinition.length>0){
       cTableDefinition.each(function(cTableDefinition_i, cTableDefinition_o){
         var cSegment = $(cTableDefinition_o).find('table');
         $(cSegment).parent().hide();
         cSegment.each(function(cSegment_i, cSegment_o){
           var sCode = $(cSegment_o).find('td')[0];
           $('<input/>',{
             type: 'button',
             value: $(sCode).text(),
             mouseup: function(){
               if($(cSegment_o).parent().css('display')=='none'){
                 $(cSegment).parent().hide();
                 $(cSegment_o).parent().fadeIn(); }
               else{
                 $(cSegment_o).parent().fadeOut(); }
             }
           })
           .insertBefore($(cTableDefinition_o).children('div')[0])
           .addClass('selector-part-button')
         })           
      })
    }
}

function fStyleTableDropdownSelector(){
    var cTableSet = $('#tab-selector, .tab-selector');
    if(cTableSet.length>0){
      cTableSet.each(function(cTableSet_i, cTableSet_o){
        var oSelectorHolder = $('<div/>')
          .insertBefore($(cTableSet_o).children()[0])
        var oSelectorLabel = $('<span/>',{
             text: 'Select Table to Display: ' })
          .appendTo(oSelectorHolder)
          .addClass('selector-table-label')
        var cTable = $(cTableSet_o)
          .find('table[class=data]').parent('div')
          .hide();
        var oDropDown = $('<select/>')
          .appendTo($(oSelectorHolder))
          .change(function(){
            cTable
              .hide()
              .eq($(this).find('option:selected').index()).fadeIn(); })
        cTable.eq(0).fadeIn();
       
        $(cTableSet_o).find('table').each(function(cTable_i, cTable_o){
          var oTableHolder = $(cTableSet_o).find('table[class=data]').parent('div');
          var sTableTitle = $(cTable_o).find('th[class=head]').text();
          $('<option/>',{text: sTableTitle, value: cTable_i }).appendTo(oDropDown);
        })
      })
    }
}

function fStyleTableListSelector(){
    var cTableSet = $('#tab-dynamic, .tab-dynamic');
    cTableSet.find('table[class=data]').parent('div').hide();
    if(cTableSet.length>0){
      cTableSet.each(function(cTableSet_i, cTableSet_o){
        var oSelectorHolder = $('<div/>')
          .prependTo($(cTableSet_o))
          .append(
            $('<div/>', {text: 'Select Table to Display:' })
            .addClass('selector-table-label')
          )
        
        $(cTableSet_o).find('table').each(function(cTable_i, cTable_o){
          var oTableHolder = $(cTableSet_o).find('table[class=data]').parent('div');
          var sTableTitle = $(cTable_o).find('th[class=head]').text()
          var oOption = $('<div/>',{
              text: sTableTitle,
              click: function(){
                $(cTableSet_o).find('.selector-table-option-selected').not($(this)).attr('class', 'selector-table-option');
                $(this).toggleClass('selector-table-option, selector-table-option-selected')
                oTableHolder.not(oTableHolder.eq(cTable_i)).hide();
                oTableHolder.eq(cTable_i).fadeToggle();
              }
          })
          .appendTo(oSelectorHolder)
          .addClass('selector-table-option')
          
          cTable_i==0? oOption.click() : null;
        })
      })
    }
}

function fTrackDocumentHistory(){
  var cHistory = null;
  var sCurrentFile = $('meta[name=Filename]').attr("content");
  var sHistory = $.jStorage.get('tko-dochistory', null)
  if(!sHistory){
    $.jStorage.set('tko-dochistory', sCurrentFile)
  }
  else{
    rxDelimeter = /-delimiter-/gi;
    cHistory = sHistory.split(rxDelimeter);
    sHistory = '';
    if($.inArray(sCurrentFile, cHistory)>-1){
      cHistory.splice($.inArray(sCurrentFile, cHistory), 1)}
    else if(cHistory.length==5){
      cHistory.splice(0, 1)}  
    cHistory.push(sCurrentFile);
    
    $(cHistory).each(function(cHistory_i, cHistory_o){
      sHistory += cHistory_i < cHistory.length-1 
      ? cHistory_o + '-delimiter-' 
      : cHistory_o })
    $.jStorage.set('tko-dochistory', sHistory)
  }
   return cHistory;
}

function fTransformNode(oXmlNode, sNodeField_type, sNodeField_node, sNodeField_text){
  var oHtmNode;
  //if class contains 'trim', trim the text to the desired length
  if(sNodeField_type.indexOf('trim-')>-1){
    var iLimit = sNodeField_type.substring(sNodeField_type.indexOf('trim-')).replace('trim-', '');
    sNodeField_text = fGenericShortenText(sNodeField_text, iLimit); }
    
  //if class contains 'link', prepare the oHtmNode
  //if link is a graphic file, create ref-modal and ref-target
  //if link is non-graphic, create a regular link object
  if(sNodeField_type.indexOf('link')>-1){
    if($(oXmlNode).children(sNodeField_node).siblings('link')[0]){
      var sFileType = $(oXmlNode).children(sNodeField_node).siblings('link').text()
       .substring($(oXmlNode).children(sNodeField_node).siblings('link').text().lastIndexOf(".")).toUpperCase();
      if(sFileType!=".PNG" && sFileType!=".GIF" && sFileType!=".JPG"){
        oHtmNode = $('<a/>',{
          href: $(oXmlNode).children(sNodeField_node).siblings('link').text(),
          html: sNodeField_text,
          target: function(){ return sFileType == '.HTM' ? '_self' : '_blank'; }}) }
      else{
        oHtmNode = $('<span />')
          .append(
            $('<span />', {
              html: sNodeField_text,
              click: function(){
                var oModalCanvass = fCreateModalBackground(2);
                var cRef_o = $(this).siblings('.ref-target').clone();
                fStyleModalLoader(cRef_o, oModalCanvass) }
            }).addClass('ref-modal')
          )
          .append(
            $('<span />')
              .addClass('ref-target')
              .append($('<img />', {src: $(oXmlNode).children(sNodeField_node).siblings('link').text()}))
          )
      }
    }
  }
  
  //if current column is 'description', check if there's supersededby info
  if(sNodeField_node=='description'
  && $(oXmlNode).children(sNodeField_node).siblings('supersededby')[0]){
    oHtmNode = $('<a />',{
      href: $(oXmlNode).children(sNodeField_node).siblings('supersededby').text(),
      html: sNodeField_text
    })
  }
  
  return oHtmNode ? oHtmNode : sNodeField_text;
}

function fBuildPartsButton(){
xml = $.get('../../custom/tools/parts-doc.clr', function(data){
    if(data.documentElement){
      $xmlDoc = $(data.documentElement) }
    else{
      $xmlDoc = $.parseXML(data);
      $xmlDoc = $($xmlDoc); }
    
    fCreatePartsButton($xmlDoc.children('prt_list'))
    })
    
function fCreatePartsButton(xml) {

var docArr = fCreatePartsDocArr(xml)
var sDocCode = $('meta[name=Filename]').attr("content").substr(0,3).toLowerCase()
var bInArray = $.inArray(sDocCode,docArr) > 0 ? true:false;

if (bInArray) {
         var button = $('<span/>',{
      id:'menu-button-part',
      text: 'Parts Search',
      mousedown: function(){
        $(this).attr("class","menu-button-select");},
      mouseup: function(){
        $(this).attr("class","menu-button");
        location.href='../../tko.parts.htm'
      }
    })
    .addClass('menu-button')
    
    if ($('#menu-button-favorite').length > 0){
        $(button).insertAfter('#menu-button-favorite')
    }
    else {
        $(button).insertAfter('#menu-button-map')
    }
}

function fCreatePartsDocArr(xml) {
    var doc = $(xml).find('document')
    var arr = []
    $(doc).each(function(){
        arr.push($(this).attr('name').toLowerCase())
    })
    return arr
}
}
}
function fAddMyCEtvLink(){
    var sFileName = $('meta[name=Filename]').attr("content").toLowerCase();
    
    jqXHR.done(function(){
        var oTechTipNode = $($oDocRoot)
          .find("applicability:contains('" +sFileName+ "')")
          .parent('mycetv')
        if (oTechTipNode[0]){
            var divBox = $('<div />').addClass('quick-box').insertAfter('h1')
            var divLabel = $('<div />', {
                text: oTechTipNode.length > 1 ? 'myCEtv Links:':'myCEtv Link:'
            }).css('text-transform', 'none').addClass('label').appendTo(divBox)
            var divIndex = $('<div />').addClass('icon-index').appendTo(divBox)
            oTechTipNode.each(function(){
                var sDesc = $(this).find('title').text()
                var sLink = $(this).find('link').text()
            
                var oDiv = $('<div />').appendTo(divIndex)
                var oLink = $('<a />', {
                    text: sDesc,
                    href: "javascript:fOpenmyCEtvLink('"+sLink+"')"
                }).addClass('vid')
                .appendTo(oDiv)
            })
        }
    })
    
   
}

function fAddMyCEtvLink2(){
    jqXHR.done(function(){
    
    var oHold = $('div[class^=mycetv]').hide()
    if (oHold[0]){
        oHold.each(function(){
            var sClass = $(this).text().replace(' ', '').split(',')
            var divBox = $('<div />').addClass('quick-box').insertAfter($(this))
            var divLabel = $('<div />', {
                text: sClass.length > 1 ? 'myCEtv Links:':'myCEtv Link:'
            }).css('text-transform', 'none').addClass('label').appendTo(divBox)
            var divIndex = $('<div />').addClass('icon-index').appendTo(divBox)
            
            for (i=0; i<sClass.length;i++){
                var oTechTipNode = $($oDocRoot)
                  .find("mycetv_id:contains('" +sClass[i]+ "')")
                  .parent('mycetv')
                var sDesc = $(oTechTipNode).find('title').text()
                var sLink = $(oTechTipNode).find('link').text()
            
                var oDiv = $('<div />').appendTo(divIndex)
                var oLink = $('<a />', {
                    text: sDesc,
                    href: "javascript:fOpenmyCEtvLink('"+sLink+"')"
                }).addClass('vid')
                .appendTo(oDiv)
                  
            }
        })
    }
    
    
/*        var oTechTipNode = $($oDocRoot)
          .find("applicability:contains('" +sFileName+ "')")
          .parent('mycetv')
        if (oTechTipNode[0]){
            var divBox = $('<div />').addClass('quick-box').insertAfter('h1')
            var divLabel = $('<div />', {
                text: oTechTipNode.length > 1 ? 'myCEtv Links:':'myCEtv Link:'
            }).css('text-transform', 'none').addClass('label').appendTo(divBox)
            var divIndex = $('<div />').addClass('icon-index').appendTo(divBox)
            oTechTipNode.each(function(){
                var sDesc = $(this).find('title').text()
                var sLink = $(this).find('link').text()
            
                var oDiv = $('<div />').appendTo(divIndex)
                var oLink = $('<a />', {
                    text: sDesc,
                    href: "javascript:fOpenmyCEtvLink('"+sLink+"')"
                }).addClass('vid')
                .appendTo(oDiv)
            })
        }*/
    })
}

function fOpenmyCEtvLink(str){
    var shell = new ActiveXObject("WScript.Shell");
    shell.run("msedge "+str);
    
    //shell.run("Chrome "+str);   --for opening links in Google Chrome

} 
//-->