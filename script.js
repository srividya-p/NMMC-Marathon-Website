//import Cropper from 'cropperjs';
//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
    dragText = dropArea.querySelector("header"),
    button = dropArea.querySelector(".browse_button"),
    input = document.getElementById("mainimg");
let file; //this is a global variable and we'll use it inside multiple functions

let image;
let cropper;

let c;

zoomfunc = () => {
  zoomrange = document.getElementById("zoom");
  var value = (zoomrange.value-zoomrange.min)/(zoomrange.max-zoomrange.min)*100;
  zoomrange.style.background = 'linear-gradient(to right, #04AA6D 0%, #04AA6D ' + value + '%, #fff ' + value + '%, white 100%)';
  const containerData = cropper.getContainerData();
  cropper.zoomTo(zoomrange.value, {
    x: containerData.width / 2,
    y: containerData.height / 2,
  });
  cropper.setCropBoxData(c);
}

document.getElementById("zoom").oninput = function() {
  zoomfunc();
};

document.getElementById("rotation").oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100;
  this.style.background = 'linear-gradient(to right, #04AA6D 0%, #04AA6D ' + value + '%, #fff ' + value + '%, white 100%)';
  cropper.rotateTo(this.value);
  c = cropper.getCropBoxData();
};

button.onclick = () => {
    input.click(); //if user click on the button then the input also clicked
}

input.addEventListener("change", function() {
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = this.files[0];
    dropArea.classList.add("active");
    showFile(); //calling function
});


//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault(); //preventing from default behaviour
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
    event.preventDefault(); //preventing from default behaviour
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = event.dataTransfer.files[0];
    showFile(); //calling function
});

function showFile() {
    let fileType = file.type; //getting selected file type
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
    if (validExtensions.includes(fileType)) { //if user selected file is an image file
        let fileReader = new FileReader(); //creating new FileReader object
        fileReader.onload = () => {
            let fileURL = fileReader.result; //passing user file source in fileURL variable
            let imgTag = `<img src="${fileURL}" alt="image" id="imagedisp">`; //creating an img tag and passing user selected file source inside src attribute
            document.getElementById("dropimg").value = fileURL;
            dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
			image = document.getElementById("imagedisp");
			cropper = new Cropper(image, {
  aspectRatio: 4/3,
  viewMode: 1,
        dragMode: 'move',
        cropBoxMovable: false,
        movable: true,
        canvasMovable: false,
        cropBoxResizable: false,
        checkOrientation: false,
        autoCropArea:1,
        zoomable:true,
        rotatable:true,
        background: false,
        center: true,
        guides: true,
        highlight:true,
  crop(event) {
    console.log(event.detail.x);
    console.log(event.detail.y);
    console.log(event.detail.width);
    console.log(event.detail.height);
    console.log(event.detail.rotate);
    console.log(event.detail.scaleX);
    console.log(event.detail.scaleY);
  },

  rotate(event) {
    console.log(event.detail.x);
    console.log(event.detail.y);
  },
  zoom: function(event) {
    console.log(event.detail.originalEvent);
  if(event.detail.originalEvent.type=="wheel") {
    zoomrange = document.getElementById("zoom");
    if(event.detail.originalEvent.deltaY<0) {
      val = parseFloat(zoomrange.value);
      if((val<zoomrange.getAttribute("max")) && (val>=zoomrange.getAttribute("min")) )
      zoomrange.setAttribute('value',val+0.1);
    }
    else{
      val = parseFloat(zoomrange.value);
      if(val>zoomrange.getAttribute("min"))
      zoomrange.setAttribute('value',val-0.1);
    }
    zoomfunc();
    event.preventDefault();
  }
  }
});

image.addEventListener('ready', function () {
  //console.log(this.cropper === cropper);
  c = cropper.getCropBoxData(); 
  console.log(c); 
  imgdata = cropper.getImageData();
  ratio = imgdata.height / imgdata.naturalHeight;
  minratio = ratio.toFixed(1);
  maxratio = (ratio+1).toFixed(1);
  document.getElementById("zoom").setAttribute("min",minratio);
  document.getElementById("zoom").setAttribute("value",minratio);
  document.getElementById("zoom").setAttribute("max",maxratio);
});

        }
        fileReader.readAsDataURL(file);

        document.getElementById("convert_button").style.display = "block";
		document.querySelector(".sliders").style.display = "block";

    } else {
        alert("This is not an Image File!");
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
    }
}