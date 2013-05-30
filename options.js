function getEventTargetA(ev){
	ev = ev || event;
	var targ=(typeof(ev.target)!='undefined') ? ev.target : ev.srcElement;
	if(targ !=null){
	    if(targ.nodeType==3)
	        targ=targ.parentNode;
	}
	if(targ.nodeName != 'A')return targ.parentNode;
	return targ;
}
var pOptions=[];
//pOptions["maxhistory"]={def:15,ind:0,name:'Max History per Window '};
//pOptions["dothumbs"]={def:false,ind:0,name:'Collect Thumbnails'};
//pOptions["hqthumbs"]={def:false,ind:1,name:'HQ Thumbnails (more ram) '};

//WARNIGN you have to set defaults two places for now...
pOptions["randomColors"]={def:false,ind:0,name:'Colorize Text'};
pOptions["delay"]={def:55,ind:0,name:'ms Delay Between Words'};
pOptions["clearfor"]={def:10,ind:1,name:'ms Clear Screen Duration'};
pOptions["perletterdelay"]={def:10,ind:1,name:'ms Delay per each letter'};
//pOptions["previewOnPage"]={def:false,ind:0,name:'On page zoomed preview'};

// Saves options to localStorage.
function save_options() {
//  var select = document.getElementById("color");
//  var color = select.children[select.selectedIndex].value;
//  localStorage["favorite_color"] = color;
  	
  	for( i in pOptions){
  		if(typeof(pOptions[i].def)=='boolean')
  			localStorage[i] = document.getElementById(i).checked;
  		else
  			localStorage[i] = document.getElementById(i).value;
  	}
	
	
	//localStorage["hqthumbs"] = document.getElementById("hqthumbs").checked;
	//localStorage["showCurrentTab"] = document.getElementById("showCurrentTab").checked;
	//localStorage["maxhistory"] = document.getElementById("maxhistory").value;
	
	
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
  
  chrome.extension.sendRequest({greeting: "reloadprefs"}, function(response) { });
}

function reset_options() {
	for( i in pOptions){
		if(typeof(pOptions[i].def)=='boolean')
			document.getElementById(i).checked = pOptions[i].def;
		else
			document.getElementById(i).value = pOptions[i].def;
	}
	
	var status = document.getElementById("status");
  status.innerHTML = "You still need to press save, defaults are showing now.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 1750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	for( i in pOptions){
		if(typeof(pOptions[i].def)=='boolean')
			document.getElementById(i).checked = ((localStorage[i]=='true')?true:pOptions[i].def);
		else
			document.getElementById(i).value = ((localStorage[i])?localStorage[i]:pOptions[i].def);
	}


//  var favorite = localStorage["favorite_color"];
//  if (!favorite) {
//    return;
//  }
//  var select = document.getElementById("color");
//  for (var i = 0; i < select.children.length; i++) {
//    var child = select.children[i];
//    if (child.value == favorite) {
//      child.selected = "true";
//      break;
//    }
//  }
}
function init(){
	
//	var a=document.getElementById('dupli');
//	var b=a.cloneNode(true);
//	b.id='nota';
//	b.style.color='black';
//	b.style.position='absolute';
//	b.style.top='1px';b.style.left='1px';
//	a.appendChild(b);
	
	//needs some compression 
	for( i in pOptions){
		if(pOptions[i].select){
			var l=document.createElement('label');
			var cb=document.createElement('select');
			cb.setAttribute('type','select');
			cb.setAttribute('id',i);
			if(pOptions[i].ind>0)l.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0'));
			if(pOptions[i].ind>1)l.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0'));
			l.appendChild(document.createTextNode(pOptions[i].name));
			l.appendChild(cb);
			
			
			for(z in pOptions[i].select){
				var opt=document.createElement('option');
				opt.setAttribute('value',z);
				opt.appendChild(document.createTextNode(pOptions[i].select[z]));
				cb.appendChild(opt);
			}
			
			document.getElementById('bsave').parentNode.insertBefore(l,document.getElementById('bsave'));
		}else if(typeof(pOptions[i].def)=='boolean'){
			var l=document.createElement('label');
			var cb=document.createElement('input');
			cb.setAttribute('type','checkbox');
			cb.setAttribute('id',i);
			if(pOptions[i].ind>0)l.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0'));
			if(pOptions[i].ind>1)l.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0'));
			l.appendChild(cb);
			l.appendChild(document.createTextNode(pOptions[i].name));
			if(pOptions[i].img){
				var t=pOptions[i].img;
				i=document.createElement('image');
				i.setAttribute('src',t);
				i.setAttribute('align','top');
				l.appendChild(i);
			}
			document.getElementById('bsave').parentNode.insertBefore(l,document.getElementById('bsave'));
			//.getElementById(i).checked = ((localStorage[i]=='true')?true:pOptions[i].def);
		}else{
			var l=document.createElement('label');
			var cb=document.createElement('input');
			cb.setAttribute('type','text');
			cb.setAttribute('id',i);cb.setAttribute('size',(pOptions[i].def + '').length);
			if(pOptions[i].ind>0)l.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0'));
			l.appendChild(cb);
			l.appendChild(document.createTextNode(pOptions[i].name));
			document.getElementById('bsave').parentNode.insertBefore(l,document.getElementById('bsave'));
			//document.getElementById(i).value = ((localStorage[i])?localStorage[i]:pOptions[i].def);
		}
	}
	
	restore_options()
}

function toggle_next_sibling_display(ev){
	who=getEventTargetA(ev);
	//var ns=who.nextSibling;if(ns.style.display=='block'){ns.style.display='none'}else{ns.style.display='block'}
	var nss=who.nextSibling.style;if(nss.display=='block')nss.display='none';else nss.display='block';
}

document.addEventListener('DOMContentLoaded', function () {
	init()
	document.getElementById('bsave').addEventListener('click', save_options);
	document.getElementById('defa').addEventListener('click', reset_options);
	document.getElementById('shohelp').addEventListener('click', toggle_next_sibling_display);
});
