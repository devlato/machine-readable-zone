# MRZ Generator

This library helps to generate [MRZ codes](https://en.wikipedia.org/wiki/Machine-readable_passport). 
It's implemented with Node.js and TypeScript. It provides both CLI tool and programmatic API.


## Dependencies:

The project depends on the following technologies and libraries:
* `Node.js`;
* `TypeScript`;
* `jest` and `ts-jest`;
* `ts-node-dev`;
* `tslint` and `tslint-config-airbnb`.

As you see, there no dependencies but various dev tools.


## Installation

(These installation instructions would be valid after publishing, so the package name could change).

Let's consider you use [Yarn](https://yarnpkg.com/) as your package manager. If you use [npm](https://www.npmjs.com/), 
it would pretty easy for you to translate the commands using 
this [cheatsheet](https://github.com/areai51/yarn-cheatsheet).

To install it as a global binary, use the following command:

```sh
$ yarn global add mrz
```

To install it as your project dependency, run:

```sh
$ yarn add mrz
```


## Building the project

It is recommend to manage Node versions with [NVM](https://github.com/creationix/nvm).

After cloning the project, run

```sh
$ yarn
``` 

to install the project dependencies. Project has only development dependencies: TypeScript, tslint, jest, etc.
As the command succeeded, type

```sh
$ yarn build
```

to build the project locally.
 

## Copyright

Author: Denis Tokarev ([@devlato](https://github.com/devlato))

License: MIT
