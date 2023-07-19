const uploader = document.querySelector(".uploader");
const fileinput = document.querySelector(".uploader input");
const widthinput = document.querySelector(".width input");
const heightinput = document.querySelector(".height input");
const ratioinput = document.querySelector(".ratio input");
const qualityinput = document.querySelector(".quality input");
const downloadbtn = document.querySelector(".downbtn");

let ogratio;

const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const loadfile = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  loadImage(file)
    .then((img) => {
      widthinput.value = img.naturalWidth;
      heightinput.value = img.naturalHeight;
      ogratio = img.naturalWidth / img.naturalHeight;
    })
    .catch((error) => {
      console.error("Error loading image:", error);
    });
};

widthinput.addEventListener("input", () => {
  const height = ratioinput.checked ? widthinput.value / ogratio : heightinput.value;
  heightinput.value = Math.floor(height);
});

heightinput.addEventListener("input", () => {
  const width = ratioinput.checked ? heightinput.value * ogratio : widthinput.value;
  widthinput.value = Math.floor(width);
});

const resizeanddownload = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const imgQuality = qualityinput.checked ? 0.7 : 1.0;

  loadImage(fileinput.files[0])
    .then((img) => {
      canvas.width = widthinput.value;
      canvas.height = heightinput.value;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/jpeg", imgQuality);
      a.download = new Date().getTime();
      a.click();
    })
    .catch((error) => {
      console.error("Error loading image:", error);
    });
};

fileinput.addEventListener("change", loadfile);
downloadbtn.addEventListener("click", resizeanddownload);
