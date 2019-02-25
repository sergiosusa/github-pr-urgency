#  Github Pull Request Urgency

This script adds to a pull request list (project and general view) new features: 

- Urgency configuration bar.
- Print a urgency color border to pull request by configured urgency.

![Github Pull Request Urgency](https://i.ibb.co/dg43KhC/github-pr-urgency.png)

## Prerequisites

- [Tampermonkey (Chrome)](https://tampermonkey.net)
- [Greasemonkey (Firefox)](http://www.greasespot.net)
- [Violent monkey (Opera)](https://addons.opera.com/sk/extensions/details/violent-monkey/)

## Installation

**Github**

- Enter to the user script file (usually named as <code>*.user.js</code>) you want to install.
- Click on the <code>Raw</code> button, the browser extension will recognize this file as a user script.
- Install it.

That's it! 

## Know bugs

- Github do not reload page when enter to PR pages coming from a internal link, so, 'on ready' event never launch the script (reload page manually will fix it).

## Author

Sergio Susa (https://sergiosusa.com)

If you want to support my work, consider to use [this](https://github.com/sergiosusa/my-user-scripts/blob/master/stores/my-amazon-affiliate.user.js) script when you buy on amazon spain. :innocent:
