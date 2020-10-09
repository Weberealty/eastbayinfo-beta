console.log("[butter_bar.js] working... v1.0.21");

// Below function taken from: https://github.com/colxi/getEventListeners/blob/master/src/getEventListeners.js
// MIT license
(function() {
  'use strict';

  // save the original methods before overwriting them
  Element.prototype._addEventListener = Element.prototype.addEventListener;
  Element.prototype._removeEventListener = Element.prototype.removeEventListener;

  /**
   * [addEventListener description]
   * @param {[type]}  type       [description]
   * @param {[type]}  listener   [description]
   * @param {Boolean} useCapture [description]
   */
  Element.prototype.addEventListener = function(type,listener,useCapture=false) {
      // declare listener
      this._addEventListener(type,listener,useCapture);

      if(!this.eventListenerList) this.eventListenerList = {};
      if(!this.eventListenerList[type]) this.eventListenerList[type] = [];

      // add listener to  event tracking list
      this.eventListenerList[type].push( {type, listener, useCapture} );
  };

  /**
   * [removeEventListener description]
   * @param  {[type]}  type       [description]
   * @param  {[type]}  listener   [description]
   * @param  {Boolean} useCapture [description]
   * @return {[type]}             [description]
   */
  Element.prototype.removeEventListener = function(type,listener,useCapture=false) {
      // remove listener
      this._removeEventListener(type,listener,useCapture);

      if(!this.eventListenerList) this.eventListenerList = {};
      if(!this.eventListenerList[type]) this.eventListenerList[type] = [];

      // Find the event in the list, If a listener is registered twice, one
      // with capture and one without, remove each one separately. Removal of
      // a capturing listener does not affect a non-capturing version of the
      // same listener, and vice versa.
      for(let i=0; i<this.eventListenerList[type].length; i++){
          if( this.eventListenerList[type][i].listener===listener && this.eventListenerList[type][i].useCapture===useCapture){
              this.eventListenerList[type].splice(i, 1);
              break;
          }
      }
      // if no more events of the removed event type are left,remove the group
      if(this.eventListenerList[type].length==0) delete this.eventListenerList[type];
  };


  /**
   * [getEventListeners description]
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  Element.prototype.getEventListeners = function(type){
      if(!this.eventListenerList) this.eventListenerList = {};

      // return reqested listeners type or all them
      if(type===undefined)  return this.eventListenerList;
      return this.eventListenerList[type];
  };


  /*
  Element.prototype.clearEventListeners = function(a){
      if(!this.eventListenerList)
          this.eventListenerList = {};
      if(a==undefined){
          for(var x in (this.getEventListeners())) this.clearEventListeners(x);
          return;
      }
      var el = this.getEventListeners(a);
      if(el==undefined)
          return;
      for(var i = el.length - 1; i >= 0; --i) {
          var ev = el[i];
          this.removeEventListener(a, ev.listener, ev.useCapture);
      }
  };
  */

})();

const menuBarId = "menuBar";
const mobileBarId = "mobileMenuBar";
const butterBarInMenuBarId = "menuButterBar";
const butterBarInMobileMenuBarId = 'mobileMenuButterBar';

const butterBarContainerId = "butterBarContainer";
const containerButterBarId = "containerButterBar"

const butterBarStyle = `
  .butterBar {
    -webkit-animation: changebar 2.25s infinite;
    -moz-animation: changebar 2.25s infinite;
    animation: changebar 2.25s infinite;
    text-align:center;
    padding: 0.1em;    
  }
  .butterBar:hover{
    color: black;
  }

  @-webkit-keyframes changebar {
    0% {
      background-color: gold
    }
    50% {
      background-color: salmon
    }
    99.9% {
      background-color: gold
    }
  }

  @-moz-keyframes changebar {
    0% {
      background-color: gold
    }
    50% {
      background-color: salmon
    }
    99.9% {
      background-color: gold
    }
  }

  @keyframes changebar{
    0% {
      background-color: gold
    }
    50% {
      background-color: salmon
    }
    99.9% {
      background-color: gold
    }
  }

  .butterBarButton {
    padding: 0em 0.5em;
    color: white;
    background-color: darkblue;
    cursor: pointer;
    display:inline-block;
    border-radius: 0.3em;
    margin-left:0.3em;
  }

  .butterBarButton:hover {
    background-color: slateblue;
  }

  .pageLink {
    display : inline-block;
    padding: 0.3em;
    cursor: pointer;
    margin: 0.1em;
    border: 0.1em solid black;
    border-radius: 0.3em;
  }

  .pageLink:hover {
    background-color: darkblue;
    color:white;
  }

`;

let getStyleElement = () => {
  let style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML =butterBarStyle;
  return style;
}
let styleInjectedFlag = false;

let injectStyle = () => {
  if(!styleInjectedFlag){
    let style = getStyleElement();
    document.getElementsByTagName('head')[0].appendChild(style);
    styleInjectedFlag = true;
  }
}

let getPushButton = () => {
  let elem = document.createElement('div');
  elem.setAttribute('class','butterBarButton');
  elem.setAttribute('onclick','promptAndSubscribeUser()');
  elem.innerText = "OK";
  return elem;
}

/*
let getButterBarElement = () => {
  let elem = document.createElement('div');
  elem.setAttribute('id','butterBar');
  elem.setAttribute('class','butterBar');
  elem.innerText = "Please allow notifications, to get updates";
  let button = getPushButton();
  elem.append(button);
  return elem;
}
*/

/**
 *  <li class="bgclr3" role="menuitem" id={id}></li>
 */
let getListElement = (id) => {
  let elem = document.createElement('li');
  elem.setAttribute('id',id);
  elem.setAttribute('class',"bgclr3");
  elem.setAttribute('role',"menuitem");
  return elem;
}

/**
  <div class="butterBar">
        Please click [Allow] to be notified with updates
  </div>
 */
let getDivElement = () => {
  let elem = document.createElement('div');
  elem.setAttribute('class',"butterBar");
  //elem.innerText = "Please click [Allow] to be notified with updates";
  elem.innerText = "Please Allow notifications to get updates";
  return elem;
}

/**
  <li class="bgclr3" role="menuitem" id={id}>
      <div class="butterBar">
        Please click [Allow] to be notified with updates
        <div class="butterBarButton" onclick="promptAndSubscribeUser">
          OK
        </div>
      </div>
  </li>
 */
let getButterBarElement = (id) => {
  let liElem = getListElement(id);
  let divElem = getDivElement();
  let pushButton = getPushButton();

  divElem.append(pushButton);
  liElem.append(divElem);
  //return liElem;
  return divElem;
}

let injectButterBar = (bbElem) => {
  let body = document.getElementsByTagName("BODY")[0];
  body.prepend(bbElem);
}

let injectButterBarElementToMenuMar = (bbElem) => {
  let elem = document.getElementById(menuBarId);
  //console.log({elem,bbElem,"log":'injectButterBarElementToMenuMar'})
  if(elem != null){
    elem.append(bbElem);
  } 
}

let injectButterBarElementToMobileMenuMar = (bbElem) => {
  let elem = document.getElementById(mobileBarId);
  //console.log({elem,bbElem,"log":'injectButterBarElementToMobileMenuMar'})
  if(elem != null){
    elem.append(bbElem);
  }  
}

let injectButterBarElementToButterBarContainer = (bbElem) => {
  let elem = document.getElementById(butterBarContainerId);
  //console.log({elem,bbElem,"log":'injectButterBarElementToMobileMenuMar'})
  if(elem != null){
    elem.append(bbElem);
  }  
}

let injectButterBarToButterBarContainer = () => {
  //butterBarContainerId
  let elem = getButterBarElement(containerButterBarId);
  elem.setAttribute('id',containerButterBarId);
  injectButterBarElementToButterBarContainer(elem);
}

let injectButterBarToMenuBar = () => {
  //console.log("injectButterBarToMenuBar");
  let elem = getButterBarElement(butterBarInMenuBarId);
  injectButterBarElementToMenuMar(elem);
}

let injectButterBarToMobileMenuBar = () => {
  //console.log("injectButterBarToMobileMenuBar");
  let elem = getButterBarElement(butterBarInMobileMenuBarId);
  injectButterBarElementToMobileMenuMar(elem);
}

let injectButterBarIfNotEnabled = () => {
  window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
    //console.log({isEnabled});
    if (!isEnabled && Notification.permission === 'default') {
      injectStyle();
      //injectButterBarToMenuBar();
      //injectButterBarToMobileMenuBar();
      injectButterBarToButterBarContainer();
    }
  })
}

let removeElements = (list) => {
  let flag = false;
  return list.reduce((acc,curr)=>{
    try {
      curr.parentNode.removeChild(curr);
      flag = true;
    } catch (error) {
      flag = false;
    }
    acc[curr] = flag;
    return acc;
  },{});
}

let removeButterBarIfExist = () => {
  //butterBarInMenuBarId butterBarInMobileMenuBarId
  
  //let bbElem1 = document.getElementById(butterBarInMenuBarId);
  //let bbElem2 = document.getElementById(butterBarInMobileMenuBarId);
  //let bbElem3 = document.getElementById(butterBarInMenuBarId);
  //removeElements([bbElem1,bbElem2,bbElem3]);

  let butterBarIds = [butterBarInMenuBarId,butterBarInMobileMenuBarId,containerButterBarId];
  let list = butterBarIds.reduce((acc,curr)=>{
    acc.push(document.getElementById(curr));
    return acc;
  },[]);
  removeElements(list);
  

  /*let bbElem = document.getElementById('butterBar');
  console.log({bbElem,'log':'removeButterBarIfExist'});
  if(bbElem != null){
    console.log({'bbElem-parent':bbElem.parentNode});
  }
  if(bbElem != null && bbElem.parentNode != null){
    bbElem.parentNode.removeChild(bbElem);
  }*/
}

let init = async() => {
  await waitTillOneSignalIsAvailable();
  console.log("Init start")
  if(isOneSignalAvailable()){
    addListenerForSubscriptionChange();
    injectButterBarIfNotEnabled();
    updateBellButton();
  }
}

let removeAllEvents = (element, eventType) => {
  try {
      let events = element.getEventListeners(eventType);
      let functions = events.reduce((acc, event) => {
          acc.push(event.listener);
          return acc;
      },[]);
      for(let fun of functions){
          element.removeEventListener(eventType, fun);
      }
      return true;
  } catch (error) {
      console.log(error);
      return false;
  }
}

const isBellButtonExistWithClickEvent = () => {
  let ret = false;
  if(document.getElementsByClassName("onesignal-bell-launcher-button").length > 0){
    let element = document.getElementsByClassName("onesignal-bell-launcher-button")[0];
    let clickEvents = element.getEventListeners('click');
    ret = Array.isArray(clickEvents) && clickEvents.length > 0;
  }
  return ret;
}

let waitUntilBellButtonAppears = async(maxWaitTime=120000) => {
  let waitTime = 0;
  let waitInterval = 200; // check every 200ms
  console.log('[WAIT->Bell button][START]');
  return new Promise((resolve, reject) => {
    var checkExist = setInterval(function() {
      if(waitTime >= maxWaitTime){
        reject('Max wait time for Bell to appear expired');
      }
      if (isBellButtonExistWithClickEvent()) {
         clearInterval(checkExist);
         console.log('Bell button appeared');
         resolve();
      }
      waitTime += waitInterval;
   }, waitInterval); 
  })
  
}

let updateBellButton = async() => {
  try {
    await waitUntilBellButtonAppears();
    let bell = document.getElementsByClassName("onesignal-bell-launcher-button")[0];
    removeAllEvents(bell,'click');
    bell.addEventListener("click", promptAndSubscribeUser);
  } catch (error) {
    console.error(error);
  }
  
}



let addListenerForSubscriptionChange = () => {
  window.OneSignal.on('subscriptionChange', function (isSubscribed) {
    console.log("The user's subscription state is now:", isSubscribed);
  });

  window.OneSignal.on('notificationPermissionChange', function(permissionChange) {
    var currentPermission = permissionChange.to;
    console.log('New permission state:', {currentPermission,permissionChange});
    removeButterBarAsPerPermission();
  });
}

let oneSignalAvailableFlag = false;

let isOneSignalAvailable = () => {
  try {
    window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {});
    oneSignalAvailableFlag = true;
  } catch (error) {
    oneSignalAvailableFlag = false;
  }
  return oneSignalAvailableFlag;
}

let timer;
const maxWaitForOneSignal = 120000;
const waitIntervalForOneSignal = 500;
let waitTillOneSignalIsAvailable = () => {
  return new Promise(resolve => {
    let waited = 0;
    timer = setInterval(()=>{
      if(isOneSignalAvailable()){
        clearInterval(timer);
        resolve();
      }
      if(waited >= maxWaitForOneSignal){
        clearInterval(timer);
        resolve();
      }
      waited += waitIntervalForOneSignal;
    }, waitIntervalForOneSignal);
  })
}

let removeButterBarAsPerPermission = () => {
  let permission= Notification.permission;
  console.log({permission,'log':'removeButterBarAsPerPermission started'})

  if(permission != 'default'){
    removeButterBarIfExist();
  }
}

let waitFor = (timeinMs) => {
  return new Promise(resolve => {
    setTimeout(()=> resolve(), timeinMs);
  })
}

let getValInfo = () => {
  let ps = window.OneSignal.context.promptsManager;
  ps.getFlag = function(){return this.isAutoPromptShowing};
  ps.setFlag = function(flag){this.isAutoPromptShowing = flag};
  return {
    isAutoPromptShowing : ps.getFlag(),
    _isRegisteringForPush : window.OneSignal._isRegisteringForPush
  }
}

let resetOneSingalVariablesOnUnproductivePrompt = () => {
  let ps = window.OneSignal.context.promptsManager;
  ps.getFlag = function(){return this.isAutoPromptShowing};
  ps.setFlag = function(flag){this.isAutoPromptShowing = flag};
  if(ps.getFlag() == true){
      ps.setFlag(false);
      window.OneSignal._isRegisteringForPush = false;
  }
}

let showNativeNotification = async() => {
  window.OneSignal.showNativePrompt();
  resetOneSingalVariablesOnUnproductivePrompt();
}

let promptAndSubscribeUser = ()=> {
  if(isOneSignalAvailable()){
    window.OneSignal.isPushNotificationsEnabled(async function(isEnabled) {
      if (!isEnabled ) {
        await showNativeNotification();
      }
    });
  }

}


init();
