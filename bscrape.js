"use strict";
phantom.casperTest = true;

var config = require('./config-clark.js');
var fs = require('fs');

var regex = /[+-]?\d+(\.\d+)?/g;
var desktopUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36';
var mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
var data = {};
var balanceSelectors = {};

function parseBalance(html) { 
    return html.match(regex).map(function(v) { return parseFloat(v); })[0];
}

var casper = require('casper').create({
    // verbose: true,
    // logLevel: "debug",
    waitTimeout: 20000,
    retryTimeout: 15,
    viewportSize: { width: 1280, height: 1024 },
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: desktopUA
    }
});
casper.start('http://www.google.com');


/////////////////
// 1. Paddypower
/////////////////


/////////////////
// 2. Betway
/////////////////

if (config.betway.enabled) {

    casper.thenOpen('https://sports.betway.com/');

    casper.waitForSelector('#loginfieldUsername', function() {
        this.fillSelectors('#loginForm', {
            'input[name="username"]': config.betway.username,
            'input[name="password"]': config.betway.password
        });
        this.click('#loginForm > div.loginSubmit > input');
    });

    balanceSelectors.betway = '#balance';
    casper.waitForSelector(balanceSelectors.betway, function() {
        data.betway = parseBalance(this.getHTML(balanceSelectors.betway));
        this.echo("betway: " + data.betway);
    });

    casper.waitForSelector('#login > div.user_box > div:nth-child(1) > div.right > span', function() {
        this.click('#login > div.user_box > div:nth-child(1) > div.right > span');
    });
}

/////////////////
// 3. Betfred
/////////////////

if (config.betfred.enabled) {

    casper.thenOpen('http://www.betfred.com/', function() {
        this.click('#BetFredContent_ctl01_LoginControls > div:nth-child(1) > a');
    });

    casper.waitForSelector('#SignIn', function() {
        this.fillSelectors('#SignIn', {
            'input[name="LoginUserName"]': config.betfred.username,
            'input[name="LoginPassword"]': config.betfred.password
        });
        this.click('#login-button');
    });

    balanceSelectors.betfred = '#cashBalanceHeader';
    casper.waitForSelector(balanceSelectors.betfred, function() {
        data.betfred = parseBalance(this.getHTML(balanceSelectors.betfred));
        this.echo("betfred: " + data.betfred);
    });
}

/////////////////
// 4. Stan James
/////////////////


/////////////////
// 5. Betvictor
/////////////////


/////////////////
// 6. William Hill
/////////////////

if (config.willhill.enabled) {

    casper.thenOpen('http://sports.williamhill.com/bet/en-gb');

    casper.waitForSelector('#login', function() {
        this.sendKeys('#username', config.willhill.username);
        this.sendKeys('#password', config.willhill.password);
        this.click('#signInBtn');
    });

    balanceSelectors.willhill = '#userBalance';
    casper.waitForSelector(balanceSelectors.willhill, function() {
        data.willhill = parseBalance(this.getHTML(balanceSelectors.willhill));
        this.echo("william hill: " + data.willhill);
    });   
}

/////////////////
// 6. Skybet
/////////////////

if (config.skybet.enabled) {    
    
    casper.thenOpen('https://www.skybet.com/secure/identity/login/skybet');

    casper.waitForSelector('#txt-login-uid-login-sso', function() {
        this.sendKeys('#txt-login-uid-login-sso', config.skybet.username);
        this.sendKeys('#txt-login-pin-login-sso', config.skybet.pin);
        this.click('#btn-login-submit-login-sso');
    });

    balanceSelectors.skybet = '#js-balance';
    casper.waitForSelector(balanceSelectors.skybet, function() {
        data.skybet = parseBalance(this.getHTML(balanceSelectors.skybet));
        this.echo("skybet: " + data.skybet);
    });
}

/////////////////
// 7. Ladbrokes
/////////////////

if (config.ladbrokes.enabled) {

    casper.userAgent(mobileUA);
    casper.thenOpen('https://mobile.ladbrokes.com/lobby/games/balanceViewer?retUrl=https://mobile.ladbrokes.com/lobby/games/');

    casper.waitForSelector('.btn', function() {
        this.click('.btn');
    });

    casper.waitUntilVisible('#loginusername', function() {
        this.sendKeys('#loginusername', config.ladbrokes.username);
        this.sendKeys('#loginpassword', config.ladbrokes.password);
        this.click('#loginaccount');
    });

    balanceSelectors.ladbrokes = '.col2';
    casper.waitUntilVisible(balanceSelectors.ladbrokes , function() {
        data.ladbrokes = parseBalance(this.getHTML(balanceSelectors.ladbrokes));
        this.echo("ladbrokes: " + data.ladbrokes);
    });   
}

/////////////////
// 8. Totesport
/////////////////

if (config.totesport.enabled) {

    casper.userAgent(mobileUA);
    casper.thenOpen('https://totesport.mobi/my-account/');

    casper.wait(5000);

    casper.waitUntilVisible('.help-overlay__ok-button', function() {
        if (this.exists('.help-overlay')) {
            this.evaluate(function() {
                // $('.help-overlay').remove();
                document.getElementById("element-id").outerHTML='';
            });
        }
    });

    casper.waitUntilVisible('.logon__input--username', function() {
        casper.fillSelectors('body > div.page.page--loaded > div > div > div > div > div.my-account__content > div > form', {
            'input[name="LogonUsername"]': config.totesport.username,
            'input[name="LogonPassword"]': config.totesport.password
        }, true); 
    });

    casper.waitUntilVisible('.userDetails', function() {
        this.click('.icon__image--large');
    });

    balanceSelectors.totesport = '.balance';
    casper.waitUntilVisible(balanceSelectors.totesport, function() {
        data.totesport = parseBalance(this.getHTML(balanceSelectors.totesport));
        this.echo("totesport: " + data.totesport);
    });  
}

/////////////////
// 9. Betbright
/////////////////

if (config.betbright.enabled) {

    casper.userAgent(mobileUA);
    casper.thenOpen('https://m.betbright.com/login');

    casper.waitUntilVisible('#login-form', function() {
        casper.fillSelectors('#login-form', {
            'input[name="username"]': config.betbright.email,
            'input[name="password"]': config.betbright.password
        }, true);
    });

    balanceSelectors.betbright = '#customer_balance';
    casper.waitUntilVisible(balanceSelectors.betbright, function() {
        data.betbright = parseBalance(this.getHTML(balanceSelectors.betbright));
        this.echo("betbright: " + data.betbright);
    }); 
}

/////////////////
// 10. Vernons
/////////////////

if (config.vernons.enabled) {

    casper.userAgent(desktopUA);
    casper.thenOpen('https://www.vernons.com');

    casper.waitUntilVisible('#forms-playtech-login-form', function() {
        casper.fillSelectors('#forms-playtech-login-form', {
            'input[name="username"]': config.vernons.username,
            'input[name="password"]': config.vernons.password
        }, true);
    });

    balanceSelectors.vernons = '.amount';
    casper.waitUntilVisible(balanceSelectors.vernons, function() {
        data.vernons = parseBalance(this.getHTML(balanceSelectors.vernons));
        this.echo("vernons: " + data.vernons);
    }); 
}

/////////////////
// 11. 32Red
/////////////////


/////////////////
// 11. Titanbet
/////////////////

if (config.titanbet.enabled) {

    casper.userAgent(desktopUA);
    casper.thenOpen('http://sports.titanbet.co.uk/en');

    casper.waitForSelector('#header-area > div.fragment.login > div.when-logged-out > form > label:nth-child(2) > input[type="text"]', function() {
        this.sendKeys('#header-area > div.fragment.login > div.when-logged-out > form > label:nth-child(2) > input[type="text"]', config.titanbet.username);
        this.sendKeys('#header-area > div.fragment.login > div.when-logged-out > form > label:nth-child(3) > input[type="password"]', config.titanbet.password);
        this.click('#header-area > div.fragment.login > div.when-logged-out > form > input');
    });

    balanceSelectors.titanbet = '#balance_id > span.expander-button > span.total-balance-value';
    casper.waitForSelectorTextChange(balanceSelectors.titanbet, function() {
        data.titanbet = parseBalance(this.getHTML(balanceSelectors.titanbet));
        this.echo("titanbet: " + data.titanbet);
    });
}


/////////////////
// 12. Unibet
/////////////////

// TODO

/////////////////
// 13. Coral
/////////////////

if (config.coral.enabled) {
    casper.userAgent(desktopUA);
    casper.thenOpen('http://sports.coral.co.uk/');

    casper.waitForSelector('#top-login-form', function() {
        casper.fillSelectors('#top-login-form', {
            'input[name="login"]': config.coral.username,
            'input[name="password"]': config.coral.password
        });
        this.click('#top-login-form > div.buttons-wrapper.login-wrapper > button.login-button');
    })

    balanceSelectors.coral = '#balance-text > span.account-balance-value';
    casper.waitUntilVisible(balanceSelectors.coral, function() {
        data.coral = parseBalance(this.getHTML(balanceSelectors.coral));
        this.echo("coral: " + data.coral);
    }); 
}


/////////////////
// 13. Smarkets
/////////////////

if (config.smarkets.enabled) { 
    casper.userAgent(desktopUA);
    casper.thenOpen('https://m.smarkets.com/members/login');

    casper.waitForSelector('#login', function() {
        this.fill('#login', {
            'email': config.smarkets.email,
            'password': config.smarkets.password
        }, true);
    });

    balanceSelectors.smarkets = '#notice';
    casper.waitForSelectorTextChange(balanceSelectors.smarkets, function() {
        data.smarkets = parseBalance(this.getHTML(balanceSelectors.smarkets));
        this.echo("smarkets: " + data.smarkets);
    });
}


/////////////////
// 13. Betfair
/////////////////

if (config.betfair.enabled) {
    casper.userAgent(desktopUA);
    casper.thenOpen('https://www.betfair.com/exchange');

    casper.waitForSelector('form.ssc-lif', function() {
        this.fill('form.ssc-lif', {
            'username': config.betfair.username,
            'password': config.betfair.password
        }, true);
    });

    balanceSelectors.betfair = '.ssc-wla';
    casper.waitUntilVisible(balanceSelectors.betfair, function() {
        data.betfair = parseBalance(this.getHTML(balanceSelectors.betfair));
        this.echo("betfair: " + data.betfair);
    });
}


// Run
casper.run(function() {
    // Write balances to json file
    var j = JSON.stringify(data, null, 4);
    fs.write('balances.json', j, 'w');

    var _this = this;
    _this.page.close();

    setTimeout(function exit(){
        _this.exit(0);
    }, 0);
});
