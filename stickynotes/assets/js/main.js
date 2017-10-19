function ready(cb) {
    /in/.test(document.readyState)
    ? setTimeout(ready.bind(null, cb), 90)
    : cb();
};

ready(function(){

    var App = {
        "init": function() {
            this._applicationDbContext = ApplicationDbContext; // Reference to the ApplicationDbContext object
            this._applicationDbContext.init('ahs.nmd.stickynotes'); // Intialize the ApplicationDbContext with the connection string as parameter value
            // show all the saved stickyNotes
            this.testApplicationDbContext();
 
        },
        "testApplicationDbContext": function() {
            // 3. Get allesticky notes
            var applicationDbContextLoc = this._applicationDbContext // save the applicationDbContext in a variabele
            let data = applicationDbContextLoc.getStickyNotes();
            console.log(data);  

            // btn/input callers
            var searchInput = document.querySelector('.input-search');
            var btnDelete = document.querySelector('.btn.delete');
            var btnModify = document.querySelector('.btn.modify');
            var btnSoftDelete = document.querySelector('.btn.softDelete');
            var btnSoftUnDelete = document.querySelector('.btn.softUnDelete');

            // get the message input from the inputfield
            var messageInput = document.querySelector('.input-message');
            // new message when modified
            var newMessageInput = document.querySelector('.input-newMessage');
               
           

            
            // To modify a StickyNote
            btnModify.onclick = function(){
                rn = applicationDbContextLoc.getStickyNoteById(searchInput.value);

                if (rn == null){
                    alert("Zoek eerst je StickyNote op met een geldige id.")                // geldige id nodig
                } else if (rn.deletedDate !== null){                                        // als het softverwijderd is zal eht niet werken
                    alert("het is verwijderd, gelieve uw note te undeleten");
                } else {
                console.log("hi");
                
                rn = applicationDbContextLoc.getStickyNoteById(searchInput.value);
                rn.message = messageInput.value;
                var saveDate = rn.createdDate;                                              // save created date into a variable
                rn.modifiedDate = new Date().toUTCString();
                rn = applicationDbContextLoc.updateStickyNote(rn);                          // add to db and save it
                rn.createdDate = saveDate;                                                  // get the created date from savedate
                saveDate = "";                                                               // empty that savedatevariable
                
                console.log(data);  
                
                rn = applicationDbContextLoc.getStickyNoteById(searchInput.value);
                showStickyNote(rn);  
                }

            }

            // To softDelete
            btnSoftDelete.onclick = function(){
                rn = applicationDbContextLoc.getStickyNoteById(searchInput.value);           // get userinput             
                              
                if (rn === null){
                    alert("Zoek eerst een StickyNote op.");                                 // if no id's are found show this alert
                    return;                    
                } else if (rn.deletedDate !== null) {
                    alert("Deze StickyNote is al reeds softverwijderd.");                    // if the StickyNote is already softdeleted show this alert
                    return;
                } else {                   
                sn = applicationDbContextLoc.softDeleteStickyNoteById(searchInput.value);
            
                var saveDate = rn.createdDate;        
                rn.createdDate = saveDate;                                                  // get the created date from savedate
                saveDate = "";                                                              // empty that savedatevariable
                
                showStickyNote(rn); 

                // tho show theresult
                //pm = applicationDbContextLoc.getStickyNoteById(searchInput.value);
                //console.log(pm); 
                }            
            }
            
                
            // To softUnDelete
            btnSoftUnDelete.onclick = function(){
                rn = applicationDbContextLoc.getStickyNoteById(searchInput.value);           // get userinput             
                
                if (rn === null){
                    alert("Zoek eerst een StickyNote op.");                                 // if no id's are found show this alert
                    return;                    
                } else if (rn.deletedDate === null) {
                    alert("Deze StickyNote bestaat reeds.");                                 // if the StickyNote is already softdeleted show this alert
                    return;
                } else {
                    sn = applicationDbContextLoc.softUnDeleteStickyNoteById(searchInput.value);
                   
                var saveDate = rn.createdDate;                                              // save the date in a variabele 
                    rn.createdDate = saveDate;                                              // get the created date from savedate
                    saveDate = "";                                                          // empty that savedatevariable
                    
                    showStickyNote(sn); 
                    
                    // to show the result
                    pm = applicationDbContextLoc.getStickyNoteById(searchInput.value);
                    console.log(pm);  
                   
                }
            }

             // add a stickyNote
             document.querySelector('.stickyNoteForm').addEventListener('submit', function (e) {
                
                //prevent the normal submission of the form
                e.preventDefault();
                
                        
                let sn = new StickyNote();
                   
                if (messageInput.value == ""){
                    //console.log("1");                                
                    alert("Geef eerst een message in.");                                        // if the nput is empty show ths alert
                    return;
                }  else {
                    //console.log('2');
                    sn.message = messageInput.value;
                    sn = applicationDbContextLoc.addStickyNote(sn);                             // add to db and save it
                    
                    showStickyNote(sn);   
                    
                    messageInput.value = '';  
                    messageInput.placeholder="add a new message..."; 
                }             
            });                  

             
             
            // To search a StickyNote
            document.querySelector('.stickyNoteSearchForm').addEventListener('submit', function (e) {
               
                //prevent the normal submission of the form
                e.preventDefault();

                var sn =  applicationDbContextLoc.getStickyNoteById(searchInput.value);
                
               
                if (sn === null){                                                                   // if the input isn't same as an I show this alert
                    alert("geef een geldige StickyNote ID in.");
                }  else {                
                    var sn =  applicationDbContextLoc.getStickyNoteById(searchInput.value);         // had to change the condition of getStickyNoteById from === to == 
                    showStickyNote(sn);  

                    var pn =  applicationDbContextLoc.findIndexStickyNoteById(searchInput.value);   // to obtain the index of our searched stickynote
                    console.log(pn);

                    messageInput.placeholder="add or modify message.";  
                }
                

            });

            // to fully delete a StickyNote
            btnDelete.onclick = function(){
                var pn =  applicationDbContextLoc.getStickyNoteById(searchInput.value);  
                if (pn === null){                                                                   // if the input isn't same as an I show this alert
                alert("Zoek eerst een StickyNote op.");               
                }  else {
                var pn =  applicationDbContextLoc.getStickyNoteById(searchInput.value);  
                const deleted = applicationDbContextLoc.deleteStickyNoteById(searchInput.value);    // delete stickynote after searching it by putting in the ID 
                console.log(deleted);
                
                searchInput.value = '';               
                }
            }

            // function to process stuff into html
            showStickyNote = function(sn){
                tempStr='';
                tempStr += "<br>" + '<div class="stickyNote-id"> Stickynote id: '+ "<strong>" + sn.id +  "</strong>"  +"</div>" + "<br>";
                tempStr += '<div class="stickyNote-message">Message:    '+ "<strong>" +sn.message + "</div>" +  "</strong>" +"<br>";
                tempStr += '<div class="stickyNote-createdDate"> Date created:  '+ "<strong>" + sn.createdDate +"</strong>" + "</div>" + "<br>" ;
                                
                if (sn.modifiedDate != null){
                    tempStr += '<div class="stickyNote-modifiedDate">  Date modified:   '+ "<strong>" + sn.modifiedDate + "</strong>" +"</div>" + "<br>";
                } else {
                        tempStr +=  '<div class="stickyNote-modifiedDate">  Date modified:  '+ "<strong>" + "nog nooit gewijzigd" +"</strong>" + "</div>" + "<br>";
                };
        
                if (sn.deletedDate != null){
                    tempStr += '<div class="stickyNote-deleteDate"> Date deleted:   '+ "<strong>" +  sn.deletedDate +"</strong>" + "</div>" + "<br>";
                } else {
                    tempStr += '<div class="stickyNote-deleteDate"> Date deleted:   '+ "<strong>" + "momenteel niet verwijderd" +"</strong>" + "</div>" + "<br>";
                };
                document.querySelector('.data').innerHTML = tempStr; 
            }

        }
    }; 
    App.init(); // Initialize the application
    
});