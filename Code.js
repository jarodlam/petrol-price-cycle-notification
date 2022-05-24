CITIES = ["Brisbane", "Melbourne"]
IMAGEURLS = {
  "Brisbane": "https://www.accc.gov.au/sites/www.accc.gov.au/files/fuelwatch/brisbane-ulp.png",
  "Melbourne": "https://www.accc.gov.au/sites/www.accc.gov.au/files/fuelwatch/melbourne-ulp.png"
}
SUBJECTLINES = {
  "INCREASING": "Petrol prices INCREASING!",
  "DECREASING": "Petrol prices decreasing",
  "HIGHEST": "Petrol prices at highest point in cycle",
  "LOWEST": "Petrol prices at LOWEST point in cycle!"
}
STATUSTEXT = {
  "INCREASING": "INCREASING!",
  "DECREASING": "decreasing.",
  "HIGHEST": "at highest point in the cycle.",
  "LOWEST": "at LOWEST point in the cycle!"
}

function myFunction() {
  for (city of CITIES) {
    sendNotification(city);
  }
}

function sendNotification(city) {
  // Get HTML source
  var text = UrlFetchApp.fetch("https://www.accc.gov.au/consumers/petrol-diesel-lpg/petrol-price-cycles").getContentText();
  
  // Extract the city's section
  var regExp = new RegExp("(Petrol prices in " + city + "<\/h2>)([\\S\\s]*?)(<\/ul>)");
  var matchedText = regExp.exec(text);
  
  // Check if we could find the section or not
  if (matchedText == null){
    throw new Error(city + ": Section not found on ACCC website.");
  }
  
  // Get status
  var state;
  if (matchedText[0].includes("increasing")) {
    state = "INCREASING";
  } else if (matchedText[0].includes("decreasing")) {
    state = "DECREASING";
  } else if (matchedText[0].includes("highest")) {
    state = "HIGHEST";
  } else if (matchedText[0].includes("lowest")) {
    state = "LOWEST";
  } else {
    throw new Error(city + ": Could not determine price cycle status.");
  }
  
  // Check if the state has changed since last time
  var properties = PropertiesService.getScriptProperties();
  var statesProp = JSON.parse(properties.getProperty("states"));
  var prevState = statesProp[city];

  if (state == prevState) {
    Logger.log(city + ": Current state is the same as previous state (" + state + "). Terminating with no email notification.");
    return;
  }

  statesProp[city] = state
  properties.setProperty("states", JSON.stringify(statesProp));
  
  // Send notification
  var recipientsProp = JSON.parse(properties.getProperty("recipients"));
  Logger.log(city + ": Sending email to: " + recipientsProp[city] + ".");
  MailApp.sendEmail({
    bcc: recipientsProp[city],
    subject: SUBJECTLINES[state],
    htmlBody: "\
<!doctype html><html><body>\
<p>This is an automated email. </p>\
<p>" + city + " petrol prices are now <b>" + STATUSTEXT[state] + "</b> \
More information <a href='https://www.accc.gov.au/consumers/petrol-diesel-lpg/petrol-price-cycles'>here</a>.</p>\
<img src='" + IMAGEURLS[city] + "' style='max-width:100%'>\
</body></html>"
  });
}
