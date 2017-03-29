# imagesqueeze

![Travis CI build status](https://travis-ci.org/humantorch/imagesqueeze.svg?branch=master)

An image-optimisation app, currently used for comparing [Guetzli](https://github.com/google/guetzli)
 with other compression standards.

## Installation

imagesqueeze requires the Guetzli binary to be installed on your system. On OS X the easiest way to do this is through [Homebrew](https://brew.sh/).
* Install Homebrew
  * `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
* Once Homebrew is installed, use it to install the Guetzli binary.
  * `brew install guetzli`

Once Guetzli is installed imagesqueeze runs on node.js. If you've got Node and NPM installed than a simple `npm install` will download all of the required modules.

## Basic usage

imagesqueeze's folder structure is pretty basic, containing an `input` and `output` directory (ignore `www` for now, that's coming later). Place any images you want optimized in `input`. imagesqueeze will run on anything in that directory, grinding it through the selected processes, and place final optimised images in the `output` folder, maintaining the original folder structure*.

_*guetzli still has some issues with this so you may get an [input folder in your output folder](https://www.kenyanvibe.com/wp-content/uploads/2017/01/xzibit.jpg). Think of it as a delicious Reese Peanut Butter Cup._

To run Guetzli on the `input` directory:
* `grunt g`

To run standard web optimisation (optipng, gifsicle, etc.) on the `input` directory:
* `grunt i`

### Known issues

* Guetzli only works on JPEG formatted images. It has a nasty habit of also running on .png files but changing the extension which caused some errors, so `grunt g` will currently only pick up images with a `.jpg` extension and ignore the rest. `grunt i` will pick up everything.
* Guetzli can only work on images in a certain colorspace. If it comes across a JPEG it can't handle for whatever reason the process stops. I haven't found a way around this yet.
* Guetzli is _sllllllllllloooooooow_ and will gorge itself on your computer's available memory like Oprah Winfrey at a buffet. A folder of images that `grunt i` can churn through in about 10 seconds can take `grunt g` several minutes. If you've got a bunch of images to work through maybe set it to run and then go have lunch.


### TODO

* The Gruntfile has a bunch of other in-progress bits in it (exporting `output` as a .zip archive, setting up a web app to run this online, etc.) that are all in various stages of completion but nothing's ready for prime time yet. Soon! Maybe!