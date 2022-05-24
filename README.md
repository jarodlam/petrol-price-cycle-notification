# Petrol price cycle notification
A Google Apps Script that checks the ACCC's petrol price cycles website and sends an email notification if the price cycle stage has changed.

I use this to remind myself to fill up my car when petrol prices are at the bottom of the cycle. It is set up in Google Apps Script to run once every hour.

The data is scraped from the [ACCC petrol price cycles website](https://www.accc.gov.au/consumers/petrol-diesel-lpg/petrol-price-cycles#petrol-prices-in-brisbane).

## Script properties
The following script properties must be set under **Project Settings > Script Properties**:
- `recipients`: `{"Brisbane": "<email1>,<email2>,...", "Melbourne": "<email1>,<email2>,..."}`
- `states`: `{"Brisbane": "", "Melbourne": ""}` (values get automatically filled in on first run)

## Notes to self on `clasp`
[`clasp`](https://github.com/google/clasp) is a CLI tool for managing Google Apps Scripts. Install using instructions on GitHub page.

This tool lets you dev locally but don't bother, the online editor is way more convenient. Only use `clasp` to pull the script so it can be pushed to `git`.

Log in to `clasp`, only need to do this once (may need to use Chrome):
```sh
clasp login
```

Pull changes from Google Apps Script to local:
```sh
clasp push
```

Push changes from local to Google Apps Script:
```sh
clasp push
```

Set up this `clasp` repo from scratch:
```sh
clasp clone "https://script.google.com/home/projects/1B1ANyrzUZIPDsxHzaJyRBIsRrCxMg9-idC6oXGyRp7XNVip8J8SnMv6J/edit"
```
