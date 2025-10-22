// --- CONFIGURATION: GOOGLE APPS SCRIPT WEB APP ---
// This new, more reliable method uses a Google Apps Script Web App to create an API endpoint
// that your app can send data to directly. This avoids the fragile pre-filled link issues.

// --- ONE-TIME SETUP INSTRUCTIONS ---
// Please follow these steps carefully. This will take about 5 minutes.

/*
1.  **CREATE A GOOGLE SHEET:**
    - Go to https://sheets.new to create a new, blank Google Sheet.
    - Give it a name, for example: "Hemodialysis Feedback Responses".

2.  **OPEN THE SCRIPT EDITOR:**
    - In your new sheet, click on "Extensions" in the top menu, then select "Apps Script".
    - A new tab will open with the script editor. Delete any boilerplate code (like `function myFunction() {}`).

3.  **PASTE THE SCRIPT CODE:**
    - Copy the entire `APPS_SCRIPT_CODE` block from below (the code inside the backticks ``).
    - Paste it into the Apps Script editor.
    - Click the "Save project" icon (it looks like a floppy disk).

4.  **DEPLOY THE SCRIPT AS A WEB APP:**
    - At the top right of the Apps Script editor, click the blue "Deploy" button.
    - Select "New deployment".
    - Click the gear icon next to "Select type" and choose "Web app".
    - In the dialog that appears, make the following selections:
        - **Description:** "Feedback Form API" (or anything you like).
        - **Execute as:** "Me".
        - **Who has access:** **"Anyone"**.
          (This is CRITICAL. The app is anonymous, so the script must be accessible to anyone on the internet. It does not grant access to your Google account or the sheet itself, only to this specific script.)
    - Click the "Deploy" button.

5.  **AUTHORIZE THE SCRIPT:**
    - A popup will ask for authorization. Click "Authorize access".
    - Choose your Google account.
    - You will likely see a "Google hasn’t verified this app" warning. This is normal because it's your own script.
    - Click "Advanced", and then click "Go to [Your Project Name] (unsafe)".
    - On the next screen, scroll down and click "Allow" to grant the script permission to write to your spreadsheet.

6.  **GET YOUR WEB APP URL:**
    - After deploying, you will see a "Deployment successfully created" popup.
    - Copy the **Web app URL**. It will start with `https://script.google.com/macros/s/...`.
    - **This is your unique API endpoint.**

7.  **UPDATE THE CONFIGURATION BELOW:**
    - Paste the Web app URL you just copied into the `googleWebAppUrl` field below, replacing the placeholder text.
*/

export const formConfig = {
  // PASTE YOUR DEPLOYED WEB APP URL HERE
  googleWebAppUrl: 'https://script.google.com/macros/s/AKfycbzm2TZEwaskXsVpAfz1IOloJbYMxlnLuTzF0QyavN9L0mOcM2ad5arWhZhhKCjFVee6/exec',
};

// --- END OF CONFIGURATION ---


// --- DO NOT EDIT THE CODE BELOW ---
// This is the code you will paste into the Google Apps Script editor in Step 3.
export const APPS_SCRIPT_CODE = `
function doPost(e) {
  try {
    // Attempt to get the sheet named "Form_Responses".
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form_Responses");

    // If the sheet doesn't exist, create it and add headers.
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Form_Responses");
      sheet.appendRow(["Timestamp", "Role", "Site Area", "Site Type", "Summary", "Transcript"]);
    }

    // Parse the incoming data from the app.
    var data = JSON.parse(e.postData.contents);

    // Prepare the row data for the spreadsheet.
    var timestamp = new Date();
    var role = data.role || 'N/A';
    var siteArea = data.siteArea || 'N/A';
    var siteType = data.siteType || 'N/A';
    var summary = data.summary || 'N/A';
    var transcript = data.transcript || 'N/A';

    // Append the new row of data to the sheet.
    sheet.appendRow([timestamp, role, siteArea, siteType, summary, transcript]);

    // Return a success response to the app.
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // If any error occurs, log it and return an error response to the app.
    // Logger.log(error); // You can view these logs in the Apps Script editor under "Executions"
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
