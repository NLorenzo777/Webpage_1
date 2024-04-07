function fLoadJumpToBox(){
  if($bProduction){
    $('#jumpto')
      .append($('<input />', {
        id: "jumpto-box",
        type: "text", size: 35,
        value: "" }).addClass('jumpto-box-blank') )
      .append($('<input />', {
        id: "jumpto-go",
        type: "button", 
        value: "Load Topic" }))
    fSetJumpToBehavior();      
  }
}

function fSetJumpToBehavior(){
  $('#jumpto-box').click(function(){
    $(this).removeClass('jumpto-box-blank').addClass('jumpto-box-filled');
  })
  
  $('#jumpto-box').focusout(function(){
    $(this).val().length > 0 
      ? $(this).removeClass('jumpto-box-blank').addClass('jumpto-box-filled') 
      : $(this).removeClass('jumpto-box-filled').addClass('jumpto-box-blank');
  })
  
  $('#jumpto-go').click(function(){
    $('#jumpto-box').val().length > 0
      ? fSearchTopicId()
      : fShowJumpToTip(1);
  })
}

function fSearchTopicId(){
  objClrIndex = $.get('vbs/tko.index.clr', function(data){
    var $xmlIndex = $.parseXML(data); $xmlIndex = $($xmlIndex);
    var $oDocRoot = $($xmlIndex.children()[0]);
    var blnFound = false;
    var $oFile = $oDocRoot.find('FileName').each(function($oFile_i, $oFile_o){
      sTopicId = $('#jumpto-box').val().toLowerCase();
      sTopicId = sTopicId.replace(".htm", "");
      sTopicId = sTopicId + ".htm";
      if($($oFile_o).text().toLowerCase() == sTopicId){
        blnFound = true; return false; }
    })
    if(blnFound){ fShowJumpToTip(4); }
    else{ fShowJumpToTip(2); }
  }).fail(function(){ fShowJumpToTip(3); })
}

function fShowJumpToTip(intTip){
  switch(intTip){
    case 1:
      alert("Please enter a Topic ID.");
      break;
    case 2:
      alert("No match was found in the local database for the Page ID you entered. \Make sure you've entered a valid TKO Topic ID.");
      break;
    case 3:
      var blnRebuild = confirm("There was a problem loading the index database.  Would you like to rebuild the index now (Rebuild Menu)?")
      if(blnRebuild){ $('#option-home').click() }
      break;
    case 4:
      top.location = sTopicId;
      break;  
    default:
      break;
  }
  
}