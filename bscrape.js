phantom.casperTest = true

// var casper = require('casper').create({
//     verbose: true,
//     logLevel: "debug",
//     pageSettings: {
//         loadImages: true,
//         loadPlugins: true
//     }
// });

var config = require('./config.js');
var fs = require('fs');
var x = require('casper').selectXPath;
var casper = require('casper').create();

// Set variables
var regex = /[+-]?\d+(\.\d+)?/g;
var desktopUA = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
var mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
var data = {};

// Casper config
casper.userAgent(desktopUA)
casper.options.waitTimeout = 10000;

// Start
casper.start('http://www.google.com')
.viewport(1280,1024)


/////////////////
// 1. Paddypower
/////////////////

// TODO


/////////////////
// 2. Betway
/////////////////

if (config.betway.username) {

    casper.thenOpen('https://sports.betway.com/')

    casper.waitForSelector('#loginfieldUsername', function() {
        this.fillSelectors('#loginForm', {
            'input[name="username"]': config.betway.username,
            'input[name="password"]': config.betway.password
        })
        this.click('#loginForm > div.loginSubmit > input')
    })

    casper.waitForSelector('#balance', function() {
        data["betway"] = this.getHTML('#balance').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("betway: " + data["betway"])
    })

    casper.waitForSelector('#login > div.user_box > div:nth-child(1) > div.right > span', function() {
        this.click('#login > div.user_box > div:nth-child(1) > div.right > span')
    })
}

/////////////////
// 3. Betfred
/////////////////

if (config.betfred.username) {

    casper.thenOpen('http://www.betfred.com/', function() {
        this.click('#BetFredContent_ctl01_LoginControls > div:nth-child(1) > a')
    })

    casper.waitForSelector('#SignIn', function() {
        this.fillSelectors('#SignIn', {
            'input[name="LoginUserName"]': config.betfred.username,
            'input[name="LoginPassword"]': config.betfred.password
        })
        this.click('#login-button')
    })

    casper.waitForSelector('#cashBalanceHeader', function() {
        data["betfred"] = this.getHTML('#cashBalanceHeader').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("betfred: " + data["betfred"])
    })
}

/////////////////
// 4. Stan James
/////////////////

// TODO

/////////////////
// 5. Betvictor
/////////////////

// TODO

/////////////////
// 6. William Hill
/////////////////

if (config.willhill.username) {

    casper.thenOpen('http://sports.williamhill.com/bet/en-gb')

    casper.waitForSelector('#login', function() {
        this.sendKeys('#username', config.willhill.username)
        this.sendKeys('#password', config.willhill.password)
        this.click('#signInBtn')
    })

    casper.waitForSelector('#userBalance', function() {
        data["willhill"] = this.getHTML('#userBalance').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("william hill: " + data["willhill"])
    })   
}

/////////////////
// 6. Skybet
/////////////////

if (config.skybet.username) {    
    
    casper.thenOpen('https://www.skybet.com/secure/identity/login/skybet')

    casper.waitForSelector('#txt-login-uid-login-sso', function() {
        this.sendKeys('#txt-login-uid-login-sso', config.skybet.username)
        this.sendKeys('#txt-login-pin-login-sso', config.skybet.pin)
        this.click('#btn-login-submit-login-sso')
    })

    casper.waitForSelector('#js-balance', function() {
        data["skybet"] = this.getHTML('#js-balance').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("skybet: " + data["skybet"])
    })
}

/////////////////
// 7. Ladbrokes
/////////////////

if (config.ladbrokes.username) {

    casper.userAgent(mobileUA)
    casper.thenOpen('https://mobile.ladbrokes.com/lobby/games/balanceViewer?retUrl=https://mobile.ladbrokes.com/lobby/games/')

    casper.waitForSelector('.btn', function() {
        this.click('.btn')
    })

    casper.waitForSelector('#loginusername', function() {
        this.sendKeys('#loginusername', config.ladbrokes.username)
        this.sendKeys('#loginpassword', config.ladbrokes.password)
        this.click('#loginaccount')
    })

    casper.waitForSelector('.col2', function() {
        data["ladbrokes"] = this.getHTML('.col2').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("ladbrokes: " + data["ladbrokes"])
    })   
}

/////////////////
// 8. Totesport
/////////////////

if (config.totesport.username) {

    casper.userAgent(mobileUA)
    casper.thenOpen('https://totesport.mobi/my-account/')

    casper.wait(5000)

    casper.waitUntilVisible('.help-overlay__ok-button', function() {
        if (this.exists('.help-overlay')) {
            this.evaluate(function() {
                $('.help-overlay').remove()
            })
        }
    })

    casper.waitUntilVisible('.logon__input--username', function() {
        casper.fillSelectors('body > div.page.page--loaded > div > div > div > div > div.my-account__content > div > form', {
            'input[name="LogonUsername"]': config.totesport.username,
            'input[name="LogonPassword"]': config.totesport.password
        }, true) 
    })

    casper.waitUntilVisible('.userDetails', function() {
        this.click('.icon__image--large')
    })

    casper.waitUntilVisible('.balance', function() {
        data["totesport"] = this.getHTML('.balance').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("totesport: " + data["totesport"])
    })  
}

/////////////////
// 9. Betbright
/////////////////

if (config.betbright.email) {

    casper.userAgent(mobileUA)
    casper.thenOpen('https://m.betbright.com/login')

    casper.waitUntilVisible('#login-form', function() {
        casper.fillSelectors('#login-form', {
            'input[name="username"]': config.betbright.email,
            'input[name="password"]': config.betbright.password
        }, true)
    })

    casper.waitUntilVisible('#customer_balance', function() {
        data["betbright"] = this.getHTML('#customer_balance').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("betbright: " + data["betbright"])
    }) 
}

/////////////////
// 10. Vernons
/////////////////

if (config.vernons.username) {

    casper.userAgent(desktopUA)
    casper.thenOpen('https://www.vernons.com')

    casper.waitUntilVisible('#forms-playtech-login-form', function() {
        casper.fillSelectors('#forms-playtech-login-form', {
            'input[name="username"]': config.vernons.username,
            'input[name="password"]': config.vernons.password
        }, true)
    })

    casper.waitUntilVisible('.amount', function() {
        data["vernons"] = this.getHTML('.amount').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("vernons: " + data["vernons"])
    }) 
}

/////////////////
// 11. 32Red
/////////////////

// TODO


/////////////////
// 11. Titanbet
/////////////////

if (config.titanbet.username) {

    casper.userAgent(mobileUA)
    casper.thenOpen('https://m.titanbet.co.uk/en')

    casper.wait(5000)

    casper.waitForSelector('#mobile-main-area > div.fragment.mobile-header > div.main-content > a.do-login', function() {
        this.click('#mobile-main-area > div.fragment.mobile-header > div.main-content > a.do-login')
    })

    casper.waitUntilVisible('body > div.cms-contents.popup-visible > div.popup-container.visible > div > div > div > form', function() {
        this.fill('body > div.cms-contents.popup-visible > div.popup-container.visible > div > div > div > form', {
            'username': config.titanbet.username,
            'password': config.titanbet.password
        }, true)
    })

    casper.waitUntilVisible('body > div.cms-contents.popup-visible > div.popup-container.visible > div > div > form > div.buttons > button:nth-child(5)', function() {
        this.click('body > div.cms-contents.popup-visible > div.popup-container.visible > div > div > form > div.buttons > button:nth-child(5)')
    }, function() {

    })

    casper.waitUntilVisible('#mobile-main-area > div.fragment.mobile-header > div.main-content > a.go-account', function() {
        data["titanbet"] = this.getHTML('#mobile-main-area > div.fragment.mobile-header > div.main-content > a.go-account').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("titanbet: " + data["titanbet"])
    })
}

/////////////////
// 12. Unibet
/////////////////

// TODO

/////////////////
// 13. Coral
/////////////////

if (config.coral.username) {
    casper.userAgent(desktopUA)
    casper.thenOpen('http://sports.coral.co.uk/')

    casper.waitUntilVisible('#top-login', function() {
        this.sendKeys('#top-login', config.coral.username)
        this.sendKeys('#top-password', config.coral.password)
        this.click('#top-login-form > div.buttons-wrapper.login-wrapper > button.login-button')
    })

    casper.waitUntilVisible('#balance-text > span.account-balance-value', function() {
        data["coral"] = this.getHTML('#balance-text > span.account-balance-value').match(regex).map(function(v) { return parseFloat(v); });
        this.echo("coral: " + data["coral"])
    }) 
}


// Run
casper.run(function() {
    // Write balances to json file
    j = JSON.stringify(data)
    fs.write('balances.json', j, 'w')

    var _this = this;
    _this.page.close();

    setTimeout(function exit(){
        _this.exit(0);
    }, 0);
});
