let profileSectionTemplate = 
    '<div id="profileSection">'+
        '<div style="background-image:url(\'<%= userInfo.picture %>\');" id="profilePhoto"></div>'+
        '<div id="profileNameEmail">'+
            '<div id="profileName"><%= userInfo.name %></div>'+
            '<a id="profileEmail" href="mailto:<%= userInfo.link %>">Google+</a>'+
        '</div>'+
    '</div><hr>'+
    '<div id="contactsSection"></div>';

let sContactTemplate = 
'<% for(var i = 0; i < contacts.length; ++i) { %>'+
    '<div class="contactlistItem">'+
        '<div class="contactNameNumber">'+
            '<div class="contactName"><%= contacts[i].title.$t %></div>'+
            '<div class="contactNumber"><%= contacts[i].gd$phoneNumber && contacts[i].gd$phoneNumber[0] &&  contacts[i].gd$phoneNumber[0].$t ? contacts[i].gd$phoneNumber[0].$t : "-" %></div>'+
        '</div>'+
    '<% if(contacts[i].gd$email && contacts[i].gd$email[0] && contacts[i].gd$email[0].address) { %>'+
        '<div class="contactEmail" data-email="<%= contacts[i].gd$email[0].address %>" data-name="<%= contacts[i].title.$t %>"></div>'+
    '<% } %>'+
    '</div>'+
'<% } %>';

  