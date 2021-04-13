# React App For Dataverse

This sample project describes how to create React app that can be utilized in a Dataverse solution using supported methods.

## Initialize React App

Initialize React app with a TypeScript template using the following command:

`create-react-app heros --template typescript`

## Install and Configure Prettier

Install Prettier that will enhance your coding experience. Use the following command to install prettier from `npm`:

`npm install prettier --save-dev --save-exact`

We do not want to install this as an app dependency but we need this package during development; so use `--save-dev`. Also, each prettier version may have different styling guides so not to have inconsistent changes across all developers recommended is to install a specific version whenever the app packages are restored; hence I have used `--save-exact`.

Next, to configure Prettier, I have added `.prettierrc.json` file. Check out the contents of that file and adjust it to your liking.

## Install and Configure React App Rewired

React App Rewired helps you override React App's WebPack config without ejecting. To install react-app-rewired use the following command:

`npm install react-app-rewired --save-dev`

Again, as this will be required while building a production app it becomes a dev dependency; hence need to use `--save-dev`.

Next, to configure React App Rewired, I have added `config-overrides.js` file. Check out the contents of that file. This file is the one that will be responsible for overriding the webpack config file. So, when using it yourself, make sure to do necessary changes in this file.
This confif file will change the `build` folder name to `dist`. It will make sure no chunk files are created and rename the JavaScript and CSS files accordingly.

Finally, you will need to change the scripts mentioned in the `package.json` file as follows:

```json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test"
  }
```

In this we have replaced `react-scripts` with `react-app-rewired` command.

## Install Fluent UI

Fluent UI is a Microsoft UX framework that provides controls which looks similar to the controls used in model-driven app. Hence it made sense to use this library to create my React app. To install this package execute the following command:

`npm install @fluentui/react`

## Develop and Build React App

Now, that we have configured everything. Develop your React App or Fork this repo to understand the code. Once your app is ready to be deployed to Dataverse; run the `npm run build` command. This will build a production files with the following structure:

```
dist > css > SuperHeroStyles.css
dist > js  > SuperHeroScript.js
dist > index.html
```

These files can be deployed to Dataverse as 3 different resources.
