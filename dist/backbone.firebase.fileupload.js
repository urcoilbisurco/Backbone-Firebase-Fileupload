"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileUploadView = function (_Backbone$View) {
  _inherits(FileUploadView, _Backbone$View);

  function FileUploadView() {
    _classCallCheck(this, FileUploadView);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FileUploadView).apply(this, arguments));
  }

  _createClass(FileUploadView, [{
    key: "initialize",
    value: function initialize(opts) {
      this.opts = opts;
      this.storageRef = this.opts.storage.ref();
      this.render();
    }
  }, {
    key: "template",
    value: function template() {
      return "\n      <div class=\"container\">\n        <div class=\"wrapper\">\n          <div class=\"input\">\n      \t\t<input type=\"file\" id=\"file-input\">\n          <label for=\"file-input\">\n          <svg class=\"icon\" fill=\"#000000\" height=\"30\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\n              <circle cx=\"12\" cy=\"12\" r=\"3.2\"/>\n              <path d=\"M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z\"/>\n              <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n          </svg>\n          </label>\n          </div>\n          <div class=\"message\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"32\" height=\"32\" fill=\"white\">\n              <path transform=\"translate(0 0)\" d=\"M0 12 V20 H4 V12z\">\n                <animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0; 28 0; 0 0; 0 0\" dur=\"1.5s\" begin=\"0\" repeatCount=\"indefinite\" keytimes=\"0;0.3;0.6;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8\" calcMode=\"spline\" />\n              </path>\n              <path opacity=\"0.5\" transform=\"translate(0 0)\" d=\"M0 12 V20 H4 V12z\">\n                <animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0; 28 0; 0 0; 0 0\" dur=\"1.5s\" begin=\"0.1s\" repeatCount=\"indefinite\" keytimes=\"0;0.3;0.6;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8\" calcMode=\"spline\" />\n              </path>\n              <path opacity=\"0.25\" transform=\"translate(0 0)\" d=\"M0 12 V20 H4 V12z\">\n                <animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 0; 28 0; 0 0; 0 0\" dur=\"1.5s\" begin=\"0.2s\" repeatCount=\"indefinite\" keytimes=\"0;0.3;0.6;1\" keySplines=\"0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8\" calcMode=\"spline\" />\n              </path>\n            </svg>\n          </div>\n        </div>\n  \t\t</div>\n    ";
    }
  }, {
    key: "onStartUpload",
    value: function onStartUpload() {
      this.$(".message").css({ display: "flex" });
      this.$(".input").hide();
    }

    // onProgress (progress) {
    //   this.trigger("onProgress", progress)
    //   progress=progress+"%"
    //   // this.$(".message .s").html(progress)
    //   // this.$(".inner-bar").css({width: progress})
    // }

  }, {
    key: "onDone",
    value: function onDone(file) {
      var _this2 = this;

      //load the image
      var img = new Image();
      img.onload = function () {
        _this2.$el.css({
          "background-image": "url(" + file.url + ")"
        });
        _this2.$(".message").hide();
        _this2.$(".input").css({ display: "flex" });
      };
      img.src = file.url;
    }
  }, {
    key: "isImage",
    value: function isImage(file) {
      if (this.opts.image) {
        if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
          alert('not an image');
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(file, version_name) {
      var _this3 = this;

      var folder = this.opts.folder;
      var uploadTask = this.storageRef.child(folder + "/" + file.name).put(file);
      this.onStartUpload();
      //Start uploadTask
      uploadTask.on('state_changed', function (snapshot) {
        var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        //this.onProgress(progress)
      }, function (error) {
        alert("error");
      }, function () {
        var downloadURL = uploadTask.snapshot.downloadURL;
        _this3.fileUploadedCB(downloadURL, version_name);
      });
    }
  }, {
    key: "fileUploadedCB",
    value: function fileUploadedCB(fileUrl, version) {
      this.completed_files.push({ url: fileUrl, version: version });
      if (this.completed_files.length == this.number_of_files) {
        this.onDone(this.completed_files[0]);
        this.trigger("files-uploaded", this.completed_files);
      }
    }
  }, {
    key: "upload",
    value: function upload(file) {
      var _this4 = this;

      this.completed_files = [];
      this.number_of_files = 1;
      if (this.isImage(file)) {
        if (this.opts.resize) {
          this.number_of_files = this.opts.resize.length;
          //for each image version, create a canvas, resize and upload.
          _.each(this.opts.resize, function (version) {
            _this4.resizeAndUpload(file, version);
          });
        }
      } else {
        //just upload the file
        this.uploadFile(file, "original");
      }
    }
  }, {
    key: "handleDrop",
    value: function handleDrop() {
      var _this5 = this;

      this.$("input").on("change", function (e) {
        var file = _this5.$("input")[0].files[0];
        _this5.upload(file);
      });
      this.$el.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
      this.$el.on('dragover dragenter', function () {
        _this5.$el.addClass('dragover');
      });
      this.$el.on('dragleave dragend drop', function () {
        _this5.$el.removeClass('dragover');
      });
      this.$el.on('drop', function (e) {
        var file = e.originalEvent.dataTransfer.files[0];
        _this5.upload(file);
      });
    }
  }, {
    key: "render",
    value: function render() {
      this.$el.html(_.template(this.template()));
      this.$el.addClass("file-upload");
      this.handleDrop();
    }
  }, {
    key: "resizeAndUpload",
    value: function resizeAndUpload(file, version) {
      var _this6 = this;

      var MAX_HEIGHT = version.height;
      var image = new Image();
      var reader = new FileReader();
      var canvas = document.createElement("canvas");
      this.$el.append(canvas);
      image.onload = function () {
        if (image.height > MAX_HEIGHT) {
          image.width *= MAX_HEIGHT / image.height;
          image.height = MAX_HEIGHT;
        }
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        var resizedFile = _this6._canvasToFile(file, version, canvas);
        //finally I have the file. Upload it!
        _this6.uploadFile(resizedFile, version.version);
      };
      reader.onload = function (e) {
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, {
    key: "_filename",
    value: function _filename(file, version) {

      return "" + new Date().getTime() + "_" + version.version + "." + file.name.split(".").pop();
    }
  }, {
    key: "_canvasToFile",
    value: function _canvasToFile(file, version, canvas) {
      var dataURI = canvas.toDataURL("image/png");
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);else byteString = unescape(dataURI.split(',')[1]);
      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: mimeString });
      return new File([blob], this._filename(file, version));
    }
  }]);

  return FileUploadView;
}(Backbone.View);