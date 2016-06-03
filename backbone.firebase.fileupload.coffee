class FileUploadView extends Backbone.View
  initialize:(@opts) =>
    @storageRef = @opts.storage.ref();
    @onChangeURL=@opts.onChangeURL if @opts.onChangeURL
    @render()

  template:
    '
      <div class="container">
        <div class="wrapper">
          <div class="input">
      		<input type="file" name="files[]" id="file-input" class="box__file" data-multiple-caption="{count} files selected" multiple="">
          <label for="file-input">
          <svg class="icon" fill="#000000" height="30" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3.2"/>
              <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
          </svg>
          </label>
          </div>
          <div class="message">
            <div class="s">0%</div>
            <div class="bar"><div class="inner-bar">&nbsp;</div>
          </div>
        </div>
  		</div>
    '
  onStartUpload:()=>
    @$(".message").css(display:"flex")
    @$(".input").hide()

  onProgress:(progress)=>
    progress=progress+"%"
    @$(".message .s").html(progress)
    @$(".inner-bar").css(width: progress)

  onDone:(url)=>
    @$el.css(
      "background-image","url("+url+")"
    )
    @$(".message").hide()
    @$(".input").css(display:"flex")

  onChangeURL:(url)=>
    console.log("implement onChangeURL to get downloadURL")

  upload:(files)=>
    _.each(files, (file)=>
      folder=@opts.folder
      uploadTask = @storageRef.child(folder + "/" + file.name).put(file);
      @onStartUpload()
      #Start uploadTask
      uploadTask.on('state_changed', (snapshot)=>
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        @onProgress(progress)
      , (error)=>
        alert("error")
      , ()=>
        downloadURL = uploadTask.snapshot.downloadURL
        @onDone(downloadURL);
        @onChangeURL(downloadURL)
      )
    )

  handleDrop:()=>
    droppedFiles = false;
    @$("input").on("change", (e)=>
      files=@$("input")[0].files
      console.log(files)
      @upload(files)
    )
    @$el.on('drag dragstart dragend dragover dragenter dragleave drop', (e)=>
      e.preventDefault();
      e.stopPropagation();
    )
    @$el.on('dragover dragenter', ()=>
      console.log("dragover");
      @$el.addClass('dragover')
    )
    @$el.on('dragleave dragend drop', ()=>
      console.log("not dragover")
      @$el.removeClass('dragover')
    )
    @$el.on('drop', (e)=>
      files = e.originalEvent.dataTransfer.files
      console.log("files", files)
      @upload(files)
    )

  render:()=>
    @$el.html(_.template(@template))
    @$el.addClass("file-upload")
    @handleDrop()
