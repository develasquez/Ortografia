//Sepeara Palabras por ,
deletedWords = "";
correctWords = "";
responseObject = [];
	function  ajax(url,_fun,params){
	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", url, true);
	    xhr.onreadystatechange = function() {
	      if (xhr.readyState == 4) {
	        var resp = JSON.parse(xhr.responseText.replace("/**/",""));
	      _fun(resp,params)
	      }
	    }
	    xhr.send();
  	};
	forEach = function (array, callback, scope) {
	  for (var i = 0; i < array.length; i++) {
	    callback.call(scope, i, array[i]); // passes back stuff we need
	  }
	};
	function removeClass(ele,cls) {
   		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
	   ele.className = ele.className.replace(reg,' ');
	};
	function addClass(ele,cls) {
   		
	   ele.className = ele.className + " " + cls + " "  ;
	};

	if(!localStorage.getItem("ocultarBoton")){
		localStorage.setItem("ocultarBoton","true");
	}
	
	validaOrtografia = (function(){
		var responseObject = [];
		var elements = document.querySelectorAll('label, span, a , input,li , th, td, i, pre, p, h1, h2, h3, h4 ,h5 , button, input[type="button"], input[type="submit"]');
		

		
	
		init = function(){
			localStorage.setItem("responseObject","");
			if(!localStorage.getItem("deletedWords")){
				localStorage.setItem("deletedWords",deletedWords)
			}else{
				deletedWords = localStorage.getItem("deletedWords");
			}

			if(!localStorage.getItem("correctWords")){
				localStorage.setItem("correctWords",correctWords)
			}else{
				correctWords = localStorage.getItem("correctWords");
			}
			crateTrigger();
		};

		validar = function(_fun){
		
			responseObject = [];
			localStorage.setItem("responseObject","");
			var totalElements = 0;
			var currenElement = 0 ;

			forEach (elements, function(index, element){ 

				removeClass(element, "faltaOrtografia");	

				if (element.textContent.length > 0 ){
						var textoAValidar = element.textContent ;

						textoAValidar = textoAValidar.replace(/(\r\n|\n|\r)/g,"");
						textoAValidar = textoAValidar.replace(/[\t ]+/g," ");


						var arrText = textoAValidar.trim().split(" ");
						for (var i =0 ; i < arrText.length ; i++) {
							var palabra = arrText[i];
							if (deletedWords.indexOf(palabra) > -1){
								arrText[i] = "";
							}else{
								arrText[i] = arrText[i].replace(/(\r\n|\n|\r)/g,"").replace(/[\t ]+/g," ")
							}
								
				

				
							if (correctWords.indexOf(arrText[i]) == -1){
								totalElements++;
								try{
									 ajax("http://www.webspellchecker.net/web_api_test.php?text="+ arrText[i]+ "&slang=es_ES&format=json&out_type=positions",
						                    
						                    function (data,textoAValidar) {
						                    	try{
						                    		data[0].textoAValidar = textoAValidar
							                    }catch(ex){}

							                    if(JSON.stringify(responseObject).indexOf(textoAValidar) == -1){
						                    		responseObject.push(data);
						                		}
						                    	localStorage.setItem("responseObject",JSON.stringify(responseObject));
						                    	if(data.length > 0){
						                    		addClass(element, "faltaOrtografia");
						                    	}else{
						                    		correctWords += ", " + textoAValidar.trim() ;
													localStorage.setItem("correctWords",correctWords);
						                    	}
						                    currenElement++;
						                    if(currenElement == totalElements){
						                    	
						                    	_fun();
						                    }
						                },
						                arrText[i])  	
								}catch(ex){}
						 	}

				

					 }
				}
			})
		}
		deleteWord = function  (word) {
		if(!word){
			word = getSelectionText();
		}
			deletedWords += ", " + word;
			localStorage.setItem("deletedWords",deletedWords);
		};
		getSelectionText = 	function() {
		    var text = "";
		    if (window.getSelection) {
		        text = window.getSelection().toString();
		    } else if (document.selection && document.selection.type != "Control") {
		        text = document.selection.createRange().text;
		    }
		    return text;
		};
		toggleTrigger = function(display){

			btn = document.querySelector("#triggerOrtografia");
			if(display){
				btn.style.display= "block";
			}
			else{
				btn.style.display= "none";
			}	
			
		};
		crateTrigger = function(){
			
			

			var btn = document.createElement("button");
			btn.className="floating-button";
			btn.innerText = "?";
			btn.style.top= (window.innerHeight  - (16 * 4) - 43).toString() + "px" ;
			btn.style.left =  (window.innerWidth - (16 * 3) - 56).toString() + "px" ;
			btn.style.position= "fixed";
			btn.id = "triggerOrtografia";
	    	btn.style["z-index"]= "10000";
			btn.onclick = function(){
				validaOrtografia.validar();
			}
			document.body.appendChild(btn); 
			
			if(localStorage.getItem("ocultarBoton") == "true")
			{
				toggleTrigger(false);
			}else{
				toggleTrigger(true);
			}
			head = document.head || document.getElementsByTagName('head')[0],
		    style = document.createElement('style');
			
			var css = 	"button.floating-button{width: 56px;"+
					  	"height: 56px;"+
						"-webkit-border-radius: 50%;"+
						" -moz-border-radius: 50%;"+
						" border-radius: 50%;"+
						" border: none;"+
						"-webkit-box-shadow: 1px 1px 6px -1px #8c8c8c ;"+
						"box-shadow: 1px 1px 6px -1px #8c8c8c ;"+
						"  padding-top: 7px;"+
						"    font-size: 16px;"+
						"    text-align: center;"+
						"    overflow:hidden;"+
						"margin:1em;"+
						"}";

	        css += ".floating-button{"+
	                  "    -webkit-transition:  top .263s  ease-in-out, left .263s  ease-in-out ;"+
	                  "    -moz-transition:  top .263s  ease-in-out, left .263s  ease-in-out ;"+
	                  "    -o-transition:  top .263s  ease-in-out, left .263s  ease-in-out ;"+
	                  "    transition:  top .263s  ease-in-out, left .263s  ease-in-out ;"+
	                  "}"+
	                  ".floating-button:focus{"+
	                  "    -webkit-animation: hover .263s   ;"+
	                  "    -moz-animation: hover .263s   ;"+
	                  "    -o-animation: hover .263s   ;"+
	                  "    animation: hover .263s   ;"+
	                  "}";


	        css += ".faltaOrtografia{ background-color:#FF3B3B; border:solid 1px #CACACA; color: #fff !important; }";
			style.type = 'text/css';

			if (style.styleSheet){
			  style.styleSheet.cssText = css;
			} else {
			  style.appendChild(document.createTextNode(css));
			}

			head.appendChild(style);
		};
		init();
		return {
			validar:validar,
			deleteWord:deleteWord,
			toggleTrigger:toggleTrigger
		}
	})();




	chrome.extension.onRequest.addListener(function(request, sender, callback)
	{
		
	    if (request.action == 'validaOrtografia')
	    {    

	        validaOrtografia.validar(callback);
	    }

	    if (request.action == 'deleteWord')
	    {    

	        validaOrtografia.deleteWord();
	    }
	    if (request.action == 'getResponseObject')
	    {    
	        callback(JSON.parse(localStorage.getItem("responseObject")));
	    }
	    if (request.action == 'getDeletdWords')
	    {    
	    	
	        callback(localStorage.getItem("deletedWords").replace(",","").split(","));
	    }
	    if (request.action == 'omitirPalabra')
	    {    

	        validaOrtografia.deleteWord(request.palabra);
	    }
	    if (request.action == 'ocultarBoton')
	    {    
	        localStorage.setItem("ocultarBoton",request.ocultar.toString());
	        
	        validaOrtografia.toggleTrigger(!request.ocultar);
	    }
	    if (request.action == 'borrarOmitidas')
	    {
	    	localStorage.setItem("deletedWords","");
	    }
	});
