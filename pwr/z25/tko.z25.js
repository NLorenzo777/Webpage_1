
$(document).ready(function(){
    fCreateBIBCookie();
    fLatestFWVer();
    fInpStyle();
    fDivDynamic();
    fDivDynamic2();
    fStyleProcedureChecklist();
    fStyleProcedureChecklist2();
    fSetSchemLink();
    fImportantParametersHideFeature();
})


/*************************/

/*  Important Parameters Comparator Map  */
const ImpParam = [
    "P69.00",
    "P81.01",
    "P100.00",
    "P104.00",
    "P104.01",
    "P104.02",
    "P129.00",
    "P137.01",
    "P137.02",
    "P137.03",
    "P358.01",
    "P358.02",
    "P361.01",
    "P366.01",
    "P580.00",
    "P585.03",
    "P585.04",
    "P585.05",
    "P700.00",
    "P1069.00",
    "P1134.01",
    "P1134.02",
    "P1134.03",
    "P1134.04",
    "P1134.05",
    "P1134.06",
    "P1150.01",
    "P1157.01",
    "P1157.02",
    "P1280.01",
    "P1280.02",
    "P1280.03",
    "P1280.04",
    "P1280.05",
    "P1280.06",
    "P1280.07",
    "P1280.08",
    "P1280.09",
    "P1280.10",
    "P1280.11",
    "P1280.12",
    "P1280.13",
    "P1280.14",
    "P1402.00",
    "P1403.01",
    "P1403.02",
    "P1404.01",
    "P1404.02",
    "P1412.00",
    "P1414.01",
    "P1414.02",
    "P1414.03",
    "P1414.04",
    "P1415.01",
    "P1415.02",
    "P1416.00",
    "P1417.01",
    "P1417.02",
    "P1418.01",
    "P1418.02",
    "P1418.03",
    "P1418.04",
    "P1418.05",
    "P1418.06",
    "P1510.01",
    "P1510.02",
    "P1510.03",
    "P1510.04",
    "P1510.05",
    "P1511.01",
    "P1511.02",
    "P1511.03",
    "P1511.04",
    "P1511.05",
    "P1511.06",
    "P1513.01",
    "P1513.02",
    "P1513.03",
    "P1513.04",
    "P1513.05",
    "P1513.06",
    "P1731.51",
    "P1753.40",
    "P1753.45"
    ];


//Important Parameters Comparator - UNIVERSAL VARIABLES//
var macroDivContainer = "W51.0=4#W52.0=2#W1051.0=4#W1052.0=2#";
var ProposedParameterCount; //Number
var MacroList = []; //Array
var ProposedChanges_ID_Allocator = []; //Array
var proposedParameterId = []; //Array
var proposedValueId = []; //Array
var Param = []; //Array
var Value = []; //Array
var CompareStatus = false; //Boolean
var addedRow = 0; //Number
var PVIndex = 0;

function fImportantParametersHideFeature() {
    $('#beforeFileContent').hide();
    $('#afterFileContent').hide();
    $('#macro').hide();
}

function readAfterFile() {
    var fileInput = document.getElementById('afterFileInput');
    var fileContent = document.getElementById('afterFileContent');
    
    if (fileInput.files.length > 0) {
        var selectedFile = fileInput.files[0];
        var reader = new FileReader();
        
        reader.onload = function (e) {
            fileContent.textContent = e.target.result;
            var remove = document.getElementById('afterFileContent').textContent.replace(/ /g,"");
            document.getElementById('afterFileContent').innerHTML = remove;
            
            for (var i=0;i < ImpParam.length; i++) {
                var baseString = document.getElementById('afterFileContent').textContent + "P";
                var base = ImpParam[i];
                var targetId = base + "a";
                var target = baseString.search(base);
                var baseLength = base.length;
                var indexPointer = target + baseLength;
                var parameterContainer = [];
                var outputIndex = 0;
                var y = baseString.charAt(indexPointer);
                
                if (target == -1) {
                    document.getElementById(targetId).innerHTML = "N/F";
                }
                else {
                    do{
                        parameterContainer[outputIndex] = y;
                        outputIndex++;
                        indexPointer++;
                        y = baseString.charAt(indexPointer);
                    }
                    while (y != "P");
                    
                    //at this point, the value of the selected parameter is now stored in an array.
                    //the next step is to extract that value and translate it into STRING.
                    
                    var paramValue = ""; //null string
                    for(var j=0; j < parameterContainer.length; j++) {
                        paramValue += parameterContainer[j];
                        }
                    
                    //The parameter is now extracted but the unnecessary characters needs to be removed
                    var filteredParamValue = paramValue.replace(/[=]/g,"");
                    
                    //Case entries - This is where errors and unwanted values are filtered and fixed. For example, "00" values are transformed into "0"
                    //CAUTION: For future references, if a case needs to be added, please don't forget to add also the entry to the readBeforeFile() function.
                    if (filteredParamValue.search("Error") != -1) {
                        document.getElementById(targetId).innerHTML = "N/A";
                    }
                    else {
                        document.getElementById(targetId).innerHTML = parseInt(filteredParamValue);
                    }    
                }
            }       
        };
        reader.readAsText(selectedFile);
    }
    
    else {
        fileContent.textContent = 'No file selected.';
    }
}

function readBeforeFile() {
            var fileInput = document.getElementById('beforeFileInput'); //object
            var fileContent = document.getElementById('beforeFileContent'); //object

            if (fileInput.files.length > 0) {
                var selectedFile = fileInput.files[0];
                var reader = new FileReader();

                reader.onload = function (e) {
                    fileContent.textContent = e.target.result; //File content will be loaded to the page.
                    var remove = document.getElementById("beforeFileContent").textContent.replace(/ /g,"");
                    document.getElementById("beforeFileContent").innerHTML = remove;
                    
                    for (var i=0; i < ImpParam.length; i++) {
                        var baseString = document.getElementById("beforeFileContent").textContent + "P";
                        var base = ImpParam[i]; /*Call the certain parameter being searched. e.g. P61.00*/
                        var targetId = base + "b";
                        var target = baseString.search(base); /*this will return the index of where the string is located. */
                        var baseLength = base.length; /*this will return the size of the current parameter being focused. e.g. P61.00 has a length of 6.*/
                        var indexPointer = target + baseLength; //this is where another loop will start
                        var parameterContainer = [];
                        var outputIndex = 0;
                        var y = baseString.charAt(indexPointer);
                        
                        if (target == -1) {
                            document.getElementById(targetId).innerHTML = "N/F";
                        }
                        else {
                        
                        do {
                            parameterContainer[outputIndex] = y;
                            outputIndex++;
                            indexPointer++;
                            y = baseString.charAt(indexPointer);
                        }
                        while (y != "P");
                        
                        //at this point, the value of the selected parameter is now stored in an array.
                        //the next step is to extract that value and translate it into STRING.
                        
                        var paramValue = ""; //null string
                        for(var j=0; j < parameterContainer.length; j++) {
                            paramValue += parameterContainer[j];
                        }
                        
                        //The parameter is now extracted but the unnecessary characters needs to be removed
                        var filteredParamValue = paramValue.replace(/[=]/g,"");
                        
                        if (filteredParamValue.search("Error") != -1) {
                            document.getElementById(targetId).innerHTML = "N/A";
                            }
                        else {
                            document.getElementById(targetId).innerHTML = parseInt(filteredParamValue);
                            }    
                        }
                    }
                 };
                 reader.readAsText(selectedFile);
            } else {
                fileContent.textContent = 'No file selected.';
            }
        }

function fCompare() {
     //COMPARE INTERFACE STARTS HERE
     if(CompareStatus == false) {
                    
                    for (var k=0; k < ImpParam.length; k++) {
                        var cBase = ImpParam[k];
                        var cBeforeId = cBase + "b";
                        var cAfterId = cBase + "a";
                        var beforeParameter = document.getElementById(cBeforeId).textContent; //String
                        var afterParameter = document.getElementById(cAfterId).textContent; //String
                        var styleBeforeParameter = document.getElementById(cBeforeId); //Object
                        var styleAfterParameter = document.getElementById(cAfterId); //Object
                        var proposedParameter = ImpParam[k];
                        var ProposedChangesTableLength = document.getElementById("Proposed-Changes-Table").rows.length - 3;
                        
                        
                        if (beforeParameter != afterParameter && beforeParameter != "N/A" && beforeParameter != "N/F" && PVIndex <= ProposedChangesTableLength) {
                            styleBeforeParameter.classList.add("highlight1");
                            styleAfterParameter.classList.add("highlight1");
                            Param[PVIndex] = proposedParameter.replace("P","W");
                            Value[PVIndex] = beforeParameter; //#####
                            var PVIndex_string = PVIndex.toString();
                            var paramId = "Param" + PVIndex_string;
                            var valueId = "Value" + PVIndex_string;
                            var parameterContainer = Param[PVIndex];
                            var valueContainer = parseInt(Value[PVIndex]);
                            document.getElementById(paramId).innerHTML = parameterContainer;
                            document.getElementById(valueId).innerHTML = valueContainer;
                            $('#' + paramId).addClass("proposedParameter");
                            $('#' + valueId).addClass("proposedValue");
                            $("#" + valueId).attr('ondblclick', 'editTextVerifier(this)');
                            var macroElement = document.getElementById(paramId).textContent + "=" + document.getElementById(valueId).textContent + "#"; //#####
                            macroDivContainer += macroElement;
                            MacroList[PVIndex] = macroElement;
                            PVIndex++; //number
                        }
                        else if (beforeParameter != afterParameter && beforeParameter != "N/A" && beforeParameter != "N/F" && PVIndex > ProposedChangesTableLength) {
                            fProposedChangesScrollOn()
                            styleBeforeParameter.classList.add("highlight1");
                            styleAfterParameter.classList.add("highlight1");
                            Param[PVIndex] = proposedParameter.replace("P","W");
                            Value[PVIndex] = beforeParameter; //#####
                            var PVIndex_string = PVIndex.toString();
                            var paramId = "Param" + PVIndex_string;
                            var valueId = "Value" + PVIndex_string;
                            var parameterContainer = Param[PVIndex];
                            var valueContainer = parseInt(Value[PVIndex]);
                            
                            var proposedChangesTable = document.getElementById("Proposed-Changes-Table");
                            var newRow = proposedChangesTable.insertRow(-1); //-1 means last row
                            var proposedParameterCell = newRow.insertCell(0);
                            var proposedValueCell = newRow.insertCell(1);
                            
                            proposedParameterCell.setAttribute("id",paramId);
                            proposedValueCell.setAttribute("id",valueId);
                            proposedParameterCell.classList.add("proposedParameter");
                            proposedValueCell.classList.add("proposedValue");
                            proposedValueCell.setAttribute('ondblclick', 'editTextVerifier(this)');
                            
                            document.getElementById(paramId).innerHTML = parameterContainer;
                            document.getElementById(valueId).innerHTML = valueContainer;
                            
                            var macroElement = document.getElementById(paramId).textContent + "=" + document.getElementById(valueId).textContent + "#"; //#####
                            macroDivContainer += macroElement;
                            MacroList[PVIndex] = macroElement;
                            addedRow++; //number
                            PVIndex++; //number
                        }
                        else {
                            if (beforeParameter != afterParameter) {
                                
                            styleBeforeParameter.classList.add("highlight1");
                            styleAfterParameter.classList.add("highlight1");
                            }
                            continue;
                        }
                    }
                    
                    //0 and 19
                    if (document.getElementById("P69.00b").textContent == document.getElementById("P69.00a").textContent && 
                    document.getElementById("P1069.00b").textContent == document.getElementById("P1069.00a").textContent && 
                    document.getElementById("P69.00b").textContent == document.getElementById("P1069.00b").textContent && 
                    document.getElementById("P69.00a").textContent == document.getElementById("P1069.00a").textContent) {
                        document.getElementById('macro').innerHTML = macroDivContainer;
                        ProposedParameterCount = PVIndex;
                        fScanProposedChange();
                        }
                    else{
                        document.getElementById("P69.00b").classList.add("invalid");
                        document.getElementById("P69.00a").classList.add("invalid");
                        document.getElementById("P1069.00b").classList.add("invalid");
                        document.getElementById("P1069.00a").classList.add("invalid");
                        window.alert("The Power Class parameters (P69.0 & P1069.0) are not set properly. Return to the \"Parameter Reset\" step of the Complete Flash Upgrade procedure.")
                        $("#CreateMacro").attr('disabled', 'disabled');
                    }
                    CompareStatus = true;
         
     }
                    }
                  
function fCreateMacro() {

    //Date and Time codes
    const date = new Date();
    var Year = date.getFullYear().toString();
    var Month = (date.getMonth() + 1).toString();
    var Day = date.getDate().toString();
    var Hour = date.getHours().toString();
    var Min = date.getMinutes().toString();
    var Sec = date.getSeconds().toString();
    var macroContent = document.getElementById('macro').textContent.replace(/(\r\n|\n|\r)/gm,'');
    
    var blob = new Blob([macroContent],{type: "text/plain"}); // BLOB = Binary Large Object --> Used for transportation of data.
     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                // For Internet Explorer
                window.navigator.msSaveOrOpenBlob(blob, "ImportantMacro_" + Year + "-" + Month + "-" + Day + "_" + Hour + Min + Sec + ".txt");
            } else {
                // For other modern browsers
                var a = document.createElement("a");
                a.download = "ImportantMacro_" + Year + "-" + Month + "-" + Day + "_" + Hour + Min + Sec + ".txt"
                a.href = window.URL.createObjectURL(blob);
                a.click();
            }
}

function editTextVerifier(cell) {
    var userInput = confirm("Do you want to edit the value of this proposed parameter?");
    if (userInput == true){
        
    // Get the current text content of the cell
    var currentText = cell.innerText;

    // Create an input element
    var inputElement = document.createElement("input");
    inputElement.type = "number";
    inputElement.className = "value";
    inputElement.value = currentText;

    // Replace the cell's content with the input element
    cell.innerHTML = "";
    cell.appendChild(inputElement);

    // Focus on the input element
    inputElement.focus();

    // Add an event listener to handle the Enter key
    inputElement.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        // Update the cell's content with the input value when Enter is pressed
        cell.innerText = inputElement.value;
        fScanProposedChange();
      }
    });

    // Add an event listener to handle clicking outside the input element
    document.addEventListener("click", function(event) {
      if (!cell.contains(event.target)) {
        // Update the cell's content with the input value when clicking outside the input
        cell.innerText = inputElement.value;
        fScanProposedChange();
      }
    });
    }
}

function fScanProposedChange() {
    var macroDivContainer = "W51.0=4#W52.0=2#W1051.0=4#W1052.0=2#"; //default value
    for (var q = 0; q < ProposedParameterCount; q++) {
    var paramId = "Param" + q;
    var valueId = "Value" + q;
    var macroElement = document.getElementById(paramId).textContent + "=" + document.getElementById(valueId).textContent + "#"; //#####
    macroDivContainer += macroElement;
    }
    document.getElementById('macro').innerHTML = macroDivContainer;
    
}

function fClearSheet() {

    //reset the before and after Form
    document.getElementById('beforeForm').reset();
    document.getElementById('afterForm').reset();
    
    //reset data
    document.getElementById('beforeFileContent').innerHTML = "";
    document.getElementById('afterFileContent').innerHTML = "";
    document.getElementById('macro').innerHTML = "";
    
    //Re-enable create macro if disabled
    var oCreateMacro = document.getElementById("CreateMacro");
    oCreateMacro.removeAttribute("disabled")

    for(var r = 0; r < ImpParam.length; r++){
        var clearBase = ImpParam[r];
        var clearBeforeParameterId = clearBase + "b";
        var clearAfterParameterId = clearBase + "a";
        
        //Remove content and class of before parameters
        document.getElementById(clearBeforeParameterId).classList.remove("highlight1");
        document.getElementById(clearBeforeParameterId).classList.remove("invalid");
        document.getElementById(clearBeforeParameterId).innerHTML = "&nbsp;";
        
        //Remove content and class of after parameters
        document.getElementById(clearAfterParameterId).classList.remove("highlight1");
        document.getElementById(clearAfterParameterId).classList.remove("invalid");
        document.getElementById(clearAfterParameterId).innerHTML = "&nbsp;";
    }
    
    //Remove excess data in Proposed Changes
    var proposedChangesTable = document.getElementById("Proposed-Changes-Table");
    var proposedChangesTableLength = proposedChangesTable.rows.length;
    
    //Destruct current proposedchanges table
    do {
        proposedChangesTable.deleteRow(-1);
        proposedChangesTableLength--;
    }
    while (proposedChangesTableLength != 2);
    
    //Restructure the Proposed Changes Table
    for (var u = 0; u < 10; u++) {
    var newRow = proposedChangesTable.insertRow(-1);
    var ParameterName = newRow.insertCell(0);
    ParameterName.setAttribute("id","Param" + u);
    var ParameterValue = newRow.insertCell(1);
    ParameterValue.setAttribute("id","Value" + u);
    
    ParameterName.innerHTML = "&nbsp;";
    ParameterValue.innerHTML = "&nbsp;";
    }
    
    //Reset all variables to default
    addedRow = 0;
    MacroList = [];
    Param = [];
    Value = [];
    CompareStatus = false;
    macroDivContainer = "W51.0=4#W52.0=2#W1051.0=4#W1052.0=2#";
    ProposedParameterCount; //Number
    proposedParameterId = []; //Array
    proposedValueId = []; //Array
    PVIndex = 0;
    fProposedChangesScrollOff();
    
}

function fProposedChangesScrollOn() {
    var proposedChangesDiv = document.getElementById("Proposed-Changes");
    var currentClass = proposedChangesDiv.classList;
    proposedChangesDiv.classList.remove(currentClass);
    proposedChangesDiv.classList.add("proposedChangesScrollOn")
}

function fProposedChangesScrollOff() {
    var proposedChangesDiv = document.getElementById("Proposed-Changes");
    var currentClass = proposedChangesDiv.classList;
    proposedChangesDiv.classList.remove(currentClass);
    proposedChangesDiv.classList.add("proposedChangesScrollOff")
}

/***********************/

function flaunchFlashUtil(){
  var sFlashUtilPath64 = "file:////C:/Program Files (x86)/Chloride Power/Flasher/Flasher.4.6.exe"
  var sFlashUtilPath32 = "file:////C:/Program Files/Chloride Power/Flasher/Flasher.4.6.exe"
  
  $.get(sFlashUtilPath64, function( data ) {
    top.location.href = sFlashUtilPath64
  }).fail(function() {
    $.get(sFlashUtilPath32, function( data ) {
      top.location.href = sFlashUtilPath32
    }).fail(function() {
      alert( "Flash Utility is currently not installed. You will be directed to the installation folder instead." );
      window.open("../../Flash/NFT/MUN_LCD")
    })
  })

}
/************************/  

var bProduction = false;

function fCalculateActivePower(){
    var n1 = document.getElementById('num1');
    var n2 = document.getElementById('num2');
    document.getElementById('output').innerHTML = "<strong>" + parseFloat(n1.value)*parseFloat(n2.value) + " kW</strong>";
}

function clearInput() {
    var getValue = document.getElementById('num1');
    if (getValue.value !=""){
        getValue.value = "";
    }
    var getValue2 = document.getElementById('num2');
    if (getValue2.value != "") {
        getValue2.value = "";
    }
    document.getElementById('output').innerHTML = "";
}

function fOpenLink1(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"http://connectivity.chloridepower.com/GetFile.asp?flID=412&IsSoftware=Y");
}

function fOpenLink2(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"http://java.com/en/download/windows-64bit.jsp");
}
  
/*function fOpenLink3(){  
  window.open("https://vertivco.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=b65d05b1-35a7-4869-b2d3-ab1f001a8ad8") }*/ 
  
 
function fOpenLink4(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/71f34b79-7328-4fc7-9f9f-45b346ed5fe8?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv1(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/3e3f9e9b-e188-4ae7-8194-6c219b905e66?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv2(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/dc86227a-ba0d-4417-9cf3-a44932ff8a3f?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv3(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/d73e4c64-1c08-4cbf-a579-06f1f05f97e7?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv4(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/7ede21d3-7225-46da-968b-c1bd87379c49?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv5(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/d21737ce-72cd-4751-b435-1abda454a91b?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv6(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/ee0e9b12-70cf-4d0e-ac9c-38790b78206e?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv7(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/de6f2dc6-9203-4a50-87a1-6fb3177f919f?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv8(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/d8fb8b7d-bb89-4c36-a1d3-9a6690c4f25d?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv9(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/4a1d405e-6333-4b94-b3a6-55c85c07ced5?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv10(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/f3a488d6-5c29-437c-b881-0b136fea4bda?autoplay=false&amp;showinfo=true");
}

function fOpenLink_myCEtv11(){
var shell = new ActiveXObject("WScript.Shell");
shell.run("msedge "+"https://web.microsoftstream.com/embed/video/75228438-c092-446c-b841-ef5a50f1a167?autoplay=false&amp;showinfo=true");
}

function fOpenLink_Kirkkey(){
    var shell = new ActiveXObject("WScript.Shell");
    shell.run("msedge "+"https://www.kirkkey.com/replacement-key-form/");
}

/*function fLaunchFlasher(){
  location.href = "C:/Program Files (x86)/Chloride Power/Flasher/Flasher.4.6.exe" }*/

function fLaunchC2oooProg(){
  location.href = "C:/Program Files/C2oooProg/C2oooProg.exe " }

	    var upsSize='';
       	var modelNum='';
       	var stringCnt='';
       	var prevTable='';
       	
       	function updateList(target,param){
       		var sel = $(target);
       		sel.empty();
       		$(param).each(
       		function() {
       			sel.append($("<option>").attr('value',this.val).text(this.text));
       		});
       	}
       	
       	function updateModelList(param){
       
       		switch (param){
       			case 'KVA225' :
       				var arr = [
       					{val : 0, text: ''},
       					{val: '16HX550FR'  ,text:'16HX550FR'  },
       					{val: '16HX800FR'  ,text:'16HX800FR'  },
       					{val: '16HX925FR'  ,text:'16HX925FR'  },
       					{val: 'UPS12300MR',text:'UPS12-300MR'},
       					{val: 'UPS12350MR',text:'UPS12-350MR'},
       					{val: 'UPS12400MR',text:'UPS12-400MR'},
       					{val: 'UPS12490MR',text:'UPS12-490MR'},
       					{val: 'UPS12540MR',text:'UPS12-540MR'},
       					{val: 'UPS12620MR',text:'UPS12-620MR'},
       					{val: '4DHR6500'   ,text:'4DHR6500'   },
       					{val: 'UPS31HR5000'   ,text:'31HR5000'   },
       					{val: 'HR3500ET'   ,text:'HR3500ET'   },
       					{val: 'UPSDEKAHR4000'   ,text:'HR4000'   },
       					{val: 'HR5500ET'   ,text:'HR5500ET'   },
       					{val: 'HR7500ET'   ,text:'HR7500ET'   },
       					{val: 'HX400'   ,text:'HX400'   },
       					{val: 'ENERSYSHX505'  ,text:'HX505'  },
       					{val: 'S12V300FR'  ,text:'S12V300FR'  },
       					{val: 'S12V370FR'  ,text:'S12V370FR'  },
       					{val: 'S12V500FR'  ,text:'S12V500FR'  },
       					{val: 'S6V740FR'   ,text:'S6V740FR'   }
       					
       				];
       				break;
       				
       			case 'KVA250' :
       				var arr = [
       					{val : 0, text: ''},
       					{val: '16HX550FR',text:'16HX550FR'},
       					{val: '16HX800FR',text:'16HX800FR'},
       					{val: '16HX925FR',text:'16HX925FR'},
       					{val: 'HX300FR',text:'HX300-FR'},
       					{val: 'HX330FR',text:'HX330-FR'},
       					{val: 'HX400FR',text:'HX400-FR'},
       					{val: 'HX505FR',text:'HX505-FR'},
       					{val: 'UPS12300MR',text:'UPS12-300MR'},
       					{val: 'UPS12350MR',text:'UPS12-350MR'},
       					{val: 'UPS12400MR',text:'UPS12-400MR'},
       					{val: 'UPS12490MR',text:'UPS12-490MR'},
       					{val: 'UPS12540MR',text:'UPS12-540MR'},
       					{val: 'UPS6620MR',text:'UPS6-620MR'},
       					{val: '4DHR6500',text:'4DHR6500'},
       					{val: 'HR3500ET',text:'HR3500ET'},
       					{val: 'HR5500ET',text:'HR5500ET'},
       					{val: 'HR7500ET',text:'HR7500ET'},
       					{val: 'S12V300FR',text:'S12V300FR'},
       					{val: 'S12V370FR',text:'S12V370FR'},
       					{val: 'S12V500FR',text:'S12V500FR'},
       					{val: 'S6V740FR',text:'S6V740FR'}
       				];
       				break;
       	
       			case 'KVA300' :
       				var arr = [
       					{val : 0, text: ''},
       					{val: '16HX550FR',text:'16HX550FR'  },
       					{val: '16HX800FR',text:'16HX800FR'  },
       					{val: '16HX925FR',text:'16HX925FR'  },
       					{val: 'HX300FR',text:'HX300-FR'  },
       					{val: 'HX330FR',text:'HX330-FR'  },
       					{val: 'HX400FR',text:'HX400-FR'  },
       					{val: 'HX505FR',text:'HX505-FR'  },
       					{val: 'HX540FR',text:'HX540-FR'  },
       					{val: 'UPS12300MR',text:'UPS12-300MR'  },
       					{val: 'UPS12350MR',text:'UPS12-350MR'  },
       					{val: 'UPS12400MR',text:'UPS12-400MR'  },
       					{val: 'UPS12490MR',text:'UPS12-490MR'  },
       					{val: 'UPS12540MR',text:'UPS12-540MR'  },
       					{val: 'UPS6620MR',text:'UPS6-620MR'  },
       					{val: '4DHR6500',text:'4DHR6500'  },
       					{val: 'UPS31HR5000'   ,text:'31HR5000'   },
       					{val: 'HR3500ET',text:'HR3500ET'  },
       					{val: 'HR4000ET',text:'HR4000ET'  },
       					{val: 'HR5500ET',text:'HR5500ET'  },
       					{val: 'HR7500ET',text:'HR7500ET'  },
       					{val: 'S12V300FR',text:'S12V300FR'  },
       					{val: 'S12V370FR',text:'S12V370FR'  },
       					{val: 'S12V500FR',text:'S12V500FR'  },
       					{val: 'S6V740FR',text:'S6V740FR'  }
       				];
       				break;	
       	
       			case 'KVA400' :
       				var arr = [
       					{val : 0, text: ''},
       					{val: '16HX550FR',text:'16HX550FR'  },
       					{val: '16HX800FR',text:'16HX800FR'  },
       					{val: '16HX925FR',text:'16HX925FR'  },
       					{val: 'HX300FR',text:'HX300-FR'  },
       					{val: 'HX330FR',text:'HX330-FR'  },
       					{val: 'HX400FR',text:'HX400-FR'  },
       					{val: 'HX505FR',text:'HX505-FR'  },
       					{val: 'HX540FR',text:'HX540-FR'  },
       					{val: 'UPS12300MR',text:'UPS12-300MR'  },
       					{val: 'UPS12350MR',text:'UPS12-350MR'  },
       					{val: 'UPS12400MR',text:'UPS12-400MR'  },
       					{val: 'UPS12490MR',text:'UPS12-490MR'  },
       					{val: 'UPS12540MR',text:'UPS12-540MR'  },
       					{val: 'UPS6620MR',text:'UPS6-620MR'  },
       					{val: '4DHR6500',text:'4DHR6500'  },
       					{val: 'HR3500ET',text:'HR3500ET'  },
       					{val: 'HR5500ET',text:'HR5500ET'  },
       					{val: 'HR7500ET',text:'HR7500ET'  },
       					{val: 'S12V300FR',text:'S12V300FR'  },
       					{val: 'S12V370FR',text:'S12V370FR'  },
       					{val: 'S12V500FR',text:'S12V500FR'  },
       					{val: 'S6V740FR',text:'S6V740FR'  }
       				];
       				break;	
       	
       			case 'KVA500' :
       				var arr = [
       					{val : 0, text: ''},
       					{val: '16HX550FR',text:'16HX550FR'  },
       					{val: '16HX800FR',text:'16HX800FR'  },
       					{val: '16HX925FR',text:'16HX925FR'  },
       					{val: '3AVR9523FR',text:'3AVR95-23FR'  },
       					{val: 'HX300FR',text:'HX300-FR'  },
       					{val: 'HX330FR',text:'HX330-FR'  },
       					{val: 'HX400FR',text:'HX400-FR'  },
       					{val: 'HX505FR',text:'HX505-FR'  },
       					{val: 'HX540FR',text:'HX540-FR'  },
       					{val: 'UPS12300MR',text:'UPS12-300MR'  },
       					{val: 'UPS12350MR',text:'UPS12-350MR'  },
       					{val: 'UPS12400MR',text:'UPS12-400MR'  },
       					{val: 'UPS12490MR',text:'UPS12-490MR'  },
       					{val: 'UPS12540MR',text:'UPS12-540MR'  },
       					{val: 'UPS6620MR',text:'UPS6-620MR'  },
       					{val: '4DHR6500',text:'4DHR6500'  },
       					{val: 'HR3500ET',text:'HR3500ET'  },
       					{val: 'HR5500ET',text:'HR5500ET'  },
       					{val: 'HR7500ET',text:'HR7500ET'  },
       					{val: 'S12V300FR',text:'S12V300FR'  },
       					{val: 'S12V370FR',text:'S12V370FR'  },
       					{val: 'S12V500FR',text:'S12V500FR'  },
       					{val: 'S6V740FR',text:'S6V740FR'  }
       				];
       				break;	
       				
       			case 'KVA600' :
       				var arr = [
       					{val : 0, text: ''},
       					{val: '16HX550FR',text:'16HX550FR'  },
       					{val: '16HX800FR',text:'16HX800FR'  },
       					{val: '16HX925FR',text:'16HX925FR'  },
       					{val: 'HX300FR',text:'HX300-FR'  },
       					{val: 'HX330FR',text:'HX330-FR'  },
       					{val: 'HX400FR',text:'HX400-FR'  },
       					{val: 'HX505FR',text:'HX505-FR'  },
       					{val: 'HX540FR',text:'HX540-FR'  },
       					{val: 'UPS12300MR',text:'UPS12-300MR'  },
       					{val: 'UPS12350MR',text:'UPS12-350MR'  },
       					{val: 'UPS12400MR',text:'UPS12-400MR'  },
       					{val: 'UPS12490MR',text:'UPS12-490MR'  },
       					{val: 'UPS12540MR',text:'UPS12-540MR'  },
       					{val: 'UPS6620MR',text:'UPS6-620MR'  },
       					{val: '4DHR6500',text:'4DHR6500'  },
       					{val: 'HR3500ET',text:'HR3500ET'  },
       					{val: 'HR5500ET',text:'HR5500ET'  },
       					{val: 'HR7500ET',text:'HR7500ET'  },
       					{val: 'S12V300FR',text:'S12V300FR'  },
       					{val: 'S12V370FR',text:'S12V370FR'  },
       					{val: 'S12V500FR',text:'S12V500FR'  },
       					{val: 'S6V740FR',text:'S6V740FR'  }
       				];
       				break;	
       			default :
       				var arr = [
       					{val : 0, text: ''}
       				];
       		}
       		
       		updateList('#batModelNum',arr);
       		
       		var def = [
       			{val : 0, text: ''}
       		];
       		updateList('#batStringCnt',def);
       	
       		upsSize=param;
       		modelNum='';
       		stringCnt='';
       		displayTable();
       	}
       	
       	function updateStringList(param){
       	
       		if (param == 0){
       			var arr = [
       				{val : 0, text: ''}
       			];
       		}else{
       			var arr = [
       				{val : 0, text: ''},
       				{val : 1, text: '1 String'},
       				{val : 2, text: '2 String'},
       				{val : 3, text: '3 String'},
       				{val : 4, text: '4 String'}
       			];
       		}
       
       		updateList('#batStringCnt',arr);
       		
       		modelNum=param;
       		stringCnt='';
       		displayTable();
       	}
       		
       	function updateStringCnt(param){
       		stringCnt=param;
       		displayTable();
       	}
       	
       	function displayTable(){
       		if (upsSize=='' || modelNum=='' || stringCnt=='' || stringCnt==0){
       			if (prevTable != ''){
       				document.getElementById(prevTable).style.display="none";
       			}
       			document.getElementById('emptySettings').style.display="";
       			prevTable='emptySettings';
       		}else{
       			
       			if (prevTable != ''){
       				document.getElementById(prevTable).style.display="none";
       			}
       			document.getElementById(upsSize+modelNum+stringCnt).style.display="";
       			prevTable=upsSize+modelNum+stringCnt;
       		}
       	}       

                        function CalcCalib(){
                          var inp1 = document.getElementById("input1").value;
                                                    
                          if(isNaN(inp1) ){
                            alert('Please enter a numerical value.');
                        }
                         else if(inp1 >8.3){
                            alert('Please enter a value less than 8.3.');
                            document.getElementById("result2").value = '';
                            document.getElementById("result1").value = '';
                        }
                          else if(inp1 <8.4 && inp1.length >0){
                              document.getElementById("result2").value = (21.6*inp1).toFixed(2) ;
                              document.getElementById("result1").value = ((3932.16*((1000/60)-inp1))  - 65536).toFixed(0);
                         }
                         else{
                             document.getElementById("result2").value = '';
                             document.getElementById("result1").value = '';
                         }
                         
                        }
                        function CalcCalib2(){
                          var inp3 = document.getElementById("input3").value;
                                                    
                          if(isNaN(inp3) ){
                            alert('Please enter a numerical value.');
                        }
                         else if(inp3 >180){
                            alert('Please enter a value less than 180.');
                            document.getElementById("result3").value = '';
                        }
                          else if(inp3 <181 && inp3.length >0){
                              document.getElementById("result3").value = ((182.045*((360)-inp3))  - 65536).toFixed(0);
                         }
                         else{
                             document.getElementById("result3").value = '';
                          }
                         
                        }
                        function CalcCalib3(){
                          var inp4 = document.getElementById("input4").value;
                                                    
                          if(isNaN(inp4) ){
                            alert('Please enter a numerical value.');
                        }
                         else if(inp4 >8.3){
                            alert('Please enter a value less than 8.3.');
                            document.getElementById("result4").value = '';
                            document.getElementById("result5").value = '';
                         }
                          else if(inp4 <8.4 && inp4.length >0){
                              document.getElementById("result5").value = (21.6*inp4).toFixed(2) ;
                              document.getElementById("result4").value = (3931.16*inp4).toFixed(0);
                         }
                         else{
                             document.getElementById("result4").value = '';
                             document.getElementById("result5").value = '';
                         }
                         
                        }
                        function CalcCalib4(){
                          var inp5 = document.getElementById("input5").value;
                                                    
                          if(isNaN(inp5) ){
                            alert('Please enter a numerical value.');
                        }
                         else if(inp5 >180){
                            alert('Please enter a value less than 180.');
                            document.getElementById("result6").value = '';
                        }
                          else if(inp5 <181 && inp5.length >0){
                              document.getElementById("result6").value = (182.045*inp5).toFixed(0) ;
                         }
                         else{
                             document.getElementById("result6").value = '';
                         }
                         
                        }
                        
function fCreateBIBCookie(){
var date = new Date();
    var coChecker = 'true'
    date.setTime(date.getTime()+(300*1000));
    var expires = "; expires="+date.toGMTString();

    document.cookie = 'BIBdoc=' + 'j1' + expires + '; path = /'
    document.cookie = 'BIBpage=' + $('meta[name=Filename]').attr('content') + expires + '; path = /'
}

function fLatestFWVer(){
    var ver = 'V112'
    $('.fwver').text(ver)
}


function fOpenLink_4661(){
    window.open('https://applications.liebert.com/bspweb/frmModelSelect.asp')
}
function fBuildDataForTxt($form) {
var header = $form.children('.site_info').find('input')
var inp = $form.children('.data').find('input')
var txtdata = ""

$(header).each(function(){
    var name=$(this).attr('title')
    var val = $(this).val()
    var data=name + ': ' + val + '<br/><br/>'
    txtdata += data
})
$(inp).each(function(){
    var name=$(this).attr('title')
    var val = $(this).val()
    var data=name + ': ' + val + '<br/>'
    txtdata += data
})
return txtdata
}
  

function fExporttoCSV(){
    
    if (($('#siteid').val() == "")||($('#tagnum').val() == "")){
        alert("Please enter a valid Site ID and Tag Number.")
    }
    else {
        var date = fReturnDate()
        var filename = 'site' + $('#siteid').val() + '_tag' + $('#tagnum').val() + '_' + date
        var data=fBuildDataForTxt($('.stored-form'))
        //var $div = $('<div />', {text:data}).appendTo('.stored-form')
        
        var IEwindow = window.open();
        IEwindow.document.write(data);
        IEwindow.document.close();
        IEwindow.document.execCommand('SaveAs', true, filename + '_exls1.txt');
        IEwindow.close();
    }
    }

function fInpStyle(){
    var inp=$('.inp_form').css({
        width: '75px'
    })
    $(inp).click(function(){
        //var val1 = $(this).val()
        $(this).val('')
        //alert(val1)
    })
}
function fReturnDate(){
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yy = today.getFullYear().toString().substr(2,2);

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

var d = mm.toString() + dd.toString() +  yy.toString();
return d

}

function fDivDynamic(){
    if ($('.div-dynamic').length > 0){
    $('.div-dynamic').each(function(i,val){
        var div = $(this).children('div')
        var linkholder = $('<div />').insertBefore($(this)).addClass('quick-box')
        var label = $('<div />').text('Select Content to Display:').appendTo($(linkholder)).addClass('label').css({width: '180px'})
        var index = $('<div />').appendTo($(linkholder)).addClass('icon-index')
        
        $(div).each(function(){
            var title = $(this).children().eq(0).text()
            var link = $(this).attr('id', 'link_' + i + '_' + $(this).index())
            $('<div />').html($('<span />',{
            text: title,
            href: '#' + $(this).attr('id')})
            .click(function(){
                index.find('.selected').removeClass('selected')
                var src = $(this).attr('href')
                div.filter(src).fadeIn(1000)
                div.not(src).hide()
                $(this).addClass('selected')
            })
            .css({
                'padding-left':'17px',
                'text-decoration': 'underline',
                'cursor': 'pointer'
            })
            )
            .appendTo(index)
        })
        index.find('span').eq(0).addClass('selected')
        div.not(':first').css('display', 'none')    
        
    })
    }
}

function fDivDynamic2(){
    if ($('.div-dynamic2').length > 0){
    $('.div-dynamic2').each(function(i,val){
        var div = $(this).children('div')
        var linkholder = $('<div />').insertBefore($(this)).addClass('quick-box')
        var label = $('<div />').text('Select Content to Display:').appendTo($(linkholder)).addClass('label').css({width: '180px'})
        var index = $('<div />').appendTo($(linkholder)).addClass('icon-index')
        
        $(div).each(function(){
            var title = $(this).children().eq(0).text()
            var link = $(this).attr('id', 'link_' + i + '_' + $(this).index())
            $('<div />').html($('<span />',{
            text: title,
            href: '#' + $(this).attr('id')})
            .click(function(){
                index.find('.selected').removeClass('selected')
                var src = $(this).attr('href')
                div.filter(src).fadeIn(500)
                div.not(src).hide()
                $(this).addClass('selected')
            })
            .css({
                'padding-left':'17px',
                'text-decoration': 'underline',
                'cursor': 'pointer'
            })
            )
            .appendTo(index)
            $(this).find('a[href^=#link]').click(function(){
                index.find('.selected').removeClass('selected')
                var src = $(this).attr('href')
                div.filter(src).fadeIn(500)
                div.not(src).hide()
                $(index).find('span').filter(function(){return $(this).attr('href') == src}).addClass('selected')
            })
        })
        index.find('span').eq(0).addClass('selected')
        div.not(':first').css('display', 'none')    
        
    })
    }
}

function fStyleProcedureChecklist(){
  var sCurrentFile = $('meta[name=Filename]').attr("content");  
  $('div[class=checklist-procedure]').each(function(oProcCheckList_i, oProcCheckList_o){
    
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
        .css('position', 'absolute' ).css('left', -7)
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

function fStyleProcedureChecklist2(){
  var sCurrentFile = $('meta[name=Filename]').attr("content");  
  $('div[class=checklist-procedure2]').each(function(oProcCheckList2_i, oProcCheckList2_o){
    
    //move the list a bit to give space to the checkbox
    $(oProcCheckList2_o).children('ol, ul')
    
    //for all list items that have an ID:
    //add a checkbox, which when clicked, gets stored (jStorage) and disabled
    //before a clicked checkbox is stored, ask for confirmation from the user.
    var cStep = $(oProcCheckList2_o).find('li[id^=step]')
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
        .css('position', 'absolute' ).css('left', -5)
        .prop('checked', function(){return bPerformed==1 ? true : false})
        .prop('disabled', function(){return bPerformed==1 ? true : false})
        .css('background', function(){return bPerformed==1 ? 'pink': '#ffffff'})
        
    })
    
    //check if any of the procedures have been performed already;
    //if so, add a note on how to clear the stored-and-disabled checkboxes
    if($(oProcCheckList2_o).find('input[type=checkbox]:checked').length > 0){
      $('<span />')
        .prependTo($(oProcCheckList2_o))
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

function fStyleDivDropdownSelector(){
    var cTableSet = $('.div-selector');
    if(cTableSet.length>0){
      cTableSet.each(function(cTableSet_i, cTableSet_o){
        var oSelectorHolder = $('<div/>')
          .insertBefore($(cTableSet_o).children()[0])
        var oSelectorLabel = $('<span/>',{
             text: 'Select content to Display:' })
          .appendTo(oSelectorHolder)
          .addClass('selector-table-label')
          //.css('display','block')
        var cTable = $(cTableSet_o)
          .find('div[class=section]').parent('div')
          .hide();
        var oDropDown = $('<select/>')
          .appendTo($(oSelectorHolder))
          .change(function(){
            cTable
              .hide()
              .eq($(this).find('option:selected').index()).fadeIn(); })
        cTable.eq(0).fadeIn();
       
        $(cTableSet_o).find('div[class=section]').each(function(cTable_i, cTable_o){
          var oTableHolder = $(cTableSet_o).find('div[class=section]').parent('div');
          var sTableTitle = $(cTable_o).find('h2').text();
          $('<option/>',{text: sTableTitle, value: cTable_i }).appendTo(oDropDown);
        })
      })
        $('.div-selector').children('div').css({
            'margin-top': '0px',
            'margin-bottom':'0px'
        })
        $('.div-selector h2').css('border-top', 'none');
            $('h2').parent().css({
            'border-top': 'none'
        });
        $('.section-padding').remove()
    }
}

function fSetSchemLink() {
  jqXHR = $.get('tko.schem.clr', function(data){
    if(data.documentElement){
      $xmlDoc = $(data.documentElement) }
    else{
      $xmlDoc = $.parseXML(data);
      $xmlDoc = $($xmlDoc);
      }
      fCreateSxhLink($xmlDoc)
  })
function fCreateSxhLink(xml) {
    var sxh = $('span[class^=sxh]')
    $(sxh).each(function(){
        var ref=$(this).attr('class').split('_')[1]
        var x_mdb = $(xml).find('ref').filter(function(){
            if($(this).text() == ref){
                return this
            }
        }).siblings('mdb')
        var rev = x_mdb.siblings('rev').text()
        var dwg = x_mdb.siblings('drawing').text()
        
        $(this).replaceWith($('<a />', {
            href: 'sxh  100,' + x_mdb.text(),
            text: dwg + ' R' + rev
        }))
    })
    fSetReviewSchematicLink()
}  
  
}

function fLoadXML(sLink){
  jqXHR = $.get(sLink, function(data){
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

function fClearSelect(){
    $('select').each(function(){
        $(this).find('option').eq(0).attr('selected', 'selected')
    })
}

function fLibClearTab(tab){
    tab.find('tr').each(function(){
        $(this).find('td:not(:first)').html('')
    })
}

function fCreateLibSetTable(oSetting, $tab){
    if (oSetting.length == 1) {
        $($tab).find('td').eq(1).html($(oSetting).find('pnu1510_1').text())
        $($tab).find('td').eq(5).html($(oSetting).find('pnu1510_2').text())
        $($tab).find('td').eq(9).html($(oSetting).find('pnu1510_3').text())
        $($tab).find('td').eq(13).html($(oSetting).find('pnu1510_4').text())
        $($tab).find('td').eq(17).html($(oSetting).find('pnu1510_5').text())
        $($tab).find('td').eq(21).html($(oSetting).find('pnu1510_6').text())
        
        $($tab).find('td').eq(2).html($(oSetting).find('pnu1511_1').text())
        $($tab).find('td').eq(6).html($(oSetting).find('pnu1511_2').text())
        $($tab).find('td').eq(10).html($(oSetting).find('pnu1511_3').text())
        $($tab).find('td').eq(14).html($(oSetting).find('pnu1511_4').text())
        $($tab).find('td').eq(18).html($(oSetting).find('pnu1511_5').text())
        $($tab).find('td').eq(22).html($(oSetting).find('pnu1511_6').text())
        
        $($tab).find('td').eq(3).html($(oSetting).find('pnu1513_1').text())
        $($tab).find('td').eq(7).html($(oSetting).find('pnu1513_2').text())
        $($tab).find('td').eq(11).html($(oSetting).find('pnu1513_3').text())
        $($tab).find('td').eq(15).html($(oSetting).find('pnu1513_4').text())
        $($tab).find('td').eq(19).html($(oSetting).find('pnu1513_5').text())
        $($tab).find('td').eq(23).html($(oSetting).find('pnu1513_6').text())
        
   }
   else {
        fLibClearTab($tab)
   }
}

function fCreatePNU1530Tab(rating, strNum, arr){
    var $tab = $('#lib_pnu1530 table')
    var rateArr = ['250', '300', '400', '400E', 
                   '500', '600', '625', '750', 
                   '800', '1000', '1100', '1200', 
                   '1250']
    var p1530maxArr = [651, 781, 1042, 1042, 
                   1302, 1563, 1628, 1953, 
                   2083, 2604, 2865, 3125,
                   3255]
    var p1530Max = p1530maxArr[jQuery.inArray(rating,rateArr)]
    
    var p1530 = arr[parseInt(strNum)-1] > p1530Max ? p1530Max : arr[parseInt(strNum)-1] 
    
    //alert(p1530Max)
    
    $tab.find('td').eq(0).text(strNum)
    $tab.find('td').eq(1).text(p1530)
    
    
}

function fLoadSamLibCalc(){
fLoadXML('tko.libsam.clr')
fClearSelect()

var pnu1530 = [220, 440, 660, 880, 1100, 1320, 1540, 1760, 1980, 2200, 2420, 2640]

var $tab = $('#lib_setting table')
 
jqXHR.done(function(){
    $('select').change(function(){
        var sRating = $('select[name=rating]').val()
        var sPnu1605 = $('select[name=pnu1605]').val()
        var sCellNum = $('select[name=cellnum]').val()
        var sStringNum = $('select[name=stringnum]').val()
        
        if((sRating != "")&&(sPnu1605 != "")&&(sCellNum != "")&&(sStringNum != "")){
           var oSetting = $($oFunctionNode).filter(function(){
               return ($(this).attr('rating') == sRating)&&($(this).attr('pnu1605') == sPnu1605)&&($(this).attr('cellnum') == sCellNum)&&($(this).attr('stringnum') == sStringNum)
           })        
           fCreateLibSetTable(oSetting, $tab) 
           fCreatePNU1530Tab(sRating, sStringNum, pnu1530)
           
        }
        else {
           fLibClearTab($tab)
        }
        
    })
    
    $('select[name=rating]').change(function(){
       $('select[name=stringnum]').find('option').not(":eq(0)").remove()
       var sRating = $('select[name=rating]').val()
        
        if (sRating != ""){
           var arrStr = []
           var oSetting = $($oFunctionNode).filter(function(){
               return ($(this).attr('rating') == sRating)
           })
           
           $(oSetting).each(function(){
               var sStr = $(this).attr('stringnum')
               fUniqueArray(sStr,arrStr)
           })
           fLoadOptions(arrStr, $('select[name=stringnum]'))
        }    
    })
})
}

function fLoadHPLLibCalc(){
fLoadXML('tko.libhpl.clr')
fClearSelect()

var $tab = $('#lib_setting table')
var pnu1530 = [300, 500, 700, 800, 900, 1000, 1100, 1200, 1200]


jqXHR.done(function(){  
    $('select').change(function(){
        var sRating = $('select[name=rating]').val()
        var sPnu1605 = $('select[name=pnu1605]').val()
        var sCelTemp = $('select[name=celtemp]').val()
        var sStringNum = $('select[name=stringnum]').val()
        
        if((sRating != "")&&(sPnu1605 != "")&&(sCelTemp != "")&&(sStringNum != "")){
           var oSetting = $($oFunctionNode).filter(function(){
               return ($(this).attr('rating') == sRating)&&($(this).attr('pnu1605') == sPnu1605)&&($(this).attr('celtemp') == sCelTemp)&&($(this).attr('cellnum') == '132')&&($(this).attr('stringnum') == sStringNum)
           })         
            
           fCreateLibSetTable(oSetting, $tab) 
           fCreatePNU1530Tab(sRating, sStringNum, pnu1530)
        }
        else {
           fLibClearTab($tab)
        }
    })
    
        $('select[name=rating]').change(function(){
       $('select[name=stringnum]').find('option').not(":eq(0)").remove()
       var sRating = $('select[name=rating]').val()
        
        if (sRating != ""){
           var arrStr = []
           var oSetting = $($oFunctionNode).filter(function(){
               return ($(this).attr('rating') == sRating)
           })
           
           $(oSetting).each(function(){
               var sStr = $(this).attr('stringnum')
               fUniqueArray(sStr,arrStr)
           })
           fLoadOptions(arrStr, $('select[name=stringnum]'))
        }    
    })
})
}

function fCalcPNU1530(){
fClearSelect()
$('input').val('')

    $('select#rating').change(function(){
        fCalcPNU1530Val()
        //fCalcPNU1402Val()
    })
    
    $('input#padc').keyup(function(){
    if (!(isNaN($(this).val()))){
        fCalcPNU1530Val()
        //fCalcPNU1402Val()
    }
    else {
        $(this).val('')
    }
    })
    
    
function fCalcPNU1530Val(){
    var inpRateArr = $('#rating').val().split('_')
    var inpRate = parseInt(inpRateArr[0])
    var inpMaxAmp = parseInt(inpRateArr[1])
    var inpPADC = parseInt($('input#padc').val())
    
    var error = $('<td />', {
        html: 'The entered value must not exceed <strong>' + inpMaxAmp + '</strong> for ' + inpRate + 'kVA.'
    }).css({
        'color': 'red',
        'font-size': '0.9em',
        'font-style': 'italic',
        'background-color': 'transparent',
        'display': 'none'
    })
    
    $('#padc').closest('tr').find('td').not(":eq(0)").remove()
    if (inpPADC != ""){
        var val = inpPADC * 10
            if (!(isNaN(val)) && (inpMaxAmp >= inpPADC)) {
                $('#pnu1530').html('<strong>' + val + '</strong>')
                $('input#ADC').removeAttr('disabled')
            }
            else if (inpPADC > inpMaxAmp){
                $(error).appendTo($('#padc').closest('tr')).fadeIn('fast')
                $('#pnu1530').html('')
                $('input#ADC').attr('disabled', 'disabled')
                $('#pnu1402').html('')
            }
            else {
                $('#pnu1530').html('')
                $('input#ADC').attr('disabled', 'disabled')
                $('#pnu1402').html('')
            }
    }
    
    }
}

function fCalcPNU1402(){
fClearSelect()
$('input').val('')


    $('#ADC, #p1530').keyup(function(){
        $('#ADC').closest('tr').find('td').not(":eq(0)").remove()
        
        if (($('#ADC').val() != '') && ($('#p1530').val() != '')){
            var vADC = parseInt($('#ADC').val())
            var vP1530 = parseInt($('#p1530').val())
            var error = $('<td />', {
                html: 'The entered value must not exceed <strong>' + vP1530/10 + '</strong>.'
            }).css({
                'color': 'red',
                'font-size': '0.9em',
                'font-style': 'italic',
                'background-color': 'transparent',
                'display': 'none'
            })
            var val = vADC*1000/vP1530
                if (vADC <= vP1530) {
                    $('#pnu1402').html('<strong>' + (val).toFixed(0) + '</strong>')
                }
                else if (vADC > vP1530){
                    $(error).appendTo($('#ADC').closest('tr')).fadeIn('fast')
                    $('#pnu1402').html('')
                }
                else {
                    $('#pnu1402').html('')
                }
                
        }
            
        })
   
}

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
function fImgOverLay(){
var cImgLay = $('[class|=lay]')
var cRefModal = $('.ref-modal').filter(function(){
    return $(this).siblings('.ref-target').find('[class|=lay]')[0];
        }).css({
        'background':'none',
        'padding-right':'0px'
      })
           
if($('#lay-board').length > 0) {
var imgDiv = $('#lay-board').clone()
            .addClass('imgLayBrd')
            .removeAttr('id')
$(imgDiv).prependTo(cImgLay.closest('div'))
}

//calculate size and position of overlay      
$(cImgLay).ready(function(){
    $(cImgLay).load(function(){
        var layClass = $(this).attr('class')
        var xpos = parseInt(layClass.substring(layClass.substring().indexOf('-')+1,layClass.substring().indexOf('_')+1))
        var ypos = parseInt(layClass.substring(layClass.substring().indexOf('_')+1))
        var layWidth = $(this).width()
        var wImgBrd = $(this).prev('img').width()
        var hImgBrd = $(this).prev('img').height()
        var widthRatio = layWidth/wImgBrd
        $(this).css({
            'position':'absolute',
            'top':100*xpos/hImgBrd + '%',
            'left':100*ypos/wImgBrd + '%',
            'width':100*widthRatio + '%'
        })
        .closest('div').css({
               'position':'relative',
               'max-width':'600px'
           }).closest('.ref-target').css({
               'margin': '0',
               'position':'relative',
               'max-width':wImgBrd
           }).closest('#modal-message').css({
               'width':'auto',
               'padding-top':'0px',
               'padding-bottom':'0px'
           })
})
})
}