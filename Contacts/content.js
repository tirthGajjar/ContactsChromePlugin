function createNewElementWithIdentifier(sElementTag, sIdentifierType, sIdentifier) {
	var sIdentifierType = sIdentifierType.toLowerCase();
	var oElement = document.createElement(sElementTag);

	switch(sIdentifierType){
		case "id":
			oElement.id = sIdentifier;
			break;
		case "class":
			oElement.classList.add(sIdentifier);
			break;
	}
	return oElement;
}

function generateProfileSection(){
	let profileCompiler = _.template(profileSectionTemplate);
	let oDrawerBodyEle = createNewElementWithIdentifier("div","id","DrawerBody");
	oDrawerBodyEle.innerHTML = profileCompiler({userInfo:JSON.parse(oUserDetails)});
	let contactsSection = createNewElementWithIdentifier("div","id","contactsSection");
	contactsSection.innerHTML = renderContacts(oUserContacts);
	oDrawerBodyEle.appendChild(contactsSection);
	return oDrawerBodyEle;
}

function renderContacts(oUserContacts){
	let arrContactEntries = JSON.parse(oUserContacts).feed.entry;
	let usefulContacts = _.filter(arrContactEntries, function(oEntry){
		return oEntry.gd$phoneNumber !== undefined && oEntry.gd$email !== undefined;
	});
	let contactsComplier = _.template(sContactTemplate);
	let sContactHTML = contactsComplier({ contacts: usefulContacts});
	return sContactHTML;
}

let AccessToken = "";
let oUserContacts = {};
let oUserDetails = {};

var pGetAccessTokenFromStorage = new Promise(function (resolve, reject) {
	var AccessToken = true;
	chrome.storage.sync.get(['AccessToken','userInfo'], 
		function(result) {
		AccessToken = result.AccessToken;
		oUserDetails = result.userInfo;
		resolve(AccessToken);
	});
});
pGetAccessTokenFromStorage.then(function (AccessToken) {
	// fetch('https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=' + AccessToken)
	// .then((resp) => resp.json()) // Transform the data into json
	// .then(function(data) {
	// 	// Create and append the li's to the ul
	// 	console.log(data);
	// 	})
	var x = new XMLHttpRequest();
	x.open('GET', 'https://www.google.com/m8/feeds/contacts/default/full?max-results=100&alt=json&access_token=' + AccessToken);
	x.onload = function() {
		window.AccessToken = AccessToken;
		oUserContacts = x.response;
	};
	x.send();

	var y = new XMLHttpRequest();
    y.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + AccessToken);
    y.onload = function() {
		oUserDetails = y.response;
    };
    y.send();
});

let inboxSDK = {};
let currentContact = {contactName:"", contactEmail:""};
let drawerView ={};
let bIsCustomEvent =false;
InboxSDK.load('2', 'sdk_TirthGajjarSH_bc8c22641a').then(function(sdk){	
	inboxSDK = sdk;
	sdk.Toolbars.addToolbarButtonForApp(
		{
			title:"",
			titleClass:"AppTitle",
			iconUrl:"https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365",
			iconClass:"AppIcon",
			onClick:function(event){
				event.dropdown.close();
				let redDiv = "";
				let contactsDrawerViewOptions =  {
					el:generateProfileSection(),
					chrome:true,
					title:"Contacts"
				};
				drawerView = sdk.Widgets.showDrawerView(contactsDrawerViewOptions);
				var userSelection = document.getElementsByClassName('contactEmail');

				for(let i = 0; i < userSelection.length; i++) {
					userSelection[i].addEventListener("click", function() {
						currentContact.contactName = this.getAttribute("data-name");
						currentContact.contactEmail = this.getAttribute("data-email");
						bIsCustomEvent = true;
						inboxSDK.Compose.openNewComposeView();
						drawerView.close();
					});
				}
			},
			arrowColor:"red"
		}
	);

	sdk.Compose.registerComposeViewHandler(function(composeView){
		if(bIsCustomEvent){
			composeView.setToRecipients([currentContact.contactEmail]);
			let userSignature = composeView.getHTMLContent();
			let newBodyContent = "<p>Hello "+ currentContact.contactName +"</p>" + userSignature;
			composeView.setBodyHTML(newBodyContent);
			bIsCustomEvent = false;
		}
		composeView.on('sent', function(eventDetails){
			eventDetails.getMessageID().then(function(messageId){
				console.log(messageId);
			})
		});		
	});
});