bscrape
==========================

Scrape your balances from various bookmaker websites to get 
a quick overview of your money.


### Prerequisites

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

Please feel free to contribute

### Installation

1. brew install casperjs --devel
2. Set your usernames and passwords in config.js

### Usage

```
casperjs bscrape.js --ignore-ssl-errors=true --ssl-protocol=any
```

Will output balances to stdout and to ./balances.json
