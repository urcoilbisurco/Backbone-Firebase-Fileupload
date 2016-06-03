var FileUploadView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

FileUploadView = (function(superClass) {
  extend(FileUploadView, superClass);

  function FileUploadView() {
    this.render = bind(this.render, this);
    this.handleDrop = bind(this.handleDrop, this);
    this.upload = bind(this.upload, this);
    this.onChangeURL = bind(this.onChangeURL, this);
    this.onDone = bind(this.onDone, this);
    this.onProgress = bind(this.onProgress, this);
    this.onStartUpload = bind(this.onStartUpload, this);
    this.initialize = bind(this.initialize, this);
    return FileUploadView.__super__.constructor.apply(this, arguments);
  }

  FileUploadView.prototype.initialize = function(opts) {
    this.opts = opts;
    this.storageRef = this.opts.storage.ref();
    if (this.opts.onChangeURL) {
      this.onChangeURL = this.opts.onChangeURL;
    }
    return this.render();
  };

  FileUploadView.prototype.template = '<div class="container"> <div class="wrapper"> <div class="input"> <input type="file" name="files[]" id="file-input" class="box__file" data-multiple-caption="{count} files selected" multiple=""> <label for="file-input"> <svg class="icon" fill="#000000" height="30" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="3.2"/> <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/> <path d="M0 0h24v24H0z" fill="none"/> </svg> </label> </div> <div class="message"> <div class="s">0%</div> <div class="bar"><div class="inner-bar">&nbsp;</div> </div> </div> </div>';

  FileUploadView.prototype.onStartUpload = function() {
    this.$(".message").css({
      display: "flex"
    });
    return this.$(".input").hide();
  };

  FileUploadView.prototype.onProgress = function(progress) {
    progress = progress + "%";
    this.$(".message .s").html(progress);
    return this.$(".inner-bar").css({
      width: progress
    });
  };

  FileUploadView.prototype.onDone = function(url) {
    this.$el.css("background-image", "url(" + url + ")");
    this.$(".message").hide();
    return this.$(".input").css({
      display: "flex"
    });
  };

  FileUploadView.prototype.onChangeURL = function(url) {
    return console.log("implement onChangeURL to get downloadURL");
  };

  FileUploadView.prototype.upload = function(files) {
    return _.each(files, (function(_this) {
      return function(file) {
        var folder, uploadTask;
        folder = _this.opts.folder;
        uploadTask = _this.storageRef.child(folder + "/" + file.name).put(file);
        _this.onStartUpload();
        return uploadTask.on('state_changed', function(snapshot) {
          var progress;
          progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          return _this.onProgress(progress);
        }, function(error) {
          return alert("error");
        }, function() {
          var downloadURL;
          downloadURL = uploadTask.snapshot.downloadURL;
          _this.onDone(downloadURL);
          return _this.onChangeURL(downloadURL);
        });
      };
    })(this));
  };

  FileUploadView.prototype.handleDrop = function() {
    var droppedFiles;
    droppedFiles = false;
    this.$("input").on("change", (function(_this) {
      return function(e) {
        var files;
        files = _this.$("input")[0].files;
        console.log(files);
        return _this.upload(files);
      };
    })(this));
    this.$el.on('drag dragstart dragend dragover dragenter dragleave drop', (function(_this) {
      return function(e) {
        e.preventDefault();
        return e.stopPropagation();
      };
    })(this));
    this.$el.on('dragover dragenter', (function(_this) {
      return function() {
        console.log("dragover");
        return _this.$el.addClass('dragover');
      };
    })(this));
    this.$el.on('dragleave dragend drop', (function(_this) {
      return function() {
        console.log("not dragover");
        return _this.$el.removeClass('dragover');
      };
    })(this));
    return this.$el.on('drop', (function(_this) {
      return function(e) {
        var files;
        files = e.originalEvent.dataTransfer.files;
        console.log("files", files);
        return _this.upload(files);
      };
    })(this));
  };

  FileUploadView.prototype.render = function() {
    this.$el.html(_.template(this.template));
    this.$el.addClass("file-upload");
    return this.handleDrop();
  };

  return FileUploadView;

})(Backbone.View);
