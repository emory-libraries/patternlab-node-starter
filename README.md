# Pattern Lab Node - Grunt Edition - Starter Kit

This repository stores a custom starter kit for the Grunt edition of Pattern Lab Node. 

## Prerequisites

The Pattern Lab Node - Grunt Edition uses [Node](https://nodejs.org) for core processing, [npm](https://www.npmjs.com/) to manage project dependencies, and [grunt.js](http://gruntjs.com/) to run tasks and interface with the core library. Node version 4 or higher suffices. You can follow the directions for [installing Node](https://nodejs.org/en/download/) on the Node website if you haven't done so already. Installation of Node will include npm. It's also highly recommended that you [install grunt](http://gruntjs.com/getting-started) globally.

## Installing

To get started with this starter kit, download or `git clone` this repository to install location. Once the starter kit is on your system, run the following commands to complete package setup:

```
cd <your_install_location>
npm install
grunt mode:prod
```

`npm` is a dependency management and package system which can pull in all of the Grunt Edition's dependencies for you. Running `npm install` from the directory containing the `package.json` file will download all dependencies defined within.

## Using Pattern Lab

Pattern Lab allows you to create atomic design systems and website styleguides from the ground up. For more information on the Node version and/or Grunt edition of Pattern Lab, read the [Pattern Lab Docs](http://patternlab.io/docs), check out the [Grunt Edition](https://github.com/pattern-lab/edition-node-grunt) project on Github, and/or get more details on the [Pattern Lab Node Core](https://github.com/pattern-lab/patternlab-node). For demos and other resoures, visit to the [Pattern Lab Resource Center](http://patternlab.io/resources.html).

## Using Mustache

Mustache is a logic-less templating language that Pattern Lab uses to bind JSON data in HTML files. For a complete guide on how to use Mustache, read the [Mustache Manual](https://mustache.github.io/mustache.5.html).