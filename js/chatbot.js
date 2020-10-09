var src = 'http://testbot.weberon.net:3000/index?campaignSource=testJoshua';
var title = 'Assistant: May I help you?';
var flashTime, chatTime;
console.log("chatbot.js [without popup code]");
function getUrlWithCampaignSource(chatbotUrl){
  var campaignSource = getCampaignSource();
  var urlWithCampaignSource = chatbotUrl;
  if(campaignSource){
    urlWithCampaignSource = removeCampaignSource(urlWithCampaignSource);
    urlWithCampaignSource = appendCampaignSource(urlWithCampaignSource,campaignSource);

  }
  return urlWithCampaignSource;
}

function removeCampaignSource(urlWithCampaignSource) {
  var urlInfo = urlWithCampaignSource;
  try {
    var params = getSearchParams(urlInfo);
    var paramString = "";
    if (params != null && Object.keys(params) > 0) {
      paramString = "?";
      Object.keys(params).map(function(k) {
        if (k !== "campaignSource") {
          paramString += "&" + k + "=" + params[k];
        }
      })
      paramString = paramString.replace("?&", "?");
    }
    var url = new URL(urlInfo);
    var splitUrl = urlInfo.split(url.search);
    if (splitUrl != null && splitUrl.length > 0) {
      urlInfo = splitUrl[0] + paramString;
      if (splitUrl.length > 1) {
        urlInfo += splitUrl[1]
      }
    }
  } catch (err) {}
  return urlInfo;
}

function appendCampaignSource(urlWithCampaignSource,campaignSource){
  var urlInfo = urlWithCampaignSource;
  if(urlInfo){
    if(urlInfo.includes("?")){
      urlInfo = urlInfo + "&campaignSource="+campaignSource;
    }else{
        urlInfo = urlInfo + "?campaignSource="+campaignSource;
    }
  }
  return urlInfo;
}



function getCampaignSource() {
  var campaignSource = null;
  try {
    //campaignSource = getSearchParams(window.location.href)["ocs"];
    var utm_medium = getSearchParams(window.location.href)["utm_medium"];
    var utm_source = getSearchParams(window.location.href)["utm_source"];
    var utm_campaign = getSearchParams(window.location.href)["utm_campaign"];
    var utm_content = getSearchParams(window.location.href)["utm_content"];
    if((utm_medium != undefined)&&(utm_source != undefined)&&(utm_campaign != undefined)&&(utm_content != undefined))
    {
      campaignSource = utm_medium + "-" + utm_source + "-" + utm_campaign + "-" + utm_content;
    }
    else
    {
      campaignSource = undefined;
    }
  } catch (err) {}
  return campaignSource;
}

function renderChatBot(chatbotServerUrl){
  if(chatbotServerUrl){
    src = chatbotServerUrl;
  }
  console.log("Window Loaded\n"+src);
  var e1 = document.createElement('div');
  e1.id = 'mydiv';
  //e1.innerHTML = '<div id="containerChatbot" class="outerDiv" style="position: fixed; bottom: 0; right: 5px; z-index: 10;"><div id="chat_header"  style="height: 50px; width: 350px; text-align:center; font-size:large; font-weight:90; padding-top:10px; background-color: #baffc9;" onclick="toggle_chat()">'+title+'  <span id="arrow" class="glyphicon glyphicon-triangle-top pull-right"  style="padding:4px 14px 14px"></span></div><div id="chat_header2"  style="height: 50px; width: 350px; text-align:center; font-size:large; font-weight:90; padding-top:10px; background-color: #acde12;" onclick="toggle_chat()">'+title+' <span id="arrow" class="glyphicon glyphicon-triangle-top pull-right"  style="padding:4px 14px 14px"></span></div><div id = "chat_bot"> <object id="frame" class = "chatFrame" style = "background-color: white; position: absolute; width: 350px;" data = ' + src + '></object></div></div>';

  e1.innerHTML = `
  <div id="containerChatbot" class="outerDiv" style="position: fixed; bottom: 0; right: 5px; z-index: 10;">
    <div id="chat_header"  style=""
      onclick="toggle_chat()" class="chat_header">
      ${title}
      <span id="arrow" class="glyphicon glyphicon-triangle-top "
        style="padding: 0px;margin-right:0.4em;">
      </span>
    </div>

    <div id="chat_header2"  style="height: auto; width: 350px; text-align:center; font-size:large; font-weight:90; padding-top:10px;padding-bottom:10px; background-color: #acde12;"
      onclick="toggle_chat()">
      ${title}
      <span id="arrow" class="glyphicon glyphicon-triangle-top"
        style="padding: 0px;margin-right:0.4em;">
      </span>
    </div>

    <div id = "chat_bot">
      <object id="frame" class = "chatFrame" style = "background-color: white; position: absolute; width: 350px;" data = ${src}>
      </object>
    </div>
  </div>`;

  //document.getElementsByTagName('body')[0].appendChild(e1);
  document.getElementById('chatContain').appendChild(e1);

  $(chat_header2).hide();
  hide_chat();
 //  if(chatTime){clearTimeout(chatTime)}
 //  chatTime = setTimeout(function () {
 //   show_chat();
 // }, (30 * 1000));
  flashTime = setInterval(function () {
   flash_header();
  }, (0.5 * 1000));
}

    function toggle_chat() {
      if ($(chat_bot).hasClass('opened')) {
          hide_chat();
      } else {
          show_chat();
      }
    }

    function toggle_header() {
      if ($(chat_header2).is(':visible')) {
          showHeader1();
      } else {
          showHeader2();
      }
    }

    function showHeader1() {
        $(chat_header2).hide();
        $(chat_header).show();
    }

    function showHeader2() {
        $(chat_header).hide();
        $(chat_header2).show();
    }

    function show_chat() {

          console.log('time', new Date().getTime())
          if(chatTime){clearTimeout(chatTime)}
          clearInterval(flashTime)
          //$(chat_bot).show();
      showChatBot();
          $(arrow).removeClass("glyphicon glyphicon-triangle-top")
              .addClass("glyphicon glyphicon-triangle-bottom");
          showHeader1();
          $(containerChatbot).removeClass('closed').addClass('outerDiv')
          //$('#frame')[0].contentWindow.postMessage('message', '*')
    }

    function showChatBot(){
      $(chat_bot).removeClass('closed').addClass('opened');
    }

    function hideChatBot(){
      $(chat_bot).removeClass('opened').addClass('closed');
    }

      function sendMessageToIframe() {

      }

      function hide_chat() {
          //$(chat_bot).hide();
      hideChatBot();
          $(arrow).removeClass("glyphicon glyphicon-triangle-bottom")
              .addClass("glyphicon glyphicon-triangle-top");
          // To open the chat every 10 secs
      // if(chatTime){clearTimeout(chatTime)}
      //     chatTime = setTimeout(function () {
      //         show_chat()
      //     }, 300 * 1000);
          $(containerChatbot).addClass('closed').removeClass('outerDiv')
      }

      function flash_header() {
          //   if ($(chat_header).hasClass('header1')) {
          //     $(chat_header).removeClass('header1').addClass('header2');
          //   } else {
          //     $(chat_header).removeClass('header2').addClass('header1');
          //   }
          if ($(chat_header).is(':visible')) {
              $(chat_header).hide();
              $(chat_header2).show();
          } else {
              $(chat_header2).hide();
              $(chat_header).show();
          }
      }

      function messageSent(event){
        console.log("Message sent!!");
      }

      function receiveMessage(event) {
      console.log("Message received !!");
          // clear flash time
          if (flashTime) {
              clearTimeout(flashTime);
          }
          // flash chat
      //hasClass
          //if (!$(chat_bot).is(':visible')) {
      if (!$(chat_bot).hasClass('opened')) {
              flashTime = setInterval(function () {
                  flash_header();
              }, (.5 * 1000));
          }
          // show chat
          // if(chatTime){clearTimeout(chatTime)}
          // chatTime = setTimeout(function () {
          //     show_chat();
          // }, 10 * 1000);
      }

function getSearchParams(url_string) {
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
  console.log("Params : " + JSON.stringify(params2));
  return params2;
}

function isMonitoringRequest() {
  return getSearchParams(window.location.href)["hck"] == "true";
}

window.addEventListener('bot_uttered', receiveMessage, false);
window.addEventListener('message', receiveMessage, false);
window.addEventListener('chat_incomming_message', receiveMessage, false);
window.addEventListener('chat_outgoing_message', messageSent, false);

$(document).ready(function() {
  var urlWithCampaignSource = getUrlWithCampaignSource(chatbotSrc);
  renderChatBot(urlWithCampaignSource);
})
