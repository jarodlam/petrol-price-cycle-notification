function myFunction() {
  // Get HTML source
  var text = UrlFetchApp.fetch("https://www.accc.gov.au/consumers/petrol-diesel-lpg/petrol-price-cycles").getContentText();
  
  // Extract the Brisbane section
  var regExp = new RegExp(/(Petrol prices in Brisbane<\/h2>)([\S\s]*?)(<\/ul>)/);
  var matchedText = regExp.exec(text);
  
  // Check if we could find the section or not
  if (matchedText == null){
    throw new Error( "Brisbane section not found on ACCC website." )
  }
  
  // Check if prices are increasing
  var isIncreasing = matchedText[0].includes("increasing");
  
  // Check if the state has changed since last time
  var properties = PropertiesService.getScriptProperties();
  var prevIsIncreasing = properties.getProperty("prevIsIncreasing");
  properties.setProperty("prevIsIncreasing", isIncreasing);
  if (isIncreasing.toString() == prevIsIncreasing) {
    Logger.log("Current status is the same as previous status (" + (isIncreasing ? "increasing" : "decreasing") + "). Terminating with no notification.");
    return;
  }
  
  // Send notification
  MailApp.sendEmail({
    bcc: "example@gmail.com",
    subject: "Petrol prices " + (isIncreasing ? "INCREASING!" : "decreasing"),
    htmlBody: "\
<!doctype html><html><body>\
<p>This is an automated email.</p>\
<p>Brisbane petrol prices are now <b>" + (isIncreasing ? "INCREASING" : "DECREASING") + "</b>. \
More information <a href='https://www.accc.gov.au/consumers/petrol-diesel-lpg/petrol-price-cycles#petrol-prices-in-brisbane'>here</a>.</p>\
<img src='https://www.accc.gov.au/sites/www.accc.gov.au/files/fuelwatch/brisbane-ulp.png' style='max-width:100%'>\
</body></html>"
  });
}
