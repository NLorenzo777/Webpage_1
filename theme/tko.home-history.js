function fParseHistClr(sLink){
  jqXHR = $.get(sLink, function(data){
    if(data.documentElement){
      $xmlDoc = $(data.documentElement) }
    else{
      $xmlDoc = $.parseXML(data);
      $xmlDoc = $($xmlDoc); }
    fCreateModalBackground(0);
    fBuildModalMessage($xmlDoc);
    fLoadNotifications($xmlDoc);
    fStyleCollapsible();
  })
}

function fBuildModalMessage($xml) {
    var $divHolder = $('<div />').appendTo('#modal-message')
    
    $('<div/>', {
        html: "TKO Update Notification",
        id: "history-home-menu"
    }).appendTo($divHolder);
    
    
    var $listHolder = $('<span />').attr('id', 'span-list').appendTo('#modal-message').html('<strong>Archive</strong>')
    /*var $spanFrame = $('<span />').attr('id', 'span-frame').appendTo('#modal-message')
    var $iFrame = $('<iframe />', {
        src: fReturnFirstUpdate($xmlDoc)
    }).attr('id', 'doc-viewer')
    .appendTo($spanFrame)
    
    var frameMessage = $('<span />', {
        html: 'PDF plugin not available. To open the document, click '
    })
    .css({
        position: 'absolute',
        top: '10px'
    })
    .append($('<a />', {
            href: fReturnFirstUpdate($xmlDoc),
            text: 'here.',
            target: '_Top'
        }))
    .appendTo($spanFrame)
    */
    }

function fLoadNotifications($xml){
    var $doc = $xml.find('history').find('update')
    var $docHolder = $('<span />').appendTo('#span-list').addClass('span-holder')
    
    var month_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    $doc.each(function(){
        var sDate = $(this).attr('date')
        var sLink = 'gen/g00/TKO Update/' + $(this).text()
        
        var date = new Date(sDate)
        var year = date.getYear()
        var month = date.getMonth()
        var divYear = 'div_' + year
        var divMonYear = 'div_' + month + '_' + year
        
        if ($('#' + divYear).length > 0){
            if ($('#' + divMonYear).length > 0){ //month+year exists
                fCreateListLink(sDate, sLink, $('#' + divMonYear))
            }
            else {
                var divMonYearHolder = $('<div />').attr('id', divMonYear).appendTo($('#' + divYear)).css('margin', '5px auto').hide()
                var coll_text = '<span class="coll_sign"> +</span>'
                var collMonButton = $('<span />').html(month_arr[month]+coll_text).addClass('coll-span').prependTo(divMonYearHolder)
                fCreateListLink(sDate, sLink, divMonYearHolder)
            }
        }
        else {
            var divYearHolder = $('<div />').attr('id', divYear).appendTo($docHolder).css('margin', '5px auto')
            
            var coll_text = '<span class="coll_sign"> +</span>'
            var collButton = $('<button />').html(year + coll_text).addClass('coll-button').prependTo(divYearHolder)
            
            
            var divMonYearHolder = $('<div />').attr('id', divMonYear).appendTo($('#' + divYear)).css('margin', '5px auto').hide()
            var coll_text = '<span class="coll_sign"> +</span>'
            var collMonButton = $('<span />').html(month_arr[month]+coll_text).addClass('coll-span').prependTo(divMonYearHolder)
            fCreateListLink(sDate, sLink, divMonYearHolder)
        }
        
    })
}

function fReturnFirstUpdate($xml){
    var $doc = $xml.find('history').find('update').eq(0)
    var sLink = 'gen/g00/TKO Update/' + $doc.text()
    
    return sLink
}

function fStyleCollapsible(){
var coll_span = $('.coll-span');
var coll_btn = $('.coll-button');
$(coll_span).click(function(){
    if ($(this).siblings('.span-link').is(":visible")){
        $(this).find('.coll_sign').text(' +')
        $(this).siblings('.span-link').slideUp('fast')
        $(this).removeClass('span-active')
    }
    else {
        $('.span-active').click()
        var span_link = $(this).siblings('.span-link')
        $(span_link).slideDown('fast')
        $(this).find('.coll_sign').text(' -')
        $(this).addClass('span-active')
    }
    
})

$(coll_btn).click(function(){
    if ($(this).siblings('div').is(":visible")){
        $(this).find('.coll_sign').text(' +')
        $(this).siblings('div').slideUp('fast')
        $(this).removeClass('btn-active')
    }
    else {
        $('.btn-active').click()
        $('.span-active').click()
        var $div = $(this).siblings('div')
        $($div).slideDown('fast')
        $(this).find('.coll_sign').text(' -')
        $(this).addClass('btn-active')
    }
    
})

}

function fCreateListLink(date, link, coll){
    $('<a />', {
            text: date,
            href: link,
            target: '_top'
        }).appendTo(coll)
        .addClass('span-link')
        .click(function(event){
            //event.preventDefault();
            //$('#doc-viewer').attr('src', link)
            $('#span-list').find('a').css('color', 'white')
            $(this).css('color', '#ff8c00')
        })
        .hide()
}