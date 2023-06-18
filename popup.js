var tabid=0;
var words=[];
var countwords=0;
var cw=0;
var totalcharlen=0;

var randomColors=typeof(localStorage['randomColors'])!='undefined'?((localStorage["randomColors"]=='true')?true:false):false;
var delay=typeof(localStorage['delay'])!='undefined'?localStorage['delay']:55;
var clearfor=typeof(localStorage['clearfor'])!='undefined'?localStorage['clearfor']:10;
var perletterdelay=typeof(localStorage['perletterdelay'])!='undefined'?localStorage['perletterdelay']:10;
var staticWpmSample=typeof(localStorage['staticWpmSample'])!='undefined'?((localStorage["staticWpmSample"]=='true')?true:false):false;
var calcSampleTxt=typeof(localStorage['calcSampleTxt'])!='undefined'?localStorage['calcSampleTxt']:'To continue with the default action, save a reference to the original pushState function, and then call it';
var running=false,updateseek=true;

var tb=false,sk=false,del=false,ldel=false,skd=false;;
var t1,t2;
var activation_attempts = 0;
function activate_tab(){
	if( activation_attempts > 0 ) {
		console.log("serial speed reader extension alredy activated the content script and will not try again until you trigger the popup again...")
		return;
	}
	activation_attempts++;
	chrome.tabs.executeScript(tabid, {file: "read.user.js"}, function(){
		if(chrome.runtime.lastError){
			console.log(chrome.runtime.lastError.message);
			return;
		}
		setTimeout(iin, 250);
	});
}

function iin(){
	tb=	document.getElementById('text');
	sk= document.getElementById('seek');
	del=document.getElementById('delay');
	ldel=document.getElementById('letterdelay');
	skd=document.getElementById('seek_disp');
	del.value=del.max-delay;
	ldel.value=ldel.max-perletterdelay;
	document.getElementById('delay_disp').innerHTML=(delay/1000)+'s';
	document.getElementById('ldelay_disp').innerHTML=(perletterdelay/1000)+'s';
	chrome.windows.getCurrent(function(window){
		chrome.tabs.getSelected(window.id, function(tab){
			tabid=tab.id;  			
			chrome.tabs.sendRequest(tabid,{getSel:true},function(r){
				if(chrome.runtime.lastError){
					console.log("serial speed reader extension is activating the content script and will be active soon...")
					activate_tab();
					return;
				}
				cw=0;
				words=parseWords(r.t);
				totalcharlen=words.join('').length;
				countwords=words.length;
				if(countwords > 1 ){
					sk.max=countwords-1;
					nw();
				}else{
					recomputeWpm();//computes based on sample text
				}
			});
		})
	})
}
function parseWords(paragraph){
	return paragraph.split(/\s+/g);
}
function nw(){
	running=true;
	var ww=words[cw++];
	tb.innerHTML=ww;
	ut()
	if(updateseek && cw<countwords){
		sk.value=cw;
		var del=(delay-0)+(perletterdelay*ww.length)
		t1=setTimeout(function(){tb.innerHTML=''},del-clearfor);
		t2=setTimeout(nw,del);
		if(randomColors)tb.style.color='#'+Math.floor(Math.random()*8388607).toString(16);
	}else{
		running=false;
	}
}
function udt(){
	localStorage['delay']=del.max-del.value;
	delay=localStorage['delay'];
	document.getElementById('delay_disp').innerHTML=(delay/1000)+'s',ut()
}
function uldt(){
	localStorage['perletterdelay']=ldel.max-ldel.value;
	perletterdelay=localStorage['perletterdelay'];
	document.getElementById('ldelay_disp').innerHTML=(perletterdelay/1000)+'s',ut()
}
function uds(){
	cw=sk.value;
	tb.innerHTML=words[cw];
	ut();
	if(!running && updateseek)nw();
}
function cls(){
	updateseek=false;
	running=false;
	clearTimeout(t1);
	clearTimeout(t2);
}
function ut(){
	var ts=(delay*countwords)+(perletterdelay*totalcharlen);
	skd.innerHTML=secondsToHms(ts/1000);
	recomputeWpm();
}
function recomputeWpm(){
	var cntWrd=countwords;
	var totChr=totalcharlen;
	var calcQualifier = '';
	if( staticWpmSample || cntWrd < 2 ){
		var wrds=parseWords(calcSampleTxt);
		cntWrd = wrds.length;
		totChr = wrds.join('').length;
		if(perletterdelay > 0)calcQualifier='~';
	}
	//var clearTime = clearfor * cntWrd;//clear time does not count inside caluclation
	var wordTime = delay * cntWrd;
	var letterTime = perletterdelay * totChr;
	var wpm = cntWrd / (((wordTime + letterTime) / 1000) /60);
	document.getElementById('wpm').innerHTML = calcQualifier+Math.round(wpm);
}
function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}

function forceupdateseek(){
	updateseek=true;uds()
}

document.addEventListener('DOMContentLoaded', function () {
	iin();
	
  document.getElementById('seek').addEventListener('mousedown', cls);
  document.getElementById('seek').addEventListener('mouseup', forceupdateseek);
  document.getElementById('seek').addEventListener('change', uds);
  
  document.getElementById('delay').addEventListener('change', udt);
  document.getElementById('letterdelay').addEventListener('change', uldt);
});


//	full random  		//'#'+Math.floor(Math.random()*16777215).toString(16);
