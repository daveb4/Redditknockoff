// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBzJsuGWLdYH5Wt9XcTb-Vgkz_5-bRP6z8",
    authDomain: "seddit-e3b74.firebaseapp.com",
    databaseURL: "https://seddit-e3b74.firebaseio.com",
    projectId: "seddit-e3b74",
    storageBucket: "seddit-e3b74.appspot.com",
    messagingSenderId: "923099618454",
    appId: "1:923099618454:web:82bde24d94968a889cf6b7"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

//if (window.location.pathname[1,5] != "posts"){
//console.log("not posts");
var currentUser;
var provider = new firebase.auth.GoogleAuthProvider();
var posts = firebase.database().ref('posts/');
posts.once("value").then(function(snapshot) {
snapshot.forEach(function(childSnapshot) {
	var key = childSnapshot.key;
	var childData = childSnapshot.val();
	var image = childSnapshot.val().image;
	var imageinsert = "<img src='" + image + "' height=\"200\" width=\"200\"/>";
	var subr = childSnapshot.val().subredddit;
	var title = childSnapshot.val().title;
	var text = childSnapshot.val().text;
	var votes = childSnapshot.val().votes;
	var table = document.getElementById("posts");
	var row = table.insertRow(0);
	var votedata = firebase.database().ref("posts/" + key + "/votes");
	var link = key.link(window.location.href + "posts/" + key);
//	var upvoteb = "<button onclick = alert(\"hello\")>Upvote</button><br>";
//	var downvoteb = "<br><button onclick = \"downvote()\">Downvote</button>";
	var cell0 = row.insertCell(0);
	var cell1 = row.insertCell(1);
	var cell2 = row.insertCell(2);
	var cell3 = row.insertCell(3);
//	cell0.innerHTML = upvoteb + votes + downvoteb;
	cell0.innerHTML = "Votes: " + votes;
	cell1.innerHTML = link;
	cell2.innerHTML = childData.title;
	cell3.innerHTML = imageinsert;
	
	});
});
//}
if (window.location.pathname[1,6] == "posts/"){
	document.getElementById("welcome").innerHTML = "hi";
}
//document.getElementById("check2").innerHTML = window.location.href;
//console.log(window.location.pathname);



function createpost() {
	var title = prompt("Enter your title");
	var content = prompt("Enter your text");
	var image = prompt("Include your image URL");
	var users = firebase.database().ref('users/');
        users.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
		var key = childSnapshot.key;
		if (key == null || key == ""){
			alert("Please log in.");
		}
		else {
			if (title == null){
				alert("Please provide a title");
			}
			else {
				firebase.database().ref('posts/' + title).set({
					title: title,
                        		text: content,
                        		image: image,
					votes: 0
                        	});
			}
		}
	})});
}

function googleSignin() {
    
   firebase.auth()
   
   .signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      var currentUser = user;
      //document.getElementById("welcome").innerHTML += ", " + user.displayName;
		
      console.log(token)
      console.log(user)
   }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
		
      console.log(error.code)
      console.log(error.message)
   });
}
    /*
    firebase.auth().signInWithRedirect(provider);
    console.log("successful signin");
    
}
*/
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    //var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    console.log("The signin was successful");
    document.getElementById("welcome").innerHTML = "Welcome to Redddit, " + user.displayName;
    writeUserData(uid, displayName, email);
    document.getElementById("signin").style.display="none";
    document.getElementById("signout").style.display="initial";
    document.getElementById("createsub").style.display="initial";
    // ...
  } else {
    // User is signed out.
    // ...
  }
});

function googleSignout() {
   firebase.auth().signOut()
	
   .then(function() {
      currentUser = "";
      document.getElementById("welcome").innerHTML = "";
      document.getElementById("signin").style.display="initial";
      document.getElementById("signout").style.display="none";
      document.getElementById("createsub").style.display="none";
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}

function writeUserData(userId, name, email) { // , imageUrl) {
	/*
	if (imageUrl == null) {
		imageUrl = "https://i.ytimg.com/vi/zN65Dg8GyhM/maxresdefault.jpg"
	}
	*/
	var admins = firebase.database().ref('admins/');
	//let isadmin;
	admins.once("value").then(function(snapshot) {
	snapshot.forEach(function(childSnapshot) {
        	var key = childSnapshot.key;
		var val = childSnapshot.val();
		if (key == userId) {
			//isadmin = true;
			firebase.database().ref('users/' + userId).set({
                	username: name,
                	email: email,
                	is_admin: true
                	//profile_picture : imageUrl
        		});

//			document.getElementById("check3").innerHTML = isadmin;
		}
		else {
			firebase.database().ref('users/' + userId).set({
                        username: name,
                        email: email,
                        is_admin: false
                        //profile_picture : imageUrl
                        });
		}
	});
	})
//	document.getElementById("check3").innerHTML = isadmin;
//	document.getElementById("check3").innerHTML = isadmin;
//	firebase.database().ref('users/' + userId).set({
//		username: name,
//		email: email,
//		is_admin: isadmin
		//profile_picture : imageUrl
//	});
//	console.log("Data added");
}

