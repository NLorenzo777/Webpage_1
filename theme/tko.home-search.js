var sSearchDefaultTxt = "Search for a product...";

function fSearchIndex() {
  fCreateSearchBox();
  fSetSearchBoxAttr();
}

function fCreateSearchBox(){
  var $oSearchBox = $("<input />");
  $oSearchBox.attr("id", "search-string");
  $oSearchBox.attr("class", "search-focusout");
  $oSearchBox.attr("type", "text");
  $oSearchBox.attr("size", "35");
  $oSearchBox.attr("value", sSearchDefaultTxt);
  $oSearchBox.appendTo($("#search"));
}

function fSetSearchBoxAttr(){
  $('#search-string').focusin(function(){
    //if there's no search string, set search field to blank on focus
    if($(this).val().length == 0
    || $(this).val() == sSearchDefaultTxt){
      $(this).val("");
      $(this).attr("class", "search-focus"); }
    //else, if there's a valid search string, check if there's a result box
    //if result box contains something, show it on focus
    else if($("#search-result .document")[0]){
      $('#search-result').fadeIn(); }
      
    //extra script: added as quick fix to problem about hidding open popoups on document click
    //see function fHidePopupDefault for more info
    $('#search').css("height", "80%");
    $('#search').css("width", "80%");
  });
  
  $('#search').focusout(function(){
    //if search string is very short, replace it with default text
    //and if result box exists, destroy it
    if($('#search-string').val().length <= 2){
      $('#search-string').val(sSearchDefaultTxt);
      $('#search-string').attr("class", "search-focusout");
      $('#search-result').remove(); }
    //else, if search string is valid, check if there's a result box
    //if result box contains something, hide it on focus out except when result box gets focus
    else if($("#search-result .document").length!=0){
      //this delay was added because of a corny bug in TKO rendering...
      //in all modern browsers, the fadeout should work fine even without the delay
      setTimeout(function(){
        if($('#search').has(":focus").length==0){
          $('#search-result').fadeOut();
          //extra script: added as quick fix to problem about hidding open popoups on document click
          //see function fHidePopupDefault for more info
          $('#search').css("height", "auto");
          $('#search').css("width", "auto");
        }
      }, 100)
    }
  });
  
  $('#search-string').keyup(function () {
    //if search string is really short, destroy result box if it exists
    if($(this).val().length < 2){ 
      $("#search-result").remove(); }
    //else, if search string's length is valid, 
    //create a result box if it doesn't exist yet
    else if($("body #search-result").length==0){  
      $("<div id='search-result' />").appendTo($("#search")); }
    //else, if the result box already exists, check if it contains anything
    //if it doesn't contain anything, build the search result
    else if($("#search-result .document").length==0
      && $("#search-result .document-hidden").length==0){
      $($oFunctionNode).find('manual > active:contains(true)').closest('manual').each(function(index, node) {
        if ($(node).children("title").text().toLowerCase().indexOf($('#search-string').val().toLowerCase()) >= 0 
        || $(node).children("tags").text().toLowerCase().indexOf($('#search-string').val().toLowerCase()) >= 0
        || $(node).parents().map(function(){return $(this).attr("name")}).get().reverse().join(' > ').toLowerCase().indexOf($('#search-string').val().toLowerCase()) >= 0) {
          fCreateSearchResultLine($(node)); } }) }
    //else, if the search result is already built...
    //show-hide result lines as needed
    else {
      if($(this).val().length > 2){
        $("#search-result .document, #search-result .document-hidden").each(function(index, node){
          if ($(node, "a").text().toLowerCase().indexOf($('#search-string').val().toLowerCase()) >= 0
          || $(node).data("search-data").tags.toLowerCase().indexOf($('#search-string').val().toLowerCase()) >= 0
          || $(node).data("search-data").path.toLowerCase().indexOf($('#search-string').val().toLowerCase()) >= 0){
            $(node).attr("class", "document"); }
          else{
            $(node).attr("class", "document-hidden"); }
        }); 
      }
      else {
        $("#search-result").remove();
      }
    }
    
    //finally, show-hide the result box depending on search results to display
    if($("#search-result .document").length == 0){
      $("#search-result").hide();}
    else{
      $("#search-result").show(); }
  })
}

function fCreateSearchResultLine(node){
  var $oResultLine = $(fBuildDocLine(node)).appendTo($("#search-result"));
  var sIndexPath = node.parents().map(function(){return $(this).attr("name")}).get().reverse().join(' > ')
  $oResultLine.data("search-data", {tags: node.children("tags").text(), path: sIndexPath})
  $("<div class='path'>" +sIndexPath + "</div>").appendTo($oResultLine);
}
