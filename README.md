# Pattern Lab 3 - Starter Kit

> **Disclaimer**: Pattern Lab 3 is still under development has not yet issued a stable release. This starter kit current deploys the `beta` version of Pattern Lab 3 and thus may contain unresolved bugs and/or limited features in comparison to any upcoming stable releases of Pattern Lab 3.

This repository stores a custom starter kit for the Node edition of Pattern Lab 3 with a Grunt wrapper. This starter kit also utilizes the Handlebars engine for Pattern Lab by default.

## Prerequisites

This starter kit requires [Node](https://nodejs.org) version `>=5.0` for its core processing, [npm](https://www.npmjs.com/) for managing project dependencies, and [grunt.js](http://gruntjs.com/) for task automation and interfacing with the Pattern Lab CLI. You can follow the directions for [installing Node](https://nodejs.org/en/download/) on the Node website if you haven't done so already. Installation of Node will include `npm`. It's also highly recommended that you [install grunt](http://gruntjs.com/getting-started) globally.

## Installing

To get started with this starter kit, download or `git clone` this repository to your preferred install location. Once the starter kit is on your system, run the following commands in a terminal to complete package setup:

```
cd <path/to/install/location>
npm install
```

`npm` is a dependency management and package system which can pull in all of Pattern Lab 3's dependencies for you. Running `npm install` from the directory containing the `package.json` file will download all dependencies defined within.

## Using Pattern Lab

Pattern Lab allows you to create atomic design systems and website style guides from the ground up. For more information on using Pattern Lab read the [Pattern Lab Docs](http://patternlab.io/docs), or to learn more about Pattern Lab 3, follow the [GitHub project](https://github.com/pattern-lab/patternlab-node), read the [Pattern Lab Spec](https://github.com/pattern-lab/the-spec), and/or review the [Pattern Lab Roadmap](https://patternlab.io/roadmap.html). For demos and other resoures, visit to the [Pattern Lab Resource Center](http://patternlab.io/resources.html).

## Using Handlebars

[Handlebars](https://handlebarsjs.com/) is a semantic templating language that Pattern Lab uses to bind JSON data with template files in order to generate static HTML. For a complete guide on how to use Handlebars, read the [Handlebars documentation](https://handlebarsjs.com), refer to the [Handlebars API](https://handlebarsjs.com/reference.html), and/or check out the [Handlebars project on GitHub](https://github.com/wycats/handlebars.js#differences-between-handlebarsjs-and-mustache).
