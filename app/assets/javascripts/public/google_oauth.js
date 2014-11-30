var GoogleAuth = {}

  GoogleAuth.Keys = {
    client_id: '340894032158-a7ro9gvu0cm86sotbepj9pei5sgi1nk9.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/yt-analytics.readonly']
  }

  GoogleAuth.View = {}


  GoogleAuth.Controller = {
    receiveMessage: function(event){
      if (event.origin !== "https://accounts.google.com") return;
    },

    checkAuth: function() {
      gapi.auth.authorize({
        client_id: GoogleAuth.Keys.client_id,
        scope: GoogleAuth.Keys.scopes,
        immediate: false },
        GoogleAuth.Controller.handleAuthResult);
    },


  // Handle the result of a gapi.auth.authorize() call.
    handleAuthResult: function(authResult) {
      if (authResult) {
        // Auth was successful. Hide auth prompts and show things
        // that should be visible after auth succeeds.
        GoogleAuth.View.authSuccess();
        console.log(authResult);
        $('#menu-toggle').fadeOut('fast');
        setTimeout(LoadBar.Controller.go, 1000);

        // return LoadBar.Controller.doProgress(function() {
        //   return LoadBar.Controller.setProgressBarWidth("0");
        // });


        // GoogleAuth.Controller.loadAPIClientInterfaces();

        var token = authResult.access_token;
        console.log(token)

      $.ajax({
        type:"POST",
        url: "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token,
        dataType:'JSON'
      }).done(function(data){
        // Use to send auth data to elsewhere
        console.log(data);
      });



    } else {
      // Auth was unsuccessful. Show things related to prompting for auth
      // and hide the things that should be visible after auth succeeds.
      GoogleAuth.View.authFail();

      // Make the #login-link clickable. Attempt a non-immediate OAuth 2 client
      // flow. The current function will be called when that flow completes.
      $('#login-link').click(function() {
        gapi.auth.authorize({
          client_id: GoogleAuth.Keys.client_id,
          scope: GoogleAuth.Keys.scopes,
          immediate: false
          }, GoogleAuth.Controller.handleAuthResult);
        });
      }
    }

  }

  // Helper method to display a message on the page.
  GoogleAuth.View = {
    authSuccess: function(){
      $('.pre-auth').hide();
      $('.post-auth').show();
    },

    authFail: function(){
      $('.post-auth').hide();
      $('.pre-auth').show();
    },

    displayMessage: function(message) {
      $('#message').text(message).show();
    },

  // Helper method to hide a previously displayed message on the page.
    hideMessage: function() {
      $('#message').hide();
    }
}

$(document).ready(function(){
      $(".modal-btn").on("click","a", function(event){
          event.preventDefault();
          $("#dream-modal").hide();
          gapi.auth.init(function() {
            window.setTimeout(GoogleAuth.Controller.checkAuth, 1);
            //
        });
      });
    });
  /* In later steps, add additional functions above this line. */

GoogleAuth.Controller.loadAPIClientInterfaces = function() {
  gapi.client.load('youtube', 'v3', function() {
    gapi.client.load('youtubeAnalytics', 'v1', function() {
      // After both client interfaces load, use the Data API to request
      // information about the authenticated user's channel.
      YouTubeData.Account.getUserChannel();
      // $('#dreams-select').addClass('open');

    });
  });
}










