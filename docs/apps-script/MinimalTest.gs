/**
 * Six lines whose only job is to answer the question "is the code I am editing
 * the code that is being deployed?".
 *
 * Paste this as the ENTIRE contents of Code.gs, replacing everything, then
 * save and redeploy as a NEW VERSION. Open the web app URL in a browser.
 *
 *   You see "kiosk ok"                  -> the chain works. Put the real
 *                                          Code.gs back, save, redeploy as a
 *                                          new version, and it will work too.
 *
 *   You still see "function not found"  -> the project you are editing is not
 *                                          the project that URL comes from.
 */

function doGet() {
  return ContentService.createTextOutput('kiosk ok');
}

function doPost() {
  return ContentService.createTextOutput('kiosk ok');
}
