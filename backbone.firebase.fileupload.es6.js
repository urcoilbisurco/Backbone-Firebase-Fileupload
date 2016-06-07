class FileUploadView extends Backbone.View{
  initialize (opts) {
    this.opts=opts
    this.storageRef = this.opts.storage.ref();
    this.render();
  }

  template (){
    return `
      <div class="container">
        <div class="wrapper">
          <div class="input">
      		<input type="file" id="file-input">
          <label for="file-input">
          <svg class="icon" fill="#000000" height="30" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3.2"/>
              <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
          </label>
          </div>
          <div class="message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="white">
              <path transform="translate(0 0)" d="M0 12 V20 H4 V12z">
                <animateTransform attributeName="transform" type="translate" values="0 0; 28 0; 0 0; 0 0" dur="1.5s" begin="0" repeatCount="indefinite" keytimes="0;0.3;0.6;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
              </path>
              <path opacity="0.5" transform="translate(0 0)" d="M0 12 V20 H4 V12z">
                <animateTransform attributeName="transform" type="translate" values="0 0; 28 0; 0 0; 0 0" dur="1.5s" begin="0.1s" repeatCount="indefinite" keytimes="0;0.3;0.6;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
              </path>
              <path opacity="0.25" transform="translate(0 0)" d="M0 12 V20 H4 V12z">
                <animateTransform attributeName="transform" type="translate" values="0 0; 28 0; 0 0; 0 0" dur="1.5s" begin="0.2s" repeatCount="indefinite" keytimes="0;0.3;0.6;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
              </path>
            </svg>
          </div>
        </div>
  		</div>
    `;
  }

  onStartUpload () {
    this.$(".message").css({display:"flex"})
    this.$(".input").hide()
  }

  // onProgress (progress) {
  //   this.trigger("onProgress", progress)
  //   progress=progress+"%"
  //   // this.$(".message .s").html(progress)
  //   // this.$(".inner-bar").css({width: progress})
  // }


  onDone (file){
    //load the image
    const img = new Image();
    img.onload = ()=> {
      this.$el.css({
        "background-image":"url("+file.url+")"
      })
      this.$(".message").hide()
      this.$(".input").css({display:"flex"})
    }
    img.src = file.url;
  }

  isImage (file){
    if(this.opts.image){
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)){
        alert('not an image');
        return false
      }else{
        return true
      }
    }else{
      return true
    }
  }

  uploadFile(file, version_name){
    let folder=this.opts.folder
    let uploadTask = this.storageRef.child(folder + "/" + file.name).put(file);
    this.onStartUpload()
    //Start uploadTask
    uploadTask.on('state_changed', (snapshot)=> {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //this.onProgress(progress)
      },
      (error)=> {
        alert("error")
      },
      ()=> {
        let downloadURL = uploadTask.snapshot.downloadURL;
        this.fileUploadedCB(downloadURL, version_name)
      }
    )
  }

  fileUploadedCB (fileUrl, version) {
    this.completed_files.push({url:fileUrl, version:version})
    if(this.completed_files.length==this.number_of_files){
      this.onDone(this.completed_files[0]);
      this.trigger("files-uploaded", this.completed_files);
    }
  }

  upload (file) {
    this.completed_files=[];
    this.number_of_files=1;
    if(this.isImage(file)){
      if(this.opts.resize){
        this.number_of_files=this.opts.resize.length
        //for each image version, create a canvas, resize and upload.
        _.each(this.opts.resize, (version)=>{
          this.resizeAndUpload(file, version)
        })

      }
    }else {
      //just upload the file
      this.uploadFile(file, "original")
    }
  }

  handleDrop () {
    this.$("input").on("change", (e)=>{
      const file=this.$("input")[0].files[0]
      this.upload(file)
    })
    this.$el.on('drag dragstart dragend dragover dragenter dragleave drop', (e)=>{
      e.preventDefault();
      e.stopPropagation();
    })
    this.$el.on('dragover dragenter', ()=>{
      this.$el.addClass('dragover')
    })
    this.$el.on('dragleave dragend drop', ()=>{
      this.$el.removeClass('dragover')
    })
    this.$el.on('drop', (e)=>{
      const file = e.originalEvent.dataTransfer.files[0]
      this.upload(file)
    })
  }

  render (){
    this.$el.html(_.template(this.template()))
    this.$el.addClass("file-upload")
    this.handleDrop()
  }

  resizeAndUpload(file, version) {
    const MAX_HEIGHT = version.height;
    const image = new Image();
    const reader = new FileReader();
    const canvas=document.createElement("canvas")
    this.$el.append(canvas);
    image.onload = ()=>{
      if(image.height > MAX_HEIGHT) {
        image.width *= MAX_HEIGHT / image.height;
        image.height = MAX_HEIGHT;
      }
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const resizedFile=this._canvasToFile(file, version, canvas)
      //finally I have the file. Upload it!
      this.uploadFile(resizedFile, version.version)
    }
    reader.onload = (e)=>{
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  _filename (file, version){

    return ""+(new Date()).getTime()+"_"+version.version+"."+file.name.split(".").pop()
  }
  _canvasToFile (file, version, canvas) {
    var dataURI=canvas.toDataURL("image/png");
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob=new Blob([ia], {type:mimeString});
    return new File([blob], this._filename(file, version));
  }

}
