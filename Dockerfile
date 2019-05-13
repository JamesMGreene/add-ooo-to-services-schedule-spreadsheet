# Use the latest version of Node.js
# FROM node:slim
#
# You may prefer the full image:
# FROM node
#
# or even an alpine image (a smaller, faster, less-feature-complete image):
# FROM node:alpine
#
# You can specify a version:
# FROM node:10-slim
FROM node:10-alpine

# Labels for GitHub to read your action
LABEL "com.github.actions.name"="add-ooo-to-services-google-calendar"
LABEL "com.github.actions.description"="Update the GitHub Services Google Calendar when a new OOO issue is opened"
# Here are all of the available icons: https://feathericons.com/
LABEL "com.github.actions.icon"="calendar"
# And all of the available colors: https://developer.github.com/actions/creating-github-actions/creating-a-docker-container/#label
LABEL "com.github.actions.color"="green"

LABEL "repository"="http://github.com/JamesMGreene/add-ooo-to-services-google-calendar"
LABEL "homepage"="http://github.com/JamesMGreene/add-ooo-to-services-google-calendar"
LABEL "maintainer"="James M. Greene <jamesmgreene@github.com>"

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your action's code
COPY . .

# Run `node /index.js`
ENTRYPOINT ["node", "/index.js"]
