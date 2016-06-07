# Backbone Firebase FileUpload

Easily integrate Firebase 3 Storage in Backbone.View

## Usage

Download and include backbone.firebase.fileupload.js after Backbone. Import Firebase

    <script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>

And initialize the firebase object.

    config = {
      apiKey: "YOUR-API-KEY",
      authDomain: "YOUR-URL.firebaseapp.com",
      storageBucket: "YOUR-URL.firebaseapp.com",
    };
    window.firebase.initializeApp(config);
    var storage = firebase.storage();

Then, add the view as in the index.html example:

    var view=new FileUploadView({
      el:$("#file"),
      storage: storage,
      folder: "fileupload",
    });
    view.on("files-uploaded", function(fileURL){
      
    })


## TODO
Here are some things that are not currently implemented:
  - change the template;
  - remove dependency from jQuery;
  - add more events functions (as onDrop, onProgress)
  - resize the image directly from js;
