function fLoadForm(){
  fCheckIfProduction();
  fLoadBanner(1);
  fStyleStoredForm();
  fStyleContentToggle();
  fStyleContentModal();
  fStyleMailerForm();
  fChangeSubject()
  
}

function fChangeSubject(){
var $sel = $('[name=required-rcar_purpose-conditional]')
$sel.change(function(){
    if ($sel.val() == "rcar_purpose_1"){
        $('form[name=mailer-form]').attr('action', "mailto:LGS.Mail@vertiv.com?subject=Parts Analysis For Internal Use Only (Ticket #Event Ticket Number#)")
    }
    else {
        $('form[name=mailer-form]').attr('action', "mailto:LGS.Mail@vertiv.com?subject=Root Cause Analysis Request (Ticket #Event Ticket Number#)")
    }
})


}

function fCENote(){
    alert("As the submitting CE of this RCAR, you are required to: \n \n" + 
        "-Attend the CE call (will be scheduled). \n"+
        "-Review the report draft, suggest edit/s, and send approval."
        
    )
}
function fAddBrowseBox(){
    var ind = $('[name^=rca_battery_data]').length + 1
    var inp = $('<input />', {
        type: "file", 
        title: "RCAR Battery Data"/* + ind*/,
        name: "rca_battery_data" + "_" + ind
    }).css('display', 'block')
    $(inp).appendTo($('#add-browse').closest('dd'))
}

function fMoldRCARequestData(oForm){
  var oFormData  = $('<div />')
    .appendTo('body')
    .append(
      $('<h2 />', {
        text: "Root Cause Analysis Request"})
        .css('font-family', 'arial, helvetica, sans-serif')
        .css('font-size', '18px')
    )
    .append(
      $('<div />')
        .append($('<span />', {
          text: 'Additional Notes & Instructions:'})
          .css('font-family', 'arial, helvetica, sans-serif')
          .css('font-size', '12px')
          .css('font-weight', 'bold'))
        .append(
          $('<ul />')
            .css('font-family', 'arial, helvetica, sans-serif')
            .css('font-style', 'italic')
            .css('font-size', '12px')
            .css('margin-top', '0px')
            .append($('<li />', {
              html: 'A conference call to discuss the details of this request will be scheduled immediately.<br/>' +
                    'Attendance at this call for all responding service engineers is required.'
            }))
        )
    )
    .append(oForm.data('data'))
    .addClass('rcar-form-submission')
    
  var oCENumber  = oFormData.find('td:nth-child(1):contains("Customer Engineer Number")').parent().remove();
  var oCustPhone = oFormData.find('td:nth-child(1):contains("Customer Contact\'s Phone")').parent().remove();
  var oCustEmail = oFormData.find('td:nth-child(1):contains("Customer Contact\'s Email")').parent().remove();
  var oClockStat = oFormData.find('td:nth-child(1):contains("UPS Clock Status")').parent().remove();
  
  oFormData.find('tr').each(function(cFormRow_i, cFormRow_o){
    var oThisLabl = $(cFormRow_o).children('td:nth-child(1)')
      .css('font-weight', 'bold')
      .css('background', '#ebebeb')
      .css('margin', '3px 25px 3px 10px')
      .css('font-family', 'arial, helvetica, sans-serif')
      .css('font-size', '12px');
    var oThisData = $(cFormRow_o).children('td:nth-child(2)')
      .css('background', '#ebebeb')
      .css('margin', '3px 25px 3px 10px')
      .css('font-family', 'arial, helvetica, sans-serif')
      .css('font-size', '12px');
      
    switch(oThisLabl.text()){
      case 'Customer Engineer Name':
        if($(oCENumber).find('td:nth-child(2)').text().length > 2){
          oThisData.html(function(){
            return oThisData.html() + " (" + $(oCENumber).find('td:nth-child(2)').html() + ")" }) }
        break;
      case 'Customer Contact':
        if($(oCustPhone).find('td:nth-child(2)').text().length > 2){
          oThisData.html(function(){
            return oThisData.html() + "<br />(T) " + $(oCustPhone).find('td:nth-child(2)').html()}) }
        if($(oCustEmail).find('td:nth-child(2)').text().length > 2){
          oThisData.html(function(){
            return oThisData.html() + "<br />(E) " + $(oCustEmail).find('td:nth-child(2)').html()}) }
        break;
      case 'UPS Clock':
        if(!isNaN(oThisData.text()) && oThisData.text() != 0){
          oThisData.html(function(){
            return oThisData.html() + " minute(s) " + $(oClockStat).find('td:nth-child(2)').html() }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
      case 'Manually Recorded Alarms': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
      case 'Parts Status':
        if(oThisData.text().length > 3){
          $('.rcar-form-submission').find('ul')
            .append(
              $('<li />', {
                html: 'All parts MUST be returned immediately with this request (within 48 hours).<br />' +
                    'Delays will result in the cancellation of this request.<br />' +
                    'Escalate to your District Manager for part return delays that are beyond your control.'})
                .css('color','red'))
            .append(
              $('<li />', {
                html: 'In Parts Status in the table below, highlight the parts suspected to be the cause of the event.'}))
        }
        break;
      case 'Magnetic Evaluator Form': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }        
        break;
      case 'TVSS Questionnaire': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
      case 'RCAR Photos': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
        case 'RCAR Photos': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
      case 'Event Logs/Downloads': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
      case 'RCAR Single-line': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
      case 'RCAR Oscilloscope': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
      case 'RCAR Thermal Data': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
      case 'RCAR Battery Data': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;
      case 'Customer Letter Prepared Draft': 
        if(oThisData.text().length > 3){
          oThisData.html(function(){
            var sFile = fLoadFileAttachment(oThisData.text())
            return "See attached " + sFile + " file." }) }
        else{
            oThisData.parent('tr').remove(); }    
        break;  
      default:
        if((isNaN(oThisData.text()) && oThisData.text().length <= 1)
        ||(!isNaN(oThisData.text()) && oThisData.text() == 0)){
          oThisData.parent('tr').remove();    
        }
        break;
    }
  })
  
  var oRebuiltData = oFormData.remove();
  oForm.data('data',oRebuiltData);
}