var selectedItem = {};
 
 
 $(function(){
      monomer.pageShow('#Main');
      updateErrorList(100);

      $(".opOmitir").click(function () {
          try{
            omitirPalabra(selectedItem[0].textoAValidar);
          }catch(ex){}
      })
      $(".opOcultarBoton").click(function(){
  
        chrome.tabs.getSelected(null, function(tab){
         chrome.tabs.sendRequest(tab.id, {action : 'ocultarBoton', ocultar: true}, function(output) {
                
            });
        });
      })
      $(".opMostrarBoton").click(function(){
   
        chrome.tabs.getSelected(null, function(tab){
         chrome.tabs.sendRequest(tab.id, {action : 'ocultarBoton', ocultar: false}, function(output) {
                
            });
        });
      })

      $(".opBorrarOmitidas").click(function(){
        chrome.tabs.getSelected(null, function(tab){
         chrome.tabs.sendRequest(tab.id, {action : 'borrarOmitidas'}, function(output) {
                
            });
        });
      })

      $("#btnValidar").click(function () {
         $('#errores').html("");
         monomer.showLoading();
         chrome.tabs.getSelected(null, function(tab){
          chrome.tabs.sendRequest(tab.id, {action : 'validaOrtografia'}, function(output) {
             updateErrorList(0);
             monomer.hideLoading();
          });
        });
        
      })
       $("#btnDeleteWord").click(function () {
         chrome.tabs.getSelected(null, function(tab){
          chrome.tabs.sendRequest(tab.id, {action : 'deleteWord'}, function(output) {
          
              });
        });
      })

      })
       var listItem = function(data, config){
        try{
        return [
          '<li>',
            '<div>',
              '<div class="test_box fab z-d1">',
                '<img src="img/abc.png" alt=""> ',
               '</div>',
            '</div>',
            '<div>',
              '<div>',
                '<h3>' + data[0].textoAValidar + '</h3>',
                '<p>'+ data[0].suggestions.join(",") +'</p>',
              '</div>',
              (config && '<span class="expand-config button-right icon-ellipsis-v icon-1x icon-black wordOptions" target=".itemMenu">'),
              '</span>',
            '</div>',
        '</li>',
        ].join("\n");
      }catch(ex){
        return "";
      }
      };
      var totalItemsToList = 0;
      var currentItemProcessing = 0;
      function setListItems (items,_fun) {
        try{
        $('#errores').html("");
        
        currentItemProcessing = 0;
        totalItemsToList = items.length;
        for(var item in items){ 
          currentItemProcessing++;
          word = items[item];
          li = $(listItem(word, true));
          
          li.data("data",JSON.stringify(word));
          li.click(function(a,b,c) {

            selectedItem = JSON.parse($(a.currentTarget).data("data"));
          });  
          $('#errores').append(li);
          if(currentItemProcessing == totalItemsToList){
            monomer.__init();
            monomer.__setAspect();
            //_fun();
          }
         }
         }catch(ex){
          console.log(ex);
         }
        }
      function setDeletedListItems (items,_fun) {
        try{
        $('#omitidos').html("");
        currentItemProcessing = 0;
        totalItemsToList = items.length;
        
        
        for(var item in items){ 
          if (items.hasOwnProperty(item)) {
            
          
          currentItemProcessing++;
          word = items[item];
          if(word.length > 0){
            li = $(listItem([{
              textoAValidar : word,
              suggestions :[]
            }]));
            $('#omitidos').append(li);
          }
          if(currentItemProcessing == totalItemsToList){
            monomer.__init();
            monomer.__setAspect();
          }
          }
         }
         }catch(ex){
          console.log(ex);
         }
        }
    updateErrorList = function (timeout) {
      
      if(!timeout){
        timeout = 2000;
      }
      setTimeout(function () {
        
        chrome.tabs.getSelected(null, function(tab){
         chrome.tabs.sendRequest(tab.id, {action : 'getResponseObject'}, function(output) {
                setListItems(output)
            });
        });
      },timeout);
        chrome.tabs.getSelected(null, function(tab){
         chrome.tabs.sendRequest(tab.id, {action : 'getDeletdWords'}, function(output) {
          
                setDeletedListItems(output)
            });
        });
      
    }
omitirPalabra = function  (palabra) {
   chrome.tabs.getSelected(null, function(tab){
         chrome.tabs.sendRequest(tab.id, {action : 'omitirPalabra', palabra: palabra}, function(output) {
                setListItems(output)
            });
        });
}


  
