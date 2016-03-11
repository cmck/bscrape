bscrape
==========================

Scrape your balances from various bookmaker websites to get 
a quick overview of your money.


### Prerequisites

Mac OS X. All the installation instructions are for OS X at the moment.
[homebrew](http://brew.sh/)

### Supported bookmakers
* Coral
* PaddyPower
* Betway
* Betfred
* Betvictor
* William Hill
* Skybet
* Ladbrokes
* Totesport
* Betbright
* Vernons
* 32Red
* Titanbet
* Unibet
* Smarkets
* Betfair

Please feel free to contribute. This codebase is still under development and requires continual maintenance. If you encounter a problem it is likely that the underlying website has changed. Please create an new issue or provide a pull request.

### Installation

This must be run from the [Terminal](http://www.macworld.co.uk/feature/mac-software/get-more-out-of-os-x-terminal-3608274/). It has only been tested on OS X.

1. brew install casperjs --devel
2. Set your usernames and passwords in config.js

### Usage

```
casperjs bscrape.js --ignore-ssl-errors=true --ssl-protocol=any
```

Balances will be shown in the terminal and output to the file: balances.json
