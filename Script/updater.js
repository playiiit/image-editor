const uaup = require("uaup-js");

try {
  const defaultStages = {
    Checking: "Checking For Updates...", // When Checking For Updates.
    Found: "Update Found", // If an Update is Found.
    NotFound: "No Update Found", // If an Update is Not Found.
    Downloading: "Downloading", // When Downloading Update.
    Unzipping: "Installing", // When Unzipping the Archive into the Application Directory.
    Cleaning: "Finalizing", // When Removing Temp Directories and Files (ex: update archive and tmp directory).
    Launch: "Starting", // When Launching the Application.
  };

  const updateOptions = {
    gitRepo: "image-editor", // [Required] Your Repo Name
    gitUsername: "playiiit", // [Required] Your GitHub Username.
    isGitRepoPrivate: false,

    appName: "image-editor", //[Required] The Name of the app archive and the app folder.
    appExecutableName: "ImageEditor.exe", //[Required] The Executable of the Application to be Run after updating.

    progressBar: document.getElementById("updater-progress"), // {Default is null} [Optional] If Using Electron with a HTML Progressbar, use that element here, otherwise ignore
    label: document.getElementById("state-label"), // {Default is null} [Optional] If Using Electron, this will be the area where we put status updates using InnerHTML
    stageTitles: defaultStages, // {Default is defaultStages} [Optional] Sets the Status Title for Each Stage
  };

  let isUpdateAvalible = await uaup.CheckForUpdates(updateOptions);
  // uaup.Update(updateOptions);

  if (isUpdateAvalible) {
    document.getElementById("updater-progress").style.display = "block";
    document.getElementById("updater-loading").style.display = "none";
    document.getElementById("state-label-box").style.textAlign = "center";
  } else {
    document.getElementById("updater-progress").style.display = "none";
    document.getElementById("updater-loading").style.display = "block";
    document.getElementById("state-label-box").style.textAlign = "left";
  }
} catch (error) {
  console.log(error);
}
