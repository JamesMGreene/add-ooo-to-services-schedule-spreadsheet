# `add-ooo-to-services-google-calendar` :calendar:
A GitHub Action to add a new OOO to the GitHub Services Google Calendar when an OOO issue is opened

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

- `GOOGLE_API_CLIENT_EMAIL`: The client email address for your GCP Service Account. This will be in a format similar to `${service-account-name}@${project-id}.iam.gserviceaccount.com`. It is the value of the property associated with the key `client_email` in the JSON "Key" file.
- `GOOGLE_API_PRIVATE_KEY`: The private key for your GCP Service Account. This will be in a format similar to `-----BEGIN PRIVATE KEY-----\nblah+blah+blah\n-----END PRIVATE KEY-----\n`.
  - **CRITICAL:** As of 2019-05-14, you _must_ manually replace the `\n` with actual newlines when pasting this value into a Secret on the GitHub.com UI.

### Environment Variables

- `SPREADSHEET_ID`: The ID of the target Google Sheet. Given a spreadsheet URL like `https://docs.google.com/spreadsheets/d/blah_blah_blah/edit#gid=123`, the ID is the `blah_blah_blah` segment of the URL path.
- `SHEET_NAME`: The name of the individual target sheet (tab) within the spreadsheet.
- `DATE_ROW`: The single numerical row name (e.g. `'1'`, `'97'`) in which to find the cells containing individual dates.
- `LOGIN_COL`: The single alphabetical column name (e.g. `'D'`, `'AB'`) in which to find the cells containing user logins.

## Triggers

What triggers this action? It specifically monitors the following situation:

- A new issue is opened
- The issue `title` includes the text `'OOO'` or `'Out of Office'` (both case-insensitive)
- ?
