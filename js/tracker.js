//let mauticSrc = "https://leads.weberealty.com";
//let mauticSrc = "https://leads-blue.weberealty.com";
let mauticSrc = "https://beta.eastbayinfo.org";
//let mauticSrc = "https://alpha.eastbayinfo.org";
//let mauticSrc = "https://pilotdev2.eastbayinfo.org";
//let mauticSrc = "https://mautic.weberealty.com";
let infoCollectionFormName = "infocollection";
let infoCollectionFormID = "47";
let defaultFormName = "defaulta";
let defaultFormID = "49";
let shareFormName = "share";
let shareFormID = "46";
let referFormName = "refer";
let referFormID = "45";
let assetFormName = "asset";
let assetFormID = "48";
let formName = defaultFormName;
let formID = defaultFormID;
let progressiveForms = 0;
let formHeader = "Your HomeSold Guaranteed or I\'ll Buy it! \nComplete form below to get this Guarantee:";
let popupForm = false;
let timeInterval = 60000;
let nTimes = 3;
let zDuration = 300000;

function getSearchParams(url_string){
  var params2 = {}
  try {
    var url = new URL(url_string);
    var search = url.search;
    search.substr(1).split('&').forEach(function(pair) {
      var keyValues = pair.split('=')
      params2[keyValues[0]] = keyValues[1]
    })
  } catch (e) {
    console.log(e)
  }
  return params2;
}

function getQueryParameter(name){
  var value;
  try {
    value = getSearchParams(window.location.href)[name];
  } catch (err) {}
  return value;
}

function getLP(){
  var value = getQueryParameter("lp");
  if(value == undefined){
    var path = location.pathname;
    var pathArr = path.split("/");
    value = pathArr[pathArr.length-1];
  }
  return value;
}

function getUTMParameters(){
  let ret = [];
  let utm_medium = getQueryParameter("utm_medium");
  let utm_source = getQueryParameter("utm_source");
  let utm_campaign = getQueryParameter("utm_campaign");
  let utm_content = getQueryParameter("utm_content");
  let utm_term = getQueryParameter("utm_term");
  utm_medium = (utm_medium == undefined ? "": utm_medium);
  utm_source = (utm_source == undefined ? "": utm_source);
  utm_campaign = (utm_campaign == undefined ? "": utm_campaign);
  utm_content = (utm_content == undefined ? "": utm_content);
  utm_term = (utm_term == undefined ? "": utm_term);
  ret.push(utm_medium);
  ret.push(utm_source);
  ret.push(utm_campaign);
  ret.push(utm_content);
  ret.push(utm_term);
  return ret;
}

window.addEventListener('load', function(){
  let utmParameters = getUTMParameters();
  let utm_medium = utmParameters[0];
  let utm_source = utmParameters[1];
  let utm_campaign = utmParameters[2];
  let utm_content = utmParameters[3];
  let utm_term = utmParameters[4];
  
  let cs = getCampSource(utm_source, utm_medium, utm_campaign, utm_content, utm_term);
  let trf_src = getReferrer();
  let eTrf_src = encodeURIComponent(trf_src);
  let lp = getLP();
  let currentPage = getCurrentPageName();
  
  let href;
  let newHref;
  $("a").each(function(index) {
    href = $(this).attr("href");
    if(href != undefined){
      newHref = href + "?utm_source="+utm_source+"&utm_medium="+utm_medium+"&utm_campaign="+utm_campaign+"&utm_content="+utm_content+"&utm_term="+utm_term+"&lp="+lp+"&trfsrc="+eTrf_src;
      $(this).attr("href", newHref) ;
    }
  });
  sessionStorage.setItem(document.URL, trf_src);
 
  let pcode = getPcode();
  if(pcode != undefined){
    mt('send', 'pageview', {pcode: pcode, tags:cs, utmsource:utm_source, utmmedium:utm_medium, utmcampaign:utm_campaign, utmcontent:utm_content, utmterm:utm_term, lp:lp, trfsrc:trf_src});
  }
  else{
    mt('send', 'pageview', {tags:cs, utmsource:utm_source, utmmedium:utm_medium, utmcampaign:utm_campaign, utmcontent:utm_content, utmterm:utm_term, lp:lp, trfsrc:trf_src});  
  }
  
});

function getCampSource(utm_source, utm_medium, utm_campaign, utm_content, utm_term){
  let campaignSource = "";
  if((utm_medium != "")&&(utm_source != "")&&(utm_campaign != "")){
    campaignSource = utm_medium + "-" + utm_source + "-" + utm_campaign;
  }
  return campaignSource;
}

function getCurrentPageName(){
  var path = window.location.pathname;
  var arr = path.split("/");
  var pageName = arr[arr.length - 1];
  return pageName;
}

function getReferrer(){
  var ret = "direct";
  var referrer = document.referrer;
  var currentDomain = document.domain
  var referrerDomain = getReferrerDomain(referrer)
  var trf_src;
  
  if((referrer != "") && (referrerDomain != currentDomain)){
    ret = referrer;
  }
  else if((referrer != "") && (referrerDomain == currentDomain)){
    trf_src = getQueryParameter("trfsrc")
    if(trf_src != undefined){
      ret = decodeURIComponent(trf_src);
    }  
  }
  else if(referrer == ""){
    trf_src = sessionStorage.getItem(document.URL);
    if(trf_src != null){
      ret = trf_src;
    }
  }
  return ret;
}

function getReferrerDomain(referrer){
  var domain = ""
  if(referrer != ""){
    try{
      domain = new URL(referrer).hostname
    }
    catch(err){
      domain = "Invalid Referrer - "+ referrer;
    }
  }
  return domain;  
}

function isEndOfForm(){
  let ret = false;
  let endofform = document.getElementById("mauticform_input_"+formName+"_endofform");
  let email = document.getElementById("mauticform_input_"+formName+"_email");
  let pcode = document.getElementById("mauticform_input_"+formName+"_pcode");
  if((formName == assetFormName)&&(endofform != null)&&(email == null)){
    ret = true;
  }
  else if((formName == defaultFormName)&&(endofform != null)&&(email == null)){
    ret = true;
  }
  else if((formName == defaultFormName)&&(email == null)&&(progressiveForms == 1)){
    ret = true;
  }
  else if((formName == infoCollectionFormName)&&(endofform != null)&&(email == null)){
    ret = true
  }
  else if((formName == infoCollectionFormName)&&(pcode == null)&&(progressiveForms == 1)){
    ret = true;
  }
  return ret;
}

function displayForm(lpModal, duration){
  let x = (duration == undefined) ? timeInterval : duration;
  let timer0 = setInterval(function(){
    if(formName != infoCollectionFormName){
      lpModal.style.display = "block";
      clearInterval(timer0);
    }
    else{
      let icForm = document.getElementById("mauticform_"+formName);
      if((icForm != null)&&(icForm.style.display != 'none')){
        lpModal.style.display = "block";
        clearInterval(timer0);
      }
    }
  }, x)
}

function isFirstForm(){
  var ret = true;
  var email = document.getElementById("mauticform_input_"+formName+"_email");
  if((formName == defaultFormName)&&(email == null)){
    ret = false;
  }
  else if((formName == assetFormName)&&(email == null)){
    ret = false;
  }
  return ret;
}

function setMauticFields(utm_medium, utm_source, utm_campaign, utm_content, utm_term, lp, trfsrc, currentPage, emailID, firstname, lastname, phoneNumber){
  let endOfForm = isEndOfForm();
  let lpTag = currentPage.split(".")[0];
  let pcode = getPcode();
  let submitFlag = (localStorage.getItem(lpTag+'-sf') == undefined) ? 0 : Number(localStorage.getItem(lpTag+'-sf'));
  let count = (localStorage.getItem(lpTag+'-count') == undefined) ? 0 : Number(localStorage.getItem(lpTag+'-count'));
  
  if(popupForm){
    let lpModal = document.getElementById("lpModal");    
    let lpClose = document.getElementById("lpClose");
    
    lpClose.onclick = function(){
      if((localStorage.getItem(lpTag+'-count') == undefined) || (Number(localStorage.getItem(lpTag+'-count')) < nTimes)){
        lpModal.style.display = "none";
        displayForm(lpModal);
        count++;
        localStorage.setItem(lpTag+'-count', count.toString());
      }
    }
    
    if(!endOfForm){ 
      if((!isFirstForm()) && (submitFlag == 1)){
        submitFlag = 0;
        localStorage.setItem(lpTag+'-sf', submitFlag.toString());
        count = 0;
        localStorage.setItem(lpTag+'-count', count.toString());
        displayForm(lpModal, zDuration);
      }
      else if(count == nTimes){
        lpModal.style.display = "block";
      }
      else {
        displayForm(lpModal);
      }
    }
    else{
      lpModal.style.display = "none";
    }
  }
  
  let email = document.getElementById("mauticform_input_"+formName+"_email");
  let phone = document.getElementById("mauticform_input_"+formName+"_phone");
  let alias = document.getElementById("mauticform_input_"+formName+"_alias");
  
  if(phone != null){
    //addPhoneValidation(phone);
  }
  
  if(alias != undefined){
    alias = alias.value;
    if((alias != undefined)&&(alias != '')){
      formHeader = 'Welcome '+alias+'.';
    }
  }
  createFormHeader();
  
  //code to hide the last form
  if((endOfForm)||((formName == assetFormName)&&(!endOfForm)&&(email == null))){
    var form = document.getElementById("mauticform_"+formName);
    form.parentNode.removeChild(form);
  }
  else{
    var form = document.getElementById("mauticform_"+formName);
    form.onsubmit = function(e){
      let fs = sessionStorage.fs;
      if((fs == undefined)||(fs == '0')){
        sessionStorage.fs = '1';
        let submit = document.getElementById("mauticform_input_"+formName+"_submit");
        if(pcode != undefined){
          mt('send', 'pageview', {pcode: pcode, tags: lpTag+',-waiting'},{onload: function(){submit.click();}});
        }
        else{
          mt('send', 'pageview', {tags: lpTag+',-waiting'},{onload: function(){submit.click();}});
        }
        
        // to update alias field
        let alias = document.getElementById("mauticform_input_"+formName+"_alias");
        let fullname = document.getElementById("mauticform_input_"+formName+"_fullname");
        if((fullname != undefined)&&(alias != undefined)){
          alias.value = fullname.value;
        }
        
        if(popupForm){
          submitFlag = 1;
          localStorage.setItem(lpTag+'-sf', submitFlag.toString());
        }
        e.preventDefault();
      }
      else{
        sessionStorage.fs = '0';
      }
    };
    
    document.getElementById("mauticform_input_"+formName+"_utmsource").value = utm_source;
    document.getElementById("mauticform_input_"+formName+"_utmmedium").value = utm_medium;
    document.getElementById("mauticform_input_"+formName+"_utmcampaign").value = utm_campaign;
    document.getElementById("mauticform_input_"+formName+"_utmcontent").value = utm_content;
    document.getElementById("mauticform_input_"+formName+"_utmterm").value = utm_term;
    document.getElementById("mauticform_input_"+formName+"_lp").value = lp;
    document.getElementById("mauticform_input_"+formName+"_trfsrc").value = trfsrc;
    document.getElementById("mauticform_input_"+formName+"_currentpage").value = currentPage;
  }
  
  if(((endOfForm)&&(formName == infoCollectionFormName)) || (((formName == defaultFormName)||(formName == assetFormName))&&(!isFirstForm()))){
    
    if(page == "asset"){
      document.getElementById("note").style.display = "none";
      document.getElementById("report").style.display = "";
    }
    
    if(popupForm){
      return;
    }
    
    var shareModal = "<div id='shareModal' class='cmodal'> <div id='shareContent' class='cmodal-content'> <span id ='shareClose' class='close'>&times;</span> </div> </div>";
    var referModal = "<div id='referModal' class='cmodal'> <div id='referContent' class='cmodal-content'> <span id ='referClose' class='close'>&times;</span> </div> </div>";
    var aside = document.getElementById("aside");
    var br = document.createElement("br");
    aside.appendChild(br);
    var shareLink = document.createElement("a");
    shareLink.innerHTML = "Share this page";
    shareLink.style.fontSize = "medium";
    aside.appendChild(shareLink);
    var referLink = document.createElement("a");
    referLink.innerHTML = "Refer your friend";
    referLink.style.fontSize = "medium";
    referLink.style.marginLeft = '20px';
    aside.appendChild(referLink);
    br = document.createElement("br");
    aside.appendChild(br);
    
    // new code to add share dialog
    var shareDiv = document.createElement("div");
    shareDiv.innerHTML = shareModal;
    aside.appendChild(shareDiv);
    var referDiv = document.createElement("div");
    referDiv.innerHTML = referModal;
    aside.appendChild(referDiv);
    var shareModal = document.getElementById("shareModal");    
    var shareClose = document.getElementById("shareClose");
    var shareContent = document.getElementById("shareContent");
    var referModal = document.getElementById("referModal");    
    var referClose = document.getElementById("referClose");
    var referContent = document.getElementById("referContent");
    
    shareClose.onclick = function(){
      shareModal.style.display = "none";
      var first = shareContent.firstElementChild;
      var close = first;
      var i=0;
      while (first){ 
          first.remove();
          ++i;
          first = shareContent.firstElementChild; 
      }
      shareContent.appendChild(close);
      shareLink.style.display = "";
    }
    
    referClose.onclick = function(){
      referModal.style.display = "none";
      var first = referContent.firstElementChild;
      var close = first;
      var i=0;
      while (first){ 
          first.remove();
          ++i;
          first = referContent.firstElementChild; 
      }
      referContent.appendChild(close);
      referLink.style.display = "";
    }
    
    //end of new code
    
    shareLink.onclick = function(){
      shareLink.style.display = "none";
      var src = mauticSrc + "/form/generate.js?id=" + shareFormID
      var script = document.createElement('script');
      script.setAttribute('src', src);
      shareContent.appendChild(script);
      
      var form;
      let timer2 = setInterval(function(){
        form = document.getElementsByClassName("mauticform_wrapper");
        if((form != null)&&(form.length >= 2)){ 
          document.getElementById("mauticform_input_"+shareFormName+"_utmsource").value = utm_source;
          document.getElementById("mauticform_input_"+shareFormName+"_utmmedium").value = utm_medium;
          document.getElementById("mauticform_input_"+shareFormName+"_utmcampaign").value = utm_campaign;
          document.getElementById("mauticform_input_"+shareFormName+"_utmcontent").value = utm_content;
          document.getElementById("mauticform_input_"+shareFormName+"_utmterm").value = utm_term;
          //document.getElementById("mauticform_input_"+shareFormName+"_cs").value = cs;
          document.getElementById("mauticform_input_"+shareFormName+"_lp").value = lp;
          document.getElementById("mauticform_input_"+shareFormName+"_trfsrc").value = trfsrc;
          //document.getElementById("mauticform_input_"+shareFormName+"_currentpage").value = currentPage;
          var sharePhone = document.getElementById("mauticform_input_"+shareFormName+"_sharephone")
          addPhoneValidation(sharePhone);
          shareModal.style.display = "block";
          clearInterval(timer2);
        }
      },50);
    }
    
    referLink.onclick = function(){
      referLink.style.display = "none";
      var src = mauticSrc + "/form/generate.js?id=" + referFormID
      var script = document.createElement('script');
      script.setAttribute('src', src);
      referContent.appendChild(script);
      
      var form;
      let timer3 = setInterval(function(){
        form = document.getElementsByClassName("mauticform_wrapper");
        if((form != null)&&(form.length >= 2)){ 
          document.getElementById("mauticform_input_"+referFormName+"_utmsource").value = utm_source;
          document.getElementById("mauticform_input_"+referFormName+"_utmmedium").value = utm_medium;
          document.getElementById("mauticform_input_"+referFormName+"_utmcampaign").value = utm_campaign;
          document.getElementById("mauticform_input_"+referFormName+"_utmcontent").value = utm_content;
          document.getElementById("mauticform_input_"+referFormName+"_utmterm").value = utm_term;
          //document.getElementById("mauticform_input_"+referFormName+"_cs").value = cs;
          document.getElementById("mauticform_input_"+referFormName+"_lp").value = lp;
          document.getElementById("mauticform_input_"+referFormName+"_trfsrc").value = trfsrc;
          //document.getElementById("mauticform_input_"+referFormName+"_currentpage").value = currentPage;
          var referralPhone = document.getElementById("mauticform_input_"+referFormName+"_referralphone")
          addPhoneValidation(referralPhone);
          referModal.style.display = "block";
          clearInterval(timer3);
        }
      },50);
    }
    
    // new code to add 'Get Report' action
    if(endOfForm){
      var br = document.createElement("br");
      aside.appendChild(br);
      var button = document.createElement("input");
      button.type = 'button';
      button.value = 'Get Report';
      aside.appendChild(button);
      button.onclick = function(){
        if(pcode != undefined){
          mt('send', 'pageview', {pcode: pcode, tags: lpTag+',-waiting', utmsource:utm_source, utmmedium:utm_medium, utmcampaign:utm_campaign, utmcontent:utm_content, utmterm:utm_term, lp:lp, trfsrc:trfsrc, currentpage:currentPage});
        }
        else{
          mt('send', 'pageview', {tags: lpTag+',-waiting', utmsource:utm_source, utmmedium:utm_medium, utmcampaign:utm_campaign, utmcontent:utm_content, utmterm:utm_term, lp:lp, trfsrc:trfsrc, currentpage:currentPage});
        }
        var msg = document.getElementById('msg');
        msg.innerHTML = "Report is sent to your Email ID.";
        setTimeout(function(){
          msg.innerHTML = "Sent you email. We will call you.";
        }, 5000);
      }
    }
  }
}

function createFormHeader(){
  if((formHeader != undefined)&&(formHeader != '')){
    var div = document.createElement("div");
    div.id = "msg";
    div.style = "font-weight:bold; font-size:medium; color:brown";
    div.innerHTML = formHeader;
    var root = document.getElementById("mauticform_wrapper_"+formName);
    root.prepend(div);
  }
}

function addPhoneValidation(phone){
  phone.addEventListener('input', function (e){
    var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : x[1] + '-' + x[2] + (x[3] ? '-' + x[3] : '');
  });
}

function getPcode(){
  let pcode = getQueryParameter("pcode");
  if((pcode != undefined)&&(pcode != '')){
    pcode = pcode.trim();
    pcode = pcode.replace("/", "");
    pcode = pcode.replace("%2F", "");
    pcode = (pcode == '') ? undefined : pcode;
  }
  else{
    pcode = undefined;
  }
  return pcode;
}

function loadForm(formSlotId){
  let aside = document.getElementById(formSlotId);
  let src = mauticSrc + "/form/generate.js?id=" + formID;
  let script = document.createElement('script');
  script.setAttribute('src', src);
  script.addEventListener('load', function(){
    formOnload();
  });
  aside.appendChild(script);
}

function formOnload(){
  let utmParameters = getUTMParameters();
  let utm_medium = utmParameters[0];
  let utm_source = utmParameters[1];
  let utm_campaign = utmParameters[2];
  let utm_content = utmParameters[3];
  let utm_term = utmParameters[4];
  
  let cs = getCampSource(utm_source, utm_medium, utm_campaign, utm_content, utm_term);
  let trf_src = getReferrer();
  let eTrf_src = encodeURIComponent(trf_src);
  let lp = getLP();
  let currentPage = getCurrentPageName();
  let lpTag = currentPage.split(".")[0];
  
  let form = document.getElementById("mauticform_"+formName);
  let submit = document.getElementById("mauticform_input_"+formName+"_submit");
  form.style.display = "none";
  
  if((form != null)&&(submit != null)){
    // New code to support auto form submission with pcode
    let pcode = getPcode();
    let pcodeField = document.getElementById("mauticform_input_"+formName+"_pcode");
    
    // new code
    let email = document.getElementById("mauticform_"+formName+"_email");
    let rentorown = document.getElementById("mauticform_"+formName+"_rentorown");
    let currentareaormoveout = document.getElementById("mauticform_"+formName+"_currentareaormoveout");
    let endofform = document.getElementById("mauticform_input_"+formName+"_endofform");
    
    if((pcode != undefined)&&(pcodeField != null)){
      document.getElementById("mauticform_input_"+formName+"_pcode").value = pcode;
      if((page == 'lp')||(page == 'asset')||(page == 'listing')){
        setMauticFields(utm_medium, utm_source, utm_campaign, utm_content, utm_term, lp, trf_src, currentPage);
      }
      submit.click();
    }
    else if((formName == defaultFormName)&&(submit != null)&&(endofform == null)&&(email == null)&&(rentorown == null)&&(currentareaormoveout == null)){
      submit.click();
    }
    else{
      form.style.display = "block";
      if((page == 'lp')||(page == 'asset')||(page == 'listing')){
        setMauticFields(utm_medium, utm_source, utm_campaign, utm_content, utm_term, lp, trf_src, currentPage);
      }
    }
  }
}

function loadVideo(params, parentTag){
  let osWidth;
  if((parentTag != undefined)&&(parentTag != '')){
    let parentElement = document.getElementById(parentTag);
    if(parentElement != null){
      let width = parentElement.offsetWidth;
      document.getElementById('video').style.width = ""+(width - 30)+"px";
      osWidth = width;
    }
  }
  if(params != undefined){
    setVideoWidthAndParams(params, osWidth);
  }
}

function setVideoWidthAndParams(params, osWidth){
  let vtimer0 = setInterval(function(){
    let iframe = document.getElementById('me_youtube_0_container');
    if((iframe != null)&&(iframe.getAttribute("src") != null)){
      if(osWidth != undefined){
        iframe.style.width = ""+(osWidth - 30)+"px";
        document.getElementById('mep_0').style.width = ""+(osWidth - 30)+"px";
      }
      let isource = iframe.getAttribute("src");
      let arr = isource.split('controls=0');
      let nsource = arr[0]+params+arr[1];
      iframe.setAttribute("src", nsource);
      clearInterval(vtimer0);
    }
  }, 200);
}

function setForm(reqFormName, reqFormID){
  formName = reqFormName;
  formID = reqFormID;
}

function controlProgressiveForm(numberOfFormsToBeShown){
  if((numberOfFormsToBeShown != undefined)&&(Number.isInteger(numberOfFormsToBeShown))){
    progressiveForms = numberOfFormsToBeShown;
  }
}

function setInitialFormHeader(reqFormHeader){
  formHeader = reqFormHeader;
}

function enablePopupForm(x, y, z){
  popupForm = true;
  if((x != undefined)&&(Number.isInteger(x))&&(y != undefined)&&(Number.isInteger(y))&&(z != undefined)&&(Number.isInteger(z))){
    timeInterval = x;
    nTimes = y;
    zDuration = z;
  }
}

function resizeVideo(parentTag){
  if((parentTag != undefined)&&(parentTag != '')){
    let parentElement = document.getElementById(parentTag);
    if(parentElement != null){
      let width = parentElement.offsetWidth;
      let mp = document.getElementById('mep_0');
      if(mp != null){
        mp.style.width = ""+(width - 30)+"px";
      }
      let video = document.getElementById('video');
      if(video != null){
        video.style.width = ""+(width - 30)+"px";
      }
      let iframe = document.getElementById('me_youtube_0_container');
      if((iframe != null)&&(iframe.getAttribute("src") != null)){
        iframe.style.width = ""+(width - 30)+"px";
      }
    }
  }  
}