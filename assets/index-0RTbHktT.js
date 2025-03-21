var vt=Object.defineProperty;var Et=(o,t,e)=>t in o?vt(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var s=(o,t,e)=>Et(o,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function e(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=e(a);fetch(a.href,r)}})();function J(o,t){if(!(o instanceof t))throw new TypeError("Cannot call a class as a function")}function bt(o,t){for(var e=0;e<t.length;e++){var i=t[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(o,i.key,i)}}function X(o,t,e){return t&&bt(o.prototype,t),o}function G(o){return+o.replace(/px/,"")}function wt(o){var t=window.devicePixelRatio,e=getComputedStyle(o),i=G(e.getPropertyValue("width")),a=G(e.getPropertyValue("height"));o.setAttribute("width",(i*t).toString()),o.setAttribute("height",(a*t).toString())}function g(o,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,i=Math.random()*(t-o)+o;return Math.floor(i*Math.pow(10,e))/Math.pow(10,e)}function K(o){return o[g(0,o.length)]}var Ct=.00125,Bt=5e-4,Tt=9e-4,It=1e-5,kt=6,Dt=80,St=.9,At=1.7,Ht=.2,Nt=.6,Ot=.03,xt=.07,Lt=15,Mt=82,Pt=100,$t=250,Rt=40,_t=["#fcf403","#62fc03","#f4fc03","#03e7fc","#03fca5","#a503fc","#fc03ad","#fc03c2"];function Y(o){var t=1920;return Math.log(o)/Math.log(t)}var Z=function(){function o(t){J(this,o);var e=t.initialPosition,i=t.direction,a=t.confettiRadius,r=t.confettiColors,n=t.emojis,l=t.emojiSize,d=t.canvasWidth,c=g(St,At,3),u=c*Y(d);this.confettiSpeed={x:u,y:u},this.finalConfettiSpeedX=g(Ht,Nt,3),this.rotationSpeed=n.length?.01:g(Ot,xt,3)*Y(d),this.dragForceCoefficient=g(Bt,Tt,6),this.radius={x:a,y:a},this.initialRadius=a,this.rotationAngle=i==="left"?g(0,.2,3):g(-.2,0,3),this.emojiSize=l,this.emojiRotationAngle=g(0,2*Math.PI),this.radiusYUpdateDirection="down";var h=i==="left"?g(Mt,Lt)*Math.PI/180:g(-15,-82)*Math.PI/180;this.absCos=Math.abs(Math.cos(h)),this.absSin=Math.abs(Math.sin(h));var f=g(-150,0),y={x:e.x+(i==="left"?-f:f)*this.absCos,y:e.y-f*this.absSin};this.currentPosition=Object.assign({},y),this.initialPosition=Object.assign({},y),this.color=n.length?null:K(r),this.emoji=n.length?K(n):null,this.createdAt=new Date().getTime(),this.direction=i}return X(o,[{key:"draw",value:function(e){var i=this.currentPosition,a=this.radius,r=this.color,n=this.emoji,l=this.rotationAngle,d=this.emojiRotationAngle,c=this.emojiSize,u=window.devicePixelRatio;r?(e.fillStyle=r,e.beginPath(),e.ellipse(i.x*u,i.y*u,a.x*u,a.y*u,l,0,2*Math.PI),e.fill()):n&&(e.font="".concat(c,"px serif"),e.save(),e.translate(u*i.x,u*i.y),e.rotate(d),e.textAlign="center",e.fillText(n,0,0),e.restore())}},{key:"updatePosition",value:function(e,i){var a=this.confettiSpeed,r=this.dragForceCoefficient,n=this.finalConfettiSpeedX,l=this.radiusYUpdateDirection,d=this.rotationSpeed,c=this.createdAt,u=this.direction,h=i-c;if(a.x>n&&(this.confettiSpeed.x-=r*e),this.currentPosition.x+=a.x*(u==="left"?-this.absCos:this.absCos)*e,this.currentPosition.y=this.initialPosition.y-a.y*this.absSin*h+Ct*Math.pow(h,2)/2,this.rotationSpeed-=this.emoji?1e-4:It*e,this.rotationSpeed<0&&(this.rotationSpeed=0),this.emoji){this.emojiRotationAngle+=this.rotationSpeed*e%(2*Math.PI);return}l==="down"?(this.radius.y-=e*d,this.radius.y<=0&&(this.radius.y=0,this.radiusYUpdateDirection="up")):(this.radius.y+=e*d,this.radius.y>=this.initialRadius&&(this.radius.y=this.initialRadius,this.radiusYUpdateDirection="down"))}},{key:"getIsVisibleOnCanvas",value:function(e){return this.currentPosition.y<e+Pt}}]),o}();function jt(){var o=document.createElement("canvas");return o.style.position="fixed",o.style.width="100%",o.style.height="100%",o.style.top="0",o.style.left="0",o.style.zIndex="1000",o.style.pointerEvents="none",document.body.appendChild(o),o}function Ft(o){var t=o.confettiRadius,e=t===void 0?kt:t,i=o.confettiNumber,a=i===void 0?o.confettiesNumber||(o.emojis?Rt:$t):i,r=o.confettiColors,n=r===void 0?_t:r,l=o.emojis,d=l===void 0?o.emojies||[]:l,c=o.emojiSize,u=c===void 0?Dt:c;return o.emojies&&console.error("emojies argument is deprecated, please use emojis instead"),o.confettiesNumber&&console.error("confettiesNumber argument is deprecated, please use confettiNumber instead"),{confettiRadius:e,confettiNumber:a,confettiColors:n,emojis:d,emojiSize:u}}var Ut=function(){function o(t){var e=this;J(this,o),this.canvasContext=t,this.shapes=[],this.promise=new Promise(function(i){return e.resolvePromise=i})}return X(o,[{key:"getBatchCompletePromise",value:function(){return this.promise}},{key:"addShapes",value:function(){var e;(e=this.shapes).push.apply(e,arguments)}},{key:"complete",value:function(){var e;return this.shapes.length?!1:((e=this.resolvePromise)===null||e===void 0||e.call(this),!0)}},{key:"processShapes",value:function(e,i,a){var r=this,n=e.timeDelta,l=e.currentTime;this.shapes=this.shapes.filter(function(d){return d.updatePosition(n,l),d.draw(r.canvasContext),a?d.getIsVisibleOnCanvas(i):!0})}}]),o}(),Vt=function(){function o(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};J(this,o),this.activeConfettiBatches=[],this.canvas=t.canvas||jt(),this.canvasContext=this.canvas.getContext("2d"),this.requestAnimationFrameRequested=!1,this.lastUpdated=new Date().getTime(),this.iterationIndex=0,this.loop=this.loop.bind(this),requestAnimationFrame(this.loop)}return X(o,[{key:"loop",value:function(){this.requestAnimationFrameRequested=!1,wt(this.canvas);var e=new Date().getTime(),i=e-this.lastUpdated,a=this.canvas.offsetHeight,r=this.iterationIndex%10===0;this.activeConfettiBatches=this.activeConfettiBatches.filter(function(n){return n.processShapes({timeDelta:i,currentTime:e},a,r),r?!n.complete():!0}),this.iterationIndex++,this.queueAnimationFrameIfNeeded(e)}},{key:"queueAnimationFrameIfNeeded",value:function(e){this.requestAnimationFrameRequested||this.activeConfettiBatches.length<1||(this.requestAnimationFrameRequested=!0,this.lastUpdated=e||new Date().getTime(),requestAnimationFrame(this.loop))}},{key:"addConfetti",value:function(){for(var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},i=Ft(e),a=i.confettiRadius,r=i.confettiNumber,n=i.confettiColors,l=i.emojis,d=i.emojiSize,c=this.canvas.getBoundingClientRect(),u=c.width,h=c.height,f=h*5/7,y={x:0,y:f},I={x:u,y:f},k=new Ut(this.canvasContext),E=0;E<r/2;E++){var yt=new Z({initialPosition:y,direction:"right",confettiRadius:a,confettiColors:n,confettiNumber:r,emojis:l,emojiSize:d,canvasWidth:u}),gt=new Z({initialPosition:I,direction:"left",confettiRadius:a,confettiColors:n,confettiNumber:r,emojis:l,emojiSize:d,canvasWidth:u});k.addShapes(yt,gt)}return this.activeConfettiBatches.push(k),this.queueAnimationFrameIfNeeded(),k.getBatchCompletePromise()}},{key:"clearCanvas",value:function(){this.activeConfettiBatches=[]}},{key:"destroyCanvas",value:function(){this.canvas.remove()}}]),o}();class Wt{constructor(){s(this,"startBtn",document.getElementById("start-btn"));s(this,"leaderBtn",document.getElementById("leaderboard-btn"));s(this,"leaderDiv",document.getElementById("leader-container"));s(this,"leaderBodyDiv",document.getElementById("leader-body"));s(this,"leaderCloseBtn",document.getElementById("close-leader"));s(this,"chatBotDiv",document.getElementById("chatbot"));s(this,"chatBotIcon",document.getElementById("chatbot-icon"));s(this,"chatBotSpinner",document.getElementById("chatbot-spinner"));s(this,"chatBotBtns",document.getElementById("chatbot-buttons"));s(this,"adviceDiv",document.getElementById("advice"));s(this,"askBtn",document.getElementById("ask-btn"));s(this,"adviceBtn",document.getElementById("advice-btn"));s(this,"adviceText",document.getElementById("advice-text"));s(this,"pregameDiv",document.getElementById("pregame-section"));s(this,"actionParagraph",document.getElementById("action"));s(this,"actionText",document.getElementById("action-text"));s(this,"dealerDiv",document.getElementById("dealer-section"));s(this,"playerDiv",document.getElementById("player-section"));s(this,"playerHandsDiv",document.getElementById("player-hands"));s(this,"buttonsDiv",document.getElementById("buttons"));s(this,"mainMenuBtn",document.getElementById("main-menu"));s(this,"nextRoundBtn",document.getElementById("next-round"));s(this,"totalMoneySpan",document.getElementById("total-money"));s(this,"currentBetSpan",document.getElementById("current-bet"));s(this,"handCountSpan",document.getElementById("hand-count"));s(this,"resultModal",document.getElementById("result-modal"));s(this,"loginModal",document.getElementById("login-modal"));s(this,"roundResultsDiv",document.getElementById("round-results"));s(this,"resultHeader",document.getElementById("result-header"));s(this,"totalBetSpan",document.getElementById("initial-bet"));s(this,"returnBetSpan",document.getElementById("return-bet"));s(this,"closeModalBtn",document.getElementById("close-modal"));s(this,"refreshBtn",document.getElementById("refresh-leader"));s(this,"usernameInput",document.getElementById("username"));s(this,"usernameError",document.getElementById("username-error"));s(this,"submitLoginBtn",document.getElementById("submit-login"));s(this,"betButtons");s(this,"handButtons");s(this,"confetti",new Vt);this.betButtons=this.convertNodeListToArray(".bet-btn"),this.handButtons=this.convertNodeListToArray(".hand-btn"),this.closeModalBtn.addEventListener("click",t=>{t.preventDefault(),this.hideElement(this.resultModal)}),this.leaderBtn.addEventListener("click",t=>{t.preventDefault(),this.hideElement(this.pregameDiv),this.showElement(this.leaderDiv,"leaderboard-card")}),this.leaderCloseBtn.addEventListener("click",t=>{t.preventDefault(),this.hideElement(this.leaderDiv),this.showElement(this.pregameDiv,"pre-game")}),console.log("DOM Elements Class ready")}showElement(t,e=""){t.setAttribute("class",e)}hideElement(t){t.setAttribute("class","d-none")}convertNodeListToArray(t){const e=document.querySelectorAll(t);return Array.from(e,i=>i)}}const T=new Wt;function B(o){return new Promise(t=>setTimeout(t,o))}const{showElement:L}=T;class zt{constructor(t,e,i){s(this,"suit");s(this,"value");s(this,"isFaceDown");s(this,"isDoubleCard");s(this,"domElement");this.suit=t,this.value=e,this.isFaceDown=i||!1,this.isDoubleCard=!1}get gameValue(){return this.value>9&&this.value<14?10:this.value}get cardValueText(){if(this.value>10)switch(this.value){case 11:return"J";case 12:return"Q";case 13:return"K";default:return"A"}else return this.value.toString()}generateCardFace(){if(!this.domElement)return;let t=["♣","♠"].includes(this.suit)?"black":"red",e=this.cardValueText;L(this.domElement,`card card-${t}`),this.domElement.innerText=`${e}${this.suit}`}flipOver(){if(!(!this.isFaceDown&&!this.isDoubleCard))return this.isDoubleCard=!1,this.isFaceDown=!1,this.generateCardFace()}createCardElement(t){this.domElement=document.createElement("div"),this.isDoubleCard?(L(this.domElement,"card card-black card-double"),this.domElement.innerText="?"):this.isFaceDown?(L(this.domElement,"card card-black face-down"),this.domElement.innerText="?"):this.generateCardFace(),t.appendChild(this.domElement)}}const{showElement:D,dealerDiv:qt,playerHandsDiv:Jt}=T;class M{constructor(t){s(this,"id");s(this,"total");s(this,"cards");s(this,"aceCount");s(this,"isDealer");s(this,"isActive");s(this,"hideTotal");s(this,"doubledHand");s(this,"splitHand");s(this,"domElement");s(this,"totalElement");s(this,"cardsContainerElement");this.id=t,this.cards=[],this.total=0,this.aceCount=0,this.isActive=!1,this.isDealer=this.id==-1,this.hideTotal=this.isDealer,this.doubledHand=!1,this.splitHand=!1,this.domElement=document.createElement("div"),this.totalElement=document.createElement("p"),this.cardsContainerElement=document.createElement("div");let e=this.isDealer?"dealer-hand":`hand-${this.id}`;this.domElement.setAttribute("id",e),this.totalElement.innerText="??",this.domElement.appendChild(this.cardsContainerElement),this.domElement.appendChild(this.totalElement),D(this.domElement,"hand"),D(this.totalElement,"total"),D(this.cardsContainerElement,"cards-container"),this.isDealer?qt.appendChild(this.domElement):Jt.appendChild(this.domElement)}get isTurnOver(){return this.total>20}get shouldDealerHit(){return this.total<17}get canHandSplit(){return this.cards.length==2&&this.cards[0].gameValue==this.cards[1].gameValue}get handIdText(){let t;switch(this.id){case 1:t="Hand One";break;case 2:t="Hand Two";break;case 3:t="Hand Three";break;default:t="Hand Four";break}return this.doubledHand&&(t+=" (Double)"),this.splitHand&&(t+=" (Split)"),t}get cardTextValues(){let t=[];for(let e=0;e<this.cards.length;e++)this.cards[e].isFaceDown||t.push(this.cards[e].cardValueText);return t}set active(t){this.isActive=t,this.isActive?D(this.totalElement,"total total-highlight"):D(this.totalElement,"total")}set double(t){this.doubledHand=t,this.hideTotal=t}deal(t,e){t.isDoubleCard=e,this.cards.push(t),t.createCardElement(this.domElement),t.domElement!==void 0&&this.cardsContainerElement.appendChild(t.domElement),this.calculateTotal()}removeCardForSplit(){var e;if(!this.canHandSplit)return;const t=this.cards[1];return(e=this.cardsContainerElement.lastChild)==null||e.remove(),this.cards=[this.cards[0]],this.calculateTotal(),t}calculateTotal(t=!1){this.total=0;let e;for(const{value:i}of this.cards)i==14?(this.total++,this.aceCount++):i>10?this.total+=10:this.total+=i;this.aceCount>0&&this.total+10<22?this.total+10==21?(e="21",this.total=21):(t?e=`${this.total+10}`:e=`${this.total} / ${this.total+10}`,this.total+=10):e=this.total.toString(),this.hideTotal&&(e="??"),this.totalElement.innerText=e}showHandAndTotal(t=!1){return this.cards.forEach(e=>{(e.isFaceDown||e.isDoubleCard)&&e.flipOver()}),this.hideTotal=!1,this.calculateTotal(t)}}const{showElement:Q,hideElement:Xt}=T;class A{constructor(t,e){s(this,"domElement");s(this,"permanentDisable");this.domElement=document.getElementById(t),this.domElement.addEventListener("click",i=>(i.preventDefault(),this.domElement.getAttribute("class")!=="disabled"?e():console.log("Button Disabled"))),this.permanentDisable=!1}enableButton(){Q(this.domElement,"button")}disableButton(){Q(this.domElement,"disabled")}hideButton(){Xt(this.domElement)}}class Gt{constructor(t,e,i,a){s(this,"hitButton");s(this,"standButton");s(this,"splitButton");s(this,"doubleButton");this.hitButton=t,this.standButton=e,this.splitButton=i,this.doubleButton=a,console.log("Action Buttons Class ready")}enableUserAction(){for(const t in this)if(Object.prototype.hasOwnProperty.call(this,t)){const e=this[t];e.permanentDisable||e.enableButton()}}disableUserAction(){for(const t in this)Object.prototype.hasOwnProperty.call(this,t)&&this[t].disableButton()}hideActionButtons(){for(const t in this)Object.prototype.hasOwnProperty.call(this,t)&&this[t].hideButton()}permanentEnableActionButtons(){for(const t in this)if(Object.prototype.hasOwnProperty.call(this,t)){const e=this[t];e.permanentDisable=!1}}}function q(o){for(;o.firstChild;)o.removeChild(o.lastChild)}function Kt(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var x={exports:{}};/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */var Yt=x.exports,tt;function Zt(){return tt||(tt=1,function(o){(function(t,e){o.exports?o.exports=e():t.Toastify=e()})(Yt,function(t){var e=function(n){return new e.lib.init(n)},i="1.12.0";e.defaults={oldestFirst:!0,text:"Toastify is awesome!",node:void 0,duration:3e3,selector:void 0,callback:function(){},destination:void 0,newWindow:!1,close:!1,gravity:"toastify-top",positionLeft:!1,position:"",backgroundColor:"",avatar:"",className:"",stopOnFocus:!0,onClick:function(){},offset:{x:0,y:0},escapeMarkup:!0,ariaLive:"polite",style:{background:""}},e.lib=e.prototype={toastify:i,constructor:e,init:function(n){return n||(n={}),this.options={},this.toastElement=null,this.options.text=n.text||e.defaults.text,this.options.node=n.node||e.defaults.node,this.options.duration=n.duration===0?0:n.duration||e.defaults.duration,this.options.selector=n.selector||e.defaults.selector,this.options.callback=n.callback||e.defaults.callback,this.options.destination=n.destination||e.defaults.destination,this.options.newWindow=n.newWindow||e.defaults.newWindow,this.options.close=n.close||e.defaults.close,this.options.gravity=n.gravity==="bottom"?"toastify-bottom":e.defaults.gravity,this.options.positionLeft=n.positionLeft||e.defaults.positionLeft,this.options.position=n.position||e.defaults.position,this.options.backgroundColor=n.backgroundColor||e.defaults.backgroundColor,this.options.avatar=n.avatar||e.defaults.avatar,this.options.className=n.className||e.defaults.className,this.options.stopOnFocus=n.stopOnFocus===void 0?e.defaults.stopOnFocus:n.stopOnFocus,this.options.onClick=n.onClick||e.defaults.onClick,this.options.offset=n.offset||e.defaults.offset,this.options.escapeMarkup=n.escapeMarkup!==void 0?n.escapeMarkup:e.defaults.escapeMarkup,this.options.ariaLive=n.ariaLive||e.defaults.ariaLive,this.options.style=n.style||e.defaults.style,n.backgroundColor&&(this.options.style.background=n.backgroundColor),this},buildToast:function(){if(!this.options)throw"Toastify is not initialized";var n=document.createElement("div");n.className="toastify on "+this.options.className,this.options.position?n.className+=" toastify-"+this.options.position:this.options.positionLeft===!0?(n.className+=" toastify-left",console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")):n.className+=" toastify-right",n.className+=" "+this.options.gravity,this.options.backgroundColor&&console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.');for(var l in this.options.style)n.style[l]=this.options.style[l];if(this.options.ariaLive&&n.setAttribute("aria-live",this.options.ariaLive),this.options.node&&this.options.node.nodeType===Node.ELEMENT_NODE)n.appendChild(this.options.node);else if(this.options.escapeMarkup?n.innerText=this.options.text:n.innerHTML=this.options.text,this.options.avatar!==""){var d=document.createElement("img");d.src=this.options.avatar,d.className="toastify-avatar",this.options.position=="left"||this.options.positionLeft===!0?n.appendChild(d):n.insertAdjacentElement("afterbegin",d)}if(this.options.close===!0){var c=document.createElement("button");c.type="button",c.setAttribute("aria-label","Close"),c.className="toast-close",c.innerHTML="&#10006;",c.addEventListener("click",(function(E){E.stopPropagation(),this.removeElement(this.toastElement),window.clearTimeout(this.toastElement.timeOutValue)}).bind(this));var u=window.innerWidth>0?window.innerWidth:screen.width;(this.options.position=="left"||this.options.positionLeft===!0)&&u>360?n.insertAdjacentElement("afterbegin",c):n.appendChild(c)}if(this.options.stopOnFocus&&this.options.duration>0){var h=this;n.addEventListener("mouseover",function(E){window.clearTimeout(n.timeOutValue)}),n.addEventListener("mouseleave",function(){n.timeOutValue=window.setTimeout(function(){h.removeElement(n)},h.options.duration)})}if(typeof this.options.destination<"u"&&n.addEventListener("click",(function(E){E.stopPropagation(),this.options.newWindow===!0?window.open(this.options.destination,"_blank"):window.location=this.options.destination}).bind(this)),typeof this.options.onClick=="function"&&typeof this.options.destination>"u"&&n.addEventListener("click",(function(E){E.stopPropagation(),this.options.onClick()}).bind(this)),typeof this.options.offset=="object"){var f=a("x",this.options),y=a("y",this.options),I=this.options.position=="left"?f:"-"+f,k=this.options.gravity=="toastify-top"?y:"-"+y;n.style.transform="translate("+I+","+k+")"}return n},showToast:function(){this.toastElement=this.buildToast();var n;if(typeof this.options.selector=="string"?n=document.getElementById(this.options.selector):this.options.selector instanceof HTMLElement||typeof ShadowRoot<"u"&&this.options.selector instanceof ShadowRoot?n=this.options.selector:n=document.body,!n)throw"Root element is not defined";var l=e.defaults.oldestFirst?n.firstChild:n.lastChild;return n.insertBefore(this.toastElement,l),e.reposition(),this.options.duration>0&&(this.toastElement.timeOutValue=window.setTimeout((function(){this.removeElement(this.toastElement)}).bind(this),this.options.duration)),this},hideToast:function(){this.toastElement.timeOutValue&&clearTimeout(this.toastElement.timeOutValue),this.removeElement(this.toastElement)},removeElement:function(n){n.className=n.className.replace(" on",""),window.setTimeout((function(){this.options.node&&this.options.node.parentNode&&this.options.node.parentNode.removeChild(this.options.node),n.parentNode&&n.parentNode.removeChild(n),this.options.callback.call(n),e.reposition()}).bind(this),400)}},e.reposition=function(){for(var n={top:15,bottom:15},l={top:15,bottom:15},d={top:15,bottom:15},c=document.getElementsByClassName("toastify"),u,h=0;h<c.length;h++){r(c[h],"toastify-top")===!0?u="toastify-top":u="toastify-bottom";var f=c[h].offsetHeight;u=u.substr(9,u.length-1);var y=15,I=window.innerWidth>0?window.innerWidth:screen.width;I<=360?(c[h].style[u]=d[u]+"px",d[u]+=f+y):r(c[h],"toastify-left")===!0?(c[h].style[u]=n[u]+"px",n[u]+=f+y):(c[h].style[u]=l[u]+"px",l[u]+=f+y)}return this};function a(n,l){return l.offset[n]?isNaN(l.offset[n])?l.offset[n]:l.offset[n]+"px":"0px"}function r(n,l){return!n||typeof l!="string"?!1:!!(n.className&&n.className.trim().split(/\s+/gi).indexOf(l)>-1)}return e.lib.init.prototype=e.lib,e})}(x)),x.exports}var Qt=Zt();const te=Kt(Qt);class ee{constructor(){s(this,"toast");s(this,"defaultOptions");this.toast=te,this.defaultOptions={close:!1,duration:2e3,position:"right",stopOnFocus:!1,offset:{x:0,y:60}},console.log("Toast Class ready")}positiveToast(t){let e={...this.defaultOptions,text:t,className:"toast-positive"};return this.toast(e).showToast()}neutralToast(t){let e={...this.defaultOptions,text:t,className:"toast-neutral"};return this.toast(e).showToast()}negativeToast(t){let e={...this.defaultOptions,text:t,className:"toast-negative"};return this.toast(e).showToast()}}const p=new ee,{showElement:ne,hideElement:ie}=T;class se{constructor(){s(this,"isLoading");s(this,"spinner");s(this,"spinnerMsg");this.isLoading=!1,this.spinner=document.getElementById("loading-spinner"),this.spinnerMsg=document.getElementById("loading-message"),console.log("Loading Class ready.")}async setLoading(t,e,i){this.isLoading=t,t?(this.spinnerMsg.textContent=e||"Loading...",ne(this.spinner,"spinner-overlay"),i!==0&&await B(i||250)):(this.spinnerMsg.textContent=null,ie(this.spinner))}}const v=new se,{submitLoginBtn:oe,usernameInput:ae,usernameError:P,loginModal:et,totalMoneySpan:re,leaderBodyDiv:nt,refreshBtn:le,showElement:$,hideElement:it}=T;class de{constructor(){s(this,"url");s(this,"cookieName");s(this,"username");s(this,"money");this.url="https://simple-api-isq7ga.fly.dev/blackjack",this.cookieName="blackjackUserId",this.username=null,this.money=null,oe.addEventListener("click",async t=>{t.preventDefault(),it(P);const e=ae.value;if(!e||e.length>20)return $(P,"error-message");{let i=e.trim();i=i.replace(/[^a-zA-Z0-9]/g,""),await this.login(i),!this.money||!this.username?P.textContent="Something went wrong. Go yell at Jordan.":it(et)}}),le.addEventListener("click",t=>(t.preventDefault(),this.populateLeaderboard(!1))),console.log("API Class ready")}get cookie(){const t=document.cookie.split("; ");for(const e of t){const[i,a]=e.split("=");if(i===this.cookieName)return decodeURIComponent(a)}return null}set cookie(t){const e=new Date;e.setDate(e.getDate()+1),document.cookie=`${this.cookieName}=${encodeURIComponent(t)}; expires=${e.toUTCString()}; path=/; Secure; SameSite=Strict`}deleteCookie(){console.log("test"),document.cookie=`${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`}init(){const t=this.cookie;return t?this.getUser(t):$(et,"modal")}parseAPIResponse(t){const{_id:e,nickname:i,money:a}=t;this.cookie=e,this.username=i,this.money=a,re.textContent=`$${this.money}`}async login(t){try{await v.setLoading(!0);const e=await window.fetch(`${this.url}/login`,{method:"POST",headers:{"content-type":"application/json;charset=UTF-8"},body:JSON.stringify({nickname:t})});if(!e.ok)throw new Error("cannot login");const i=await e.json();this.parseAPIResponse(i),await this.populateLeaderboard()}catch(e){p.negativeToast("Something went wrong..."),this.deleteCookie(),console.error(e)}finally{await v.setLoading(!1);return}}async getUser(t){try{await v.setLoading(!0);const e=await window.fetch(`${this.url}/user/${t}`);if(!e.ok)throw new Error("not logged in");const i=await e.json();this.parseAPIResponse(i),await this.populateLeaderboard()}catch(e){p.negativeToast("Something went wrong..."),this.deleteCookie(),console.error(e)}finally{await v.setLoading(!1);return}}async populateLeaderboard(t=!0){try{t||await v.setLoading(!0);const e=await window.fetch(`${this.url}/top-ten`);if(!e.ok)throw new Error("not logged in");const i=await e.json();q(nt);for(let a=0;a<10;a++){const r=document.createElement("tr"),n=document.createElement("td"),l=document.createElement("td"),d=document.createElement("td");n.textContent=`${a+1}`,i[a]?(l.textContent=i[a].nickname,d.textContent=`$${i[a].money}`,this.username===i[a].nickname&&$(r,"highlight-user")):(l.textContent="N/A",d.textContent="$0"),r.appendChild(n),r.appendChild(l),r.appendChild(d),nt.appendChild(r)}return}catch(e){p.negativeToast("Something went wrong..."),console.error(e)}finally{await v.setLoading(!1);return}}async update(t,e=!1){try{e||await v.setLoading(!0,"Loading...",0);const i=this.cookie;if(!this.cookie)throw new Error("not logged in");if((await window.fetch(`${this.url}/${i}`,{method:"PUT",headers:{"content-type":"application/json;charset=UTF-8"},body:JSON.stringify({money:t})})).ok)this.money=t;else throw new Error("oops");return}catch(i){p.negativeToast("Something went wrong..."),console.error(i)}finally{await v.setLoading(!1);return}}}const S=new de,{totalMoneySpan:ue,currentBetSpan:ce,betButtons:R,showElement:st}=T;class he{constructor(){s(this,"total");s(this,"currentBet");s(this,"memoryKey");this.memoryKey="blackjack-money",this.total=-999;const t=localStorage.getItem(this.memoryKey);if(t){const{currentBet:i}=JSON.parse(t);this.currentBet=i}else this.currentBet=10,this.memorySet();let e;R.forEach(i=>{const a=i.getAttribute("data-value");a&&parseInt(a)==this.currentBet&&(e=i)}),this.updateDOM(e),R.forEach(i=>{i.addEventListener("click",a=>{a.preventDefault();const r=i.getAttribute("data-value");r&&(this.currentBet=parseInt(r),this.memorySet(),this.updateDOM(i))})}),console.log("Money Class ready")}get currentBetText(){return`$${this.currentBet}`}set totalMoney(t){this.total=t,this.updateDOM()}enoughMoneyCheck(t=1,e=0){return e>0?e<=this.total:this.currentBet*t<=this.total}updateDOM(t){this.total!==-999&&(ue.innerText=`$${this.total}`),ce.innerText=this.currentBetText,t&&(R.forEach(e=>{st(e,"button bet-btn")}),st(t,"button bet-btn bet-btn-active"))}win(){const t=this.currentBet*2;return this.total+=this.currentBet*2,this.apiSet(),p.positiveToast(`+ $${t}`),this.updateDOM()}lose(t=1,e=0){const i=e>0?e:this.currentBet*t;return this.total-=i,this.apiSet(),p.negativeToast(`- $${i}`),this.updateDOM()}push(){return this.total+=this.currentBet,this.apiSet(),p.positiveToast(`+ $${this.currentBet}`),this.updateDOM()}memorySet(){const t=JSON.stringify({currentBet:this.currentBet});localStorage.setItem(this.memoryKey,t)}apiSet(){return S.update(this.total,!0)}}const{chatBotIcon:H,adviceBtn:fe,adviceDiv:_,adviceText:N,actionParagraph:ot,actionText:at,chatBotSpinner:j,chatBotBtns:F,askBtn:rt,showElement:b,hideElement:w}=T;class me{constructor(){s(this,"isLoading");this.isLoading=!1,H.addEventListener("click",t=>{t.preventDefault(),b(_),w(H)}),fe.addEventListener("click",t=>{t.preventDefault(),b(H),w(_)}),console.log("Chatbot Class ready.")}set loading(t){this.isLoading=t,t?(w(N),w(F),b(j)):(w(j),w(rt),b(N),b(ot),b(F))}async suggestion(t,e,i,a){try{this.loading=!0;let r=["Hit","Stand"];i&&r.push("Split"),a&&r.push("Double");const n=await window.fetch("https://simple-api-isq7ga.fly.dev/blackjack/help",{method:"POST",headers:{"content-type":"application/json;charset=UTF-8"},body:JSON.stringify({dealerCardValue:t,playerCardValues:e.cardTextValues.join(", "),actionArray:r.join(", ")})}),{response:l,reasoning:d}=await n.json();N.textContent=d,at.textContent=l}catch(r){p.negativeToast("Something went wrong..."),console.error(r)}finally{this.loading=!1}}reset(){N.textContent="$10 to ask for advice!",at.textContent="",w(j),w(ot),w(_),b(H),b(F),b(rt)}}const O=new me,{showElement:m,hideElement:C,startBtn:pe,pregameDiv:lt,dealerDiv:dt,playerDiv:ut,playerHandsDiv:ye,buttonsDiv:ct,nextRoundBtn:U,mainMenuBtn:V,resultModal:ht,roundResultsDiv:ft,totalBetSpan:ge,resultHeader:W,handButtons:mt,returnBetSpan:ve,handCountSpan:Ee,chatBotDiv:z,askBtn:be,confetti:pt}=T;class we{constructor(){s(this,"deckCount",2);s(this,"suits",["♥","♦","♣","♠"]);s(this,"cardValues",[2,3,4,5,6,7,8,9,10,11,12,13,14]);s(this,"currentDeck",[]);s(this,"currentDeckIdx",0);s(this,"dealerHand");s(this,"playerHands",[]);s(this,"playerHandCurrentIdx",0);s(this,"roundStartHandCount",1);s(this,"money");s(this,"actionButtons");s(this,"hit",async()=>(this.actionButtons.disableUserAction(),await this.deal(!1,!1),this.currentHand.isTurnOver?this.endPlayerTurn():(this.actionButtons.doubleButton.permanentDisable=!0,this.actionButtons.splitButton.permanentDisable=!0,O.reset(),this.actionButtons.enableUserAction())));s(this,"stand",()=>(this.actionButtons.disableUserAction(),this.endPlayerTurn()));s(this,"split",async()=>{if(this.actionButtons.disableUserAction(),!this.money.enoughMoneyCheck()){p.neutralToast("Not enough money..."),this.actionButtons.splitButton.permanentDisable=!0,this.actionButtons.enableUserAction();return}this.money.lose();const t=this.currentHand.removeCardForSplit(),e=new M(this.playerHands.length+1);return this.playerHands.push(e),e.deal(t,!1),this.currentHand.splitHand=!0,e.splitHand=!0,await B(500),await this.deal(!1,!1),await this.deal(!1,!1,!1,e),this.checkSplitAction(),O.reset(),this.actionButtons.enableUserAction()});s(this,"double",async()=>{if(this.actionButtons.disableUserAction(),!this.money.enoughMoneyCheck()){p.neutralToast("Not enough money..."),this.actionButtons.doubleButton.permanentDisable=!0,this.actionButtons.enableUserAction();return}return this.currentHand.double=!0,this.money.lose(),await this.deal(!1,!0,!0),await B(500),this.endPlayerTurn()});this.createDeck(),this.actionButtons=new Gt(new A("hit",this.hit),new A("stand",this.stand),new A("split",this.split),new A("double",this.double)),this.money=new he,pe.addEventListener("click",t=>(t.preventDefault(),this.startRound())),V.addEventListener("click",t=>(t.preventDefault(),this.reset(),this.returnToMain())),U.addEventListener("click",t=>(t.preventDefault(),this.reset(),this.startRound())),mt.forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const i=t.getAttribute("data-value");i&&(this.roundStartHandCount=parseInt(i),Ee.innerText=`${this.roundStartHandCount}`,mt.forEach(a=>{a==t?m(a,"button hand-btn hand-btn-active"):m(a,"button hand-btn")}))})}),be.addEventListener("click",t=>{if(t.preventDefault(),!this.money.enoughMoneyCheck(1,10)){p.neutralToast("Not enough money...");return}if(this.money.lose(1,10),this.dealerHand)return O.suggestion(this.dealerHand.cardTextValues[0],this.currentHand,!this.actionButtons.splitButton.permanentDisable,!this.actionButtons.doubleButton.permanentDisable)}),S.init(),console.log("Game Class ready")}get currentHand(){return this.playerHands[this.playerHandCurrentIdx]}get nextHand(){return this.playerHands[this.playerHandCurrentIdx+1]}async startRound(){if(S.money===null||S.money===void 0){p.negativeToast("Something went wrong...");return}if(this.money.total===-999&&(this.money.totalMoney=S.money),!this.money.enoughMoneyCheck(this.roundStartHandCount))return p.neutralToast("Not enough money..."),this.returnToMain();this.actionButtons.disableUserAction(),C(lt),C(V),C(U),m(dt),m(ut),m(ct,"buttons"),this.money.lose(this.roundStartHandCount),this.dealerHand=new M(-1);for(let t=0;t<this.roundStartHandCount;t++)this.playerHands.push(new M(t+1));if(this.playerHandCurrentIdx=0,await this.dealOneToAll(!1),await this.dealOneToAll(!0),this.actionButtons.splitButton.permanentDisable=!this.currentHand.canHandSplit,await B(500),this.dealerHand.isTurnOver)return this.endRound();if(this.currentHand.isTurnOver)return this.endPlayerTurn();this.currentHand.active=!0,this.actionButtons.enableUserAction(),m(z),this.checkSplitAction()}createDeck(){this.currentDeck=[];for(let t=0;t<this.deckCount;t++)this.suits.forEach(e=>{this.cardValues.forEach(i=>{this.currentDeck.push(new zt(e,i))})});for(let t=0;t<this.currentDeck.length;t++){const e=Math.floor(Math.random()*(t+1));[this.currentDeck[t],this.currentDeck[e]]=[this.currentDeck[e],this.currentDeck[t]]}}async deal(t,e,i=!1,a){await B(250);let r,n=this.currentDeck[this.currentDeckIdx];a?r=a:t&&this.dealerHand!==void 0?r=this.dealerHand:r=this.currentHand,n.isFaceDown=e,r.deal(n,i),this.currentDeckIdx++,this.currentDeckIdx==this.currentDeck.length&&(await v.setLoading(!0,"Reshuffling...",1e3),this.createDeck(),this.currentDeckIdx=0,await v.setLoading(!1)),await B(250)}async dealOneToAll(t){for(let e=0;e<this.playerHands.length;e++)await this.deal(!1,!1,!1,this.playerHands[e]);await this.deal(!0,t)}checkSplitAction(){(this.playerHands.length>3||!this.currentHand.canHandSplit||!this.money.enoughMoneyCheck())&&(this.actionButtons.splitButton.permanentDisable=!0,this.actionButtons.splitButton.disableButton())}endPlayerTurn(){if(this.currentHand.active=!1,O.reset(),this.playerHands.length==this.playerHandCurrentIdx+1){C(z),this.dealerTurn();return}if(this.nextHand.isTurnOver){this.playerHandCurrentIdx++,this.endPlayerTurn();return}this.playerHands[this.playerHandCurrentIdx+1].active=!0,this.playerHandCurrentIdx++,this.actionButtons.permanentEnableActionButtons(),this.actionButtons.enableUserAction(),this.checkSplitAction()}async dealerTurn(){var t,e;for(this.currentHand.active=!1,(t=this.dealerHand)==null||t.showHandAndTotal(),await B(250);(e=this.dealerHand)!=null&&e.shouldDealerHit;)await this.deal(!0,!1);return this.endRound()}handWin(t){if(!this.dealerHand)return-1;const e=this.dealerHand.total;return t>21?0:e>21?1:t==e?2:e>t?0:1}async endRound(){var i;(i=this.dealerHand)==null||i.showHandAndTotal(!0);let t=0,e=0;this.playerHands.forEach(a=>{a.showHandAndTotal(!0);let r=0;a.doubledHand?r+=this.money.currentBet*2:r+=this.money.currentBet;const n=this.handWin(a.total),l=document.createElement("p"),d=this.playerHands.length==1?"":`${a.handIdText}: `;switch(n){case 0:l.innerHTML=`${d}<b><span class="loss">Loss - $${r}</span></b>`;break;case 1:l.innerHTML=`${d}<b><span class="win">Win + $${r*2}</span></b>`,e+=r*2,this.money.win();break;case 2:l.innerHTML=`${d}<b><span class="push">Push + $${r}</span></b>`,e+=r,this.money.push();break;default:l.innerHTML=`${d}<b><span class="loss">Something went wrong...</span></b>`;break}t+=r,ft.appendChild(l)}),await B(500),this.actionButtons.hideActionButtons(),ge.innerText=`$${t}`,ve.innerText=`$${e}`,m(U,"button"),m(V,"button"),m(ht,"modal"),e>t?(m(W,"win"),await pt.addConfetti({confettiNumber:100}),pt.clearCanvas()):e<t?m(W,"loss"):m(W)}reset(){this.dealerHand=void 0,this.playerHands=[],this.actionButtons.permanentEnableActionButtons(),document.getElementById("dealer-hand").remove(),q(ye),q(ft),C(ht)}returnToMain(){C(dt),C(ut),C(ct),C(z),m(lt,"pre-game")}}new we;
