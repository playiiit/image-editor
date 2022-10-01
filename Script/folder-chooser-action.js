/*
* Component: Uploader
*
* This function is used to upload component files.
* After the choose file uploaded component will set to the component selector and to the preview area as the image.
*
* */


const fs = require('fs');
const path = require('path');
const {ipcRenderer} = require("electron");
const ipc = ipcRenderer;

import {setUnSaveState} from "./Functions/set-save-state.js";
import {checkPossibleNFTCount} from "./Functions/check-possible-nft-count.js";
import {loadLayers} from './load-layers.js';


const text_fields = ByQueryAll(".text-field-file-chooser");

export async function folderChooser(OBJECT) {
    let data;

    // Check the object are empty
    if (OBJECT.length === 0) {
        // if empty open the file chooser
        data = await ipc.sendSync("open-output-dialog", {data: true});
    } else {
        // if not empty assign object to data variable
        data = OBJECT[0];
    }

    if (data.state) {
        // Get user selected folder path
        const selected_path = data.pathGet[0];

        /*
        * Check the uploader element is a resources uploader
        * if it is a resources uploader, then check the folder count with selector component count
        * */
        if (text_fields[0].id === "resources_file_path") {
            // const folder_count = checkFolderCount(path.dirname(files[0].path));
            // console.log(folder_count + " " + uploaded_component.childElementCount);

            if (true) {
                // Load Layers to the layers box
                await loadLayers(selected_path);
                // Check the possible NFT count
                const final_nft_count = checkPossibleNFTCount(selected_path);

                final_nft_count.then(async (result) => {
                    // Set the filename to Text Field
                    ByID("resources_file_path").value = selected_path;
                    // Display View Layers Button
                    ByID("view_layer").style.display = "block";

                    // Set UnSave State
                    setUnSaveState();
                    // Set Final Value to the message box (<span>)
                    ByID('possible-nft-count-message').style.display = "block";
                    ByID('possible-nft-count').innerText = result.length;

                    // Enable preview Button
                    ByID("preview_button").disabled = false;
                    ByID("preview_button").classList.add("preview-button-preview-enabled");
                }).catch((error) => {
                    Message(error, 0);
                });
            }
        }
        /*
        * console.log(path.dirname(files[0].path));
        * path.basename(path.dirname(files[0].path));
        */
    }
    // Clear the resources/output path selector value
}


// Select Output Folder Path
ByID("output_file_path_uploader").addEventListener("click", async (e) => {
    const data = await ipc.sendSync("open-output-dialog", {data: true});
    if (data.state) {
        text_fields[1].value = data.pathGet[0];
        setUnSaveState();
    } else {
        // Message(data.error, 0);
        // console.log(data.error);
    }
});


// const theFiles = e.target.files;
// const files = theFiles;
//
// const relativePath = theFiles[0].webkitRelativePath;
// const folder = relativePath.split("/");
//
//
// fs.readdirSync(path.dirname(path.dirname(files[0].path))).map((file) => {
//     const file_path = path.dirname(path.dirname(files[0].path)) + "\\" + file;
//
//     if (fs.lstatSync(file_path).isFile()) {
//         // Message("Invalid", 0);
//     }
// });
