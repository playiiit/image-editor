const { ipcRenderer } = require("electron");
const path = require("path");
const ipc = ipcRenderer;
const PowerShell = require("powershell");
const Jimp = require("jimp");
const sizeOf = require("image-size");

const aspect = require("aspectratio");
const ratio = require("aspect-ratio");

let files = "";
let choosePath = "";
let currentFileDimension = { width: 0, height: 0 };

/*
 * Drag and Drop Upload Image
 */
const dropContainer = ByID("resources_file_path_uploader_drop_container");
const uploader_com = ByID("resources_file_path_uploader_label");

dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
  evt.preventDefault();
  dropContainer.style.border = "1.5px dashed var(--highlightBorder)";
};

dropContainer.ondragleave = function (evt) {
  evt.preventDefault();
  dropContainer.style.border = "1.5px dashed var(--border)";
};

/*
 * Ondrop Listener
 */
dropContainer.ondrop = function (evt) {
  evt.preventDefault();
  // Change the Drop Container Border Color
  dropContainer.style.border = "1.5px dashed var(--border)";

  setImage(evt.dataTransfer.files);
};

/**
 *  Upload File
 */
ByID("resources_file_path").addEventListener("change", async (e) => {
  const theFiles = e.target.files;
  files = theFiles;
  setImage(theFiles);
});

function setImage(files) {
  ByID("preview-area-set").innerHTML = "";
  const dimensions = sizeOf(files[0].path);

  ByID("file_dimension_width").value = dimensions.width;
  ByID("file_dimension_height").value = dimensions.height;
  // Remove special characters from file name
  let removedChar = path
    .basename(files[0].name, path.extname(files[0].name))
    .replace(/[()]/g, "_");
  ByID("file_name").value = removedChar.replace(/\s/g, "_");

  currentFileDimension = { width: dimensions.width, height: dimensions.height };

  currentFileDimension = ByID("preview-area-set").appendChild(
    getImageObject(files[0])
  );
}

/**
 * Get Process Image
 *
 * @param {*} file
 * @returns
 */
function getImageObject(file) {
  const image = createEle("img"); // Create Image Element
  // Set Styles to Created Image
  image.style.width = "100%";
  image.style.height = "auto";

  image.src = URL.createObjectURL(file);
  image.onload = function () {
    URL.revokeObjectURL(image.src);
  };

  return image;
}

/**
 * Output folder chooser
 */
ByID("output_file_path_uploader").addEventListener("click", async (e) => {
  try {
    let data = await ipc.sendSync("open-output-dialog", { data: true });
    ByID("output_file_path").value = data.pathGet[0];
    choosePath = data.pathGet[0];
  } catch (error) {
    console.log(error);
  }
});

/**
 * When click on save button path.basename(data[0].name, path.extname(data[0].name))
 */
ByID("generate_button").addEventListener("click", async (e) => {
  if (choosePath != "") {
    // Disable button
    ByID("generate_button").disabled = true;

    const fileExt = ByID("file_ext").value;
    const fileWidth = parseInt(ByID("file_dimension_width").value);
    const fileHeight = parseInt(ByID("file_dimension_height").value);
    const fileName = ByID("file_name").value;
    const fileQuality = ByID("rangevalue").value;

    // Check If file Select or Not
    if (files != "") {
      AddLoader("generate-button-txt");
      if (fileExt == ".webp") {
        // Execute Jimp
        const tempPath = await executeJimp(
          files,
          ".jpeg",
          { width: fileWidth, height: fileHeight },
          __dirname + "\\Temp\\Files",
          fileName,
          fileQuality
        );

        // Check if any error
        if (tempPath.error == null) {
          let ps = new PowerShell(
            await getWebpCommand(files, tempPath.path, fileName, fileQuality)
          );

          console.log(ps);

          ps.on("end", (code) => {
            console.log(code);

            Message("File Successfully Saved", 1);
            RemoveLoader("generate-button-txt", "Save File");
            ByID("generate_button").disabled = false;
          });
          ps.on("error", (err) => {
            console.log(err);

            Message(err, 0);
            RemoveLoader("generate-button-txt", "Save File");
            ByID("generate_button").disabled = false;
          });
        }
      } else {
        const returnData = executeJimp(
          files,
          fileExt,
          { width: fileWidth, height: fileHeight },
          choosePath,
          fileName,
          fileQuality
        );
        if (returnData.error) {
          console.log(returnData.error);
          Message(returnData.error, 0);
          ByID("generate_button").disabled = false;
        } else {
          Message("File Successfully Saved", 1);
          RemoveLoader("generate-button-txt", "Save File");
          ByID("generate_button").disabled = false;
        }
      }
    }
  } else {
    try {
      ByID("generate_button").disabled = true;
      let data = await ipc.sendSync("open-output-dialog", { data: true });
      ByID("output_file_path").value = data.pathGet[0];
      choosePath = data.pathGet[0];
    } catch (error) {
      console.log(error);
    }
    ByID("generate_button").disabled = false;
  }
});

/**
 * Get Webp command
 *
 * @param {*} data
 * @returns
 */
function getWebpCommand(data, filePath, fileName, fileQuality) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        "cd C:\\Users\\TigEr_MP\\image-editor-new\\image-editor\\Webp; " +
          "cwebp -q " +
          fileQuality +
          " " +
          filePath +
          " -o " +
          choosePath +
          "\\" +
          fileName +
          ".webp"
      );
    }, 0);
  });
}

/**
 * Execute Jimp Query
 *
 * @param {*} data
 * @param {*} fileExtension
 * @param {*} dimension
 * @param {*} dirPath
 * @returns
 */
async function executeJimp(
  data,
  fileExtension,
  dimension,
  dirPath,
  fileName,
  fileQuality
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Jimp.read(data[0].path, (err, image) => {
        if (err) reject({ error: err, path: null });
        image
          .resize(dimension.width, dimension.height) // resize
          .quality(parseInt(fileQuality)) // set JPEG quality
          .write(dirPath + "\\" + fileName + fileExtension); // save
        resolve({
          error: null,
          path: dirPath + "\\" + fileName + fileExtension,
        });
      });
    }, 0);
  });
}

/**
 * Automatic Sacle Fields
 */
ByID("file_dimension_width").addEventListener("keyup", async (e) => {
  automaticScale("width", e);
});

ByID("file_dimension_height").addEventListener("keyup", async (e) => {
  automaticScale("height", e);
});

function automaticScale(value, event) {
  if (ByID("check_mautomatic_scale").checked) {
    // Width Changing
    if (currentFileDimension.width != 0 && value == "width") {
      const ratioCollect = ratio(
        currentFileDimension.height,
        currentFileDimension.width
      );
      console.log(ratioCollect);
      var crop = aspect.crop(
        event.target.value,
        event.target.value,
        ratioCollect
      );
      ByID("file_dimension_height").value = parseInt(crop[3]);
    }
    // Height Changing
    if (currentFileDimension.height != 0 && value == "height") {
      const ratioCollect = ratio(
        currentFileDimension.width,
        currentFileDimension.height
      );
      var crop = aspect.crop(
        currentFileDimension.width,
        event.target.value,
        ratioCollect
      );
      ByID("file_dimension_width").value = parseInt(crop[2]);
    }
  }
}

// Listen for messages
ipcRenderer.on("message", function (event, text) {
  console.log("Message from updater:", text);
  console.log(event);
});
