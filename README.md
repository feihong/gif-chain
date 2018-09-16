# Starter App for React, Babel, and Webpack on Glitch

A starter app for Glitch that uses React, Babel, and Webpack. This is similar to  the starter apps in [React Starter Kit](https://glitch.com/react-starter-kit), but the major difference is that it can compile ES6-style JavaScript using Babel.

Having access to ES6 features makes it much easier to use popular component libraries like [Material-UI](https://material-ui.com/) (the `import` syntax is much easier to use than the `require()` function for certain libraries). Therefore this app includes some examples of using Material-UI components.

The `package.json` file contains extra scripts to help you develop your app locally, if you so choose. For local development, you do need to install some additional global dependencies, described below.

## Prerequisites for local development

    yarn global add nodemon npm-run-all
    yarn install

## Scripts

Build the client source and start the server. This is only used on Glitch, where yarn is not used.

    npm start

Run in dev mode, meaning when you change files the server reloads automatically and the client source is recompiled

    yarn dev

Build the client source, producing the `public/bundle.js` file

    yarn build

Run the server, which automatically reloads on changes

    yarn server
