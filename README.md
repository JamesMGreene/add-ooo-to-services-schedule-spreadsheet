# `add-ooo-to-spreadsheet` :calendar:

A GitHub Action to update the GitHub Services Schedule Google Spreadsheet when an `/ooo` slash command comment is created in an OOO issue

## Prerequisites

In order to make this all work, you must first:

1. Create a Project and a Service Account on Google Cloud Platform (GCP) for the appropriate Google Apps (GSuite) domain
  - See: https://console.developers.google.com/iam-admin/serviceaccounts/
2. Create a JSON "Key" for the Service Account to acquire the `client_email` and `private_key` values
3. Share "Edit" access with that Service Account (via its `client_email`) from
the target spreadsheet

## Configuration

When adding this Action to a Workflow, you _must_ configure the following:

### Secrets

- `GITHUB_TOKEN`: This is a GitHub-provided secret that will already exist for your Action. You just need to check the checkbox to enable it.
- `GOOGLE_API_CLIENT_EMAIL`: The client email address for your GCP Service Account. This will be in a format similar to `${service-account-name}@${project-id}.iam.gserviceaccount.com`. It is the value of the property associated with the key `client_email` in the JSON "Key" file.
- `GOOGLE_API_PRIVATE_KEY`: The private key for your GCP Service Account. This will be in a format similar to `-----BEGIN PRIVATE KEY-----\nblah+blah+blah\n-----END PRIVATE KEY-----\n`.
  - **CRITICAL:** As of 2019-05-14, you _must_ manually replace the `\n` with actual newlines when pasting this value into a Secret on the GitHub.com UI.

### Environment Variables

- `SPREADSHEET_ID`: The ID of the target Google Sheet. Given a spreadsheet URL like `https://docs.google.com/spreadsheets/d/blah_blah_blah/edit#gid=123`, the ID is the `blah_blah_blah` segment of the URL path.
- `SHEET_NAME`: The name of the individual target sheet (tab) within the spreadsheet.
- `DATE_ROW`: The single numerical row name (e.g. `'1'`, `'97'`) in which to find the cells containing individual dates.
- `LOGIN_COL`: The single alphabetical column name (e.g. `'D'`, `'AB'`) in which to find the cells containing user logins.

## Explanation

How is this Action intended to work?

- The Action should be triggered when a comment is created in an existing issue
- The issue's `title` must include the text `'OOO'` or `'Out of Office'` (both case-insensitive)
- The comment must have been created by the issue's author
- The comment must contain an `/ooo` slash command (case-insensitive)
- That `/ooo` slash command must contain either 1 or 2 conceptual dates
  - e.g. `/ooo on 5/14` or `/ooo from 5/14 to 5/21`
- The author's login (username) must appear as an entry in the target Google Sheet
- The dates as parsed from the `/ooo` slash command must appear as entries in the target Google Sheet
- Weekend dates (Saturdays and Sundays) are excluded
- Any cells in the target Google Sheet that correspond to the remaining dates for the author's row will be updated with a hyperlink to the OOO issue with the display text "OOO".
  - This excludes any cells that may be a submissive part of a merged range.
  - :warning: This does NOT exclude any cells that are the dominant (display-value-providing) part of a merged range, so that could update the display value for the entire merged range! :warning:
  - :warning: This does NOT exclude any cells that already have existing values! :warning:
- Finally, if the Google Sheet updates succeed, a new issue comment is created by the GitHub Actions bot to confirm that your OOO days have been added to the target Google Sheet, as well as including an audit trail of the updated cells' old and new values _just_ in case this automated update conflicts with some existing value of importance that the user overlooked. :grimacing:

![Bot's corresponding comment](https://user-images.githubusercontent.com/417751/57977981-0e7d7080-79c9-11e9-81de-1c4c4b63aaf8.png)
