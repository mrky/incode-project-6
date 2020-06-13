# Project 6: Location App
Joint Group Project

Ana Shibata, Jason David, Mark Kelly, Michelle Hickey

## MVC Pattern

Each Route will take in a function that corresponds to a function inside a Controller file.
The Controller function deals with the logic and rendering of the results for the calling Route.
The Controller function will include the paramaeters REQ, RES, NEXT.

Prefix Route files with 'routes'. For example, routes.users.js
Suffix Controller and Model files with the corresponding type. For example, users.controller.js
Use PascalCase when importing a Controller or Model. For example, const User = require('...').
Name Models in sigular format.
Name Controllers in plural format.

## Coding conventions

Use 'single' quotes in JavaScript files.
Use 'single' quotes and lowercase inside CSS files.
Use all lowercase and "double" quotes inside HTML files.
Use kebab-case to name HTML attributes. For example, if name="confirm-password" instead of name='confirmPassword'.

## EJS

For each ejs file loaded include the header at the top of the file and the footer at the bootom.
Like so:

- <%- include('partials/header') %>
- <\page content>
- <%- include('partials/footer') %>

The header file opens a div tag that is later closed in the footer file.
All page content will go inside this div.
Using Bootstrap.

