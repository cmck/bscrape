"use strict";
phantom.casperTest = true;

var config = require('./config.js');
var fs = require('fs');

var regex = /[+-]?\d+(\.\d+)?/g;
var desktopUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36';
var mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
var data = {};
var balanceSelectors = {};

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function parseBalance(html) {
    var errorMsg = "Error: Selector not found";
    return (isEmpty(html) ? errorMsg : html.match(regex).map(function(v) { return parseFloat(v); })[0]);
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
        resourceTimeout: 10000
    }
});
casper.start();


/////////////////
// Coral
/////////////////

if (config.coral.enabled) {

    casper.then(function() {
        this.userAgent(mobileUA);
    });

    casper.thenOpen('https://mobile.coral.co.uk/sportsbook/');

    casper.then(function() {
        this.waitForSelector('.innerTopShadow.c.ml4.button.top.gradBg6', function() {
            this.click('.innerTopShadow.c.ml4.button.top.gradBg6');
        });
    });

    casper.then(function() {
        this.waitForSelector('#username', function() {
            this.sendKeys('#username', config.coral.username);
            this.sendKeys('#password', config.coral.password);
            this.click('input[value="Sign In"]');
        });
    });

    casper.then(function() {
        balanceSelectors.coral = 'span[data-bind="balance"]';
        this.waitUntilVisible(balanceSelectors.coral, function() {
            data.coral = parseBalance(this.getHTML(balanceSelectors.coral));
            this.echo("coral: " + data.coral);
        });      
    });
}

/////////////////
// Paddy
/////////////////

if (config.betfair.enabled) {

    casper.then(function() {
        this.userAgent(mobileUA);
    });

    casper.thenOpen('https://iphone.paddypower.mobi/#!/')

    casper.then(function() {
        this.capture('p.png');
    });

    casper.then(function() {
        this.waitUntilVisible('#toolbar-login-button', function() {
            this.click('#toolbar-login-button');
        });
    });

    casper.then(function() {
        this.waitUntilVisible('#userName', function() {
            this.sendKeys('#userName', config.paddypower.username);
            this.sendKeys('#password', config.paddypower.password);
            this.click('#Login');
        });
    });

    casper.then(function() {
        balanceSelectors.paddypower = '.cl.b.ml5';
        this.waitForSelector(balanceSelectors.paddypower, function() {
            data.paddypower = parseBalance(this.getHTML(balanceSelectors.paddypower));
            this.echo("paddypower: " + data.paddypower);
        });
    });

}

///////////////
// Betway
/////////////////

if (config.betway.enabled) {

    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('https://sports.betway.com/');

    casper.then(function() {
        this.waitForSelector('#loginfieldUsername', function() {
            this.fillSelectors('#loginForm', {
                'input[name="username"]': config.betway.username,
                'input[name="password"]': config.betway.password
            });
            this.click('.loginbutton');
        });
    });

    casper.then(function() {
        balanceSelectors.betway = '#balance';
        this.waitForSelector(balanceSelectors.betway, function() {
            data.betway = parseBalance(this.getHTML(balanceSelectors.betway));
            this.echo("betway: " + data.betway);
        });
    });

    casper.then(function() {
        this.waitForSelector('.user_box_txt.logoutbutton', function() {
            this.click('.user_box_txt.logoutbutton');
        });
    });
}

/////////////////
// Betfred
/////////////////

if (config.betfred.enabled) {

    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('http://www.betfred.com/', function() {
        this.click('.login');
    });

    casper.then(function() {
        this.waitForSelector('#SignIn', function() {
            this.fillSelectors('#SignIn', {
                'input[name="LoginUserName"]': config.betfred.username,
                'input[name="LoginPassword"]': config.betfred.password
            });
            this.click('#login-button');
        });   
    });

    casper.then(function() {
        balanceSelectors.betfred = '#cashBalanceHeader';
        this.waitForSelector(balanceSelectors.betfred, function() {
            data.betfred = parseBalance(this.getHTML(balanceSelectors.betfred));
            this.echo("betfred: " + data.betfred);
        });
    });

    casper.thenOpen('http://www.betfred.com/logout.aspx');
}

/////////////////
// Stan James
/////////////////


/////////////////
// Betvictor
/////////////////

if (config.betvictor.enabled) { 

    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('http://www.betvictor.com/sports/en');

    // Assume Angular DOM fully loaded after this selector is visible
    casper.then(function() {
        this.waitUntilVisible('#chat_link');
    });

    casper.then(function() {
        this.waitUntilVisible('label[class="username"]', function() {
            this.sendKeys('#username', config.betvictor.username);
            this.sendKeys('#password', config.betvictor.password);
            this.click('#login_bar > div.login_form > form > button');
        });
    });

    casper.then(function() {
        balanceSelectors.betvictor = '#account_balance_amount > span.details';
        this.waitUntilVisible(balanceSelectors.betvictor, function() {
            data.betvictor = parseBalance(this.getHTML(balanceSelectors.betvictor));
            this.echo("betvictor: " + data.betvictor);
        });
    });

    casper.thenOpen('http://www.betvictor.com/sports/en/logout');
}

/////////////////
// William Hill
/////////////////

if (config.willhill.enabled) {

    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('https://sports.williamhill.com/bet/en-gb?action=GoAcct');

    casper.then(function() {
        this.waitUntilVisible('#login_username', function() {
            this.sendKeys('#login_username', config.willhill.username, {reset: true});
            this.sendKeys('#login_password', config.willhill.password, {reset: true});
            this.click('#submit_button');
        });
    });

    casper.then(function() {
        balanceSelectors.willhill = '#userBalance';
        this.waitForSelector(balanceSelectors.willhill, function() {
            data.willhill = parseBalance(this.getHTML(balanceSelectors.willhill));
            this.echo("william hill: " + data.willhill);
        }); 
    });
      
    casper.then(function() {
        this.waitForSelector('a[class="signOutLink linkable"]', function() {
            this.click('a[class="signOutLink linkable"]');
        });
    });
}

/////////////////
// Skybet
/////////////////

if (config.skybet.enabled) {    
    
    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('https://www.skybet.com/secure/identity/login/skybet');

    casper.then(function() {
        this.waitForSelector('#txt-login-uid-login-sso', function() {
            this.sendKeys('#txt-login-uid-login-sso', config.skybet.username);
            this.sendKeys('#txt-login-pin-login-sso', config.skybet.pin);
            this.click('#btn-login-submit-login-sso');
        });
    });

    casper.then(function() {
        balanceSelectors.skybet = '#js-balance';
        this.waitForSelector(balanceSelectors.skybet, function() {
            data.skybet = parseBalance(this.getHTML(balanceSelectors.skybet));
            this.echo("skybet: " + data.skybet);
        });
    });

    casper.thenOpen('https://www.skybet.com/secure/identity/logout');
}

/////////////////
// Ladbrokes
/////////////////

if (config.ladbrokes.enabled) {

    casper.then(function() {
        this.userAgent(mobileUA);
    });

    casper.thenOpen('https://m.ladbrokes.com/en-gb/#!login?redirectTarget=%3Ftab%3Dfeatured');

    casper.then(function() {
        this.waitForSelector('#login-submit-button', function() {
            this.sendKeys('#login_username', config.ladbrokes.username);
            this.sendKeys('#login_password', config.ladbrokes.password);
            this.click('#login-submit-button');
        });
    });

    casper.then(function() {
        this.waitUntilVisible('#balance > div.balance', function() {
            this.open('https://m.ladbrokes.com/user');    
        });
    });

    casper.then(function() {
        var json_string = JSON.parse(this.getPageContent());
        data.ladbrokes = json_string.balance;
        this.echo("ladbrokes: " + data.ladbrokes); 
    });

    casper.thenOpen('https://m.ladbrokes.com/en-gb/#!/en-gb/logout');
}

/////////////////
// Totesport
/////////////////

if (config.totesport.enabled) {

    casper.then(function() {
        this.userAgent(mobileUA);
    });

    casper.thenOpen('https://totesport.mobi/my-account/');

    casper.then(function() {
        this.waitUntilVisible('.help-overlay__ok-button', function() {
            if (this.exists('.help-overlay')) {
                this.evaluate(function() {
                    document.getElementById("element-id").outerHTML='';
                });
            }
        }); // TODO: use casper.thenBypassIf()
    });

    casper.then(function() {
        this.waitUntilVisible('.logon__input--username', function() {
            this.fillSelectors('.form.logon__form', {
                'input[name="LogonUsername"]': config.totesport.username,
                'input[name="LogonPassword"]': config.totesport.password
            }, true); 
        });
    });

    casper.then(function() {
        this.waitUntilVisible('.userDetails', function() {
            this.click('.icon__image--large');
        });  
    });

    casper.then(function() {
        balanceSelectors.totesport = '.balance';
        this.waitUntilVisible(balanceSelectors.totesport, function() {
            data.totesport = parseBalance(this.getHTML(balanceSelectors.totesport));
            this.echo("totesport: " + data.totesport);
        });    
    });
     
    casper.thenOpen('https://totesport.mobi/logout');
}

/////////////////
// Betbright
/////////////////

if (config.betbright.enabled) {

    casper.then(function() {
        this.userAgent(mobileUA);
    });

    casper.thenOpen('https://m.betbright.com/login');

    casper.then(function() {
        this.waitUntilVisible('#login-form', function() {
            this.fillSelectors('#login-form', {
                'input[name="username"]': config.betbright.email,
                'input[name="password"]': config.betbright.password
            }, true);
        });
    })

    casper.then(function() {
        balanceSelectors.betbright = '#customer_balance';
        this.waitUntilVisible(balanceSelectors.betbright, function() {
            data.betbright = parseBalance(this.getHTML(balanceSelectors.betbright));
            this.echo("betbright: " + data.betbright);
        });
    });

    casper.thenOpen('https://m.betbright.com/logout');
}

/////////////////
// Vernons
/////////////////

if (config.vernons.enabled) {

    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('https://www.vernons.com');

    casper.then(function() {
        this.waitUntilVisible('#forms-playtech-login-form', function() {
            this.fillSelectors('#forms-playtech-login-form', {
                'input[name="username"]': config.vernons.username,
                'input[name="password"]': config.vernons.password
            }, true);
        });
    })

    casper.then(function() {
        balanceSelectors.vernons = '.amount';
        this.waitUntilVisible(balanceSelectors.vernons, function() {
            data.vernons = parseBalance(this.getHTML(balanceSelectors.vernons));
            this.echo("vernons: " + data.vernons);
        }); 
    });

    casper.thenOpen('https://www.vernons.com/logout');
}

/////////////////
// 32Red
/////////////////

if (config.thirtytworedsport.enabled) {

    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('https://www.32redsport.com/');

    casper.then(function() {
        this.waitUntilVisible('#LoginUsername', function() {
            this.fillSelectors('#login-form', {
                'input[name="Login[username]"]': config.thirtytworedsport.username,
                'input[name="Login[password]"]': config.thirtytworedsport.password
            }, true);
        });
    });

    casper.thenOpen('https://www.32redsport.com/ajax/balance2.php', function() {
        data.thirtytworedsport = parseBalance(this.getHTML());
        this.echo("32 red sport: " + data.thirtytworedsport);
    });

    casper.thenOpen('https://www.32redsport.com/logout.html');
}

/////////////////
// Titanbet
/////////////////

if (config.titanbet.enabled) {

    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('http://sports.titanbet.co.uk/en');

    casper.then(function() {
        this.waitForSelector('input[name="username"]', function() {
            this.sendKeys('input[name="username"]', config.titanbet.username);
            this.sendKeys('input[name="password"]', config.titanbet.password);
            this.click('input[value="Log in"]');
        });
    });

    casper.then(function() {
        balanceSelectors.titanbet = '.total-balance-value';
        this.waitForSelectorTextChange(balanceSelectors.titanbet, function() {
            data.titanbet = parseBalance(this.getHTML(balanceSelectors.titanbet));
            this.echo("titanbet: " + data.titanbet);
        });
    });

    casper.then(function() {
        this.waitForSelector('button[title="Logout"]', function() {
           this.click('button[title="Logout"]'); 
        });
    });
}

///////////////
// Unibet
///////////////

if (config.unibet.enabled) {

    casper.then(function() {
        this.userAgent(mobileUA);
    });

    casper.thenOpen('https://www.unibet.co.uk', function() {
        this.waitUntilVisible('a[href="#openAccountMenu"]', function() {
            this.click('a[href="#openAccountMenu"]');
        });
    });

    casper.then(function() {
        this.waitUntilVisible('input[name="username"]', function() {
            this.sendKeys('input[name="username"]', config.unibet.username);
            this.sendKeys('input[name="password"]', config.unibet.password);
            this.click('button[name="button-login"]');
        });
    });

    casper.then(function() {
        balanceSelectors.unibet = '.total.total-amount';
        this.waitUntilVisible(balanceSelectors.unibet, function() {
            data.unibet = parseBalance(this.getHTML(balanceSelectors.unibet));
            this.echo("unibet: " + data.unibet);
        });
    });

    casper.thenOpen('https://www.unibet.co.uk/logout');
}

/////////////////
// Smarkets
/////////////////

if (config.smarkets.enabled) { 

    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('https://m.smarkets.com/members/login');

    casper.then(function() {
        this.waitForSelector('#login', function() {
            this.fill('#login', {
                'email': config.smarkets.email,
                'password': config.smarkets.password
            }, true);
        });
    });

    casper.then(function() {
        balanceSelectors.smarkets = '.balance';
        this.waitForSelector(balanceSelectors.smarkets, function() {
            data.smarkets = parseBalance(this.getHTML(balanceSelectors.smarkets));
            this.echo("smarkets: " + data.smarkets);
        });
    });

    casper.thenOpen('https://m.smarkets.com/members/logout');
}

/////////////////
// Betfair
/////////////////

if (config.betfair.enabled) {

    casper.then(function() {
        this.userAgent(desktopUA);
    });

    casper.thenOpen('https://myaccount.betfair.com/summary/accountsummary');

    casper.then(function() {
        this.waitForSelector('form.ssc-lif', function() {
            this.fill('form.ssc-lif', {
                'username': config.betfair.username,
                'password': config.betfair.password
            }, true);
        });  
    })

    casper.then(function() {
        balanceSelectors.betfair = '.amount.r-availableToBet';
        this.waitForSelector(balanceSelectors.betfair, function() {
            data.betfair = parseBalance(this.getHTML(balanceSelectors.betfair));
            this.echo("betfair: " + data.betfair);
        });
    });

    casper.then(function() {
        this.waitUntilVisible('.ssc-un', function() {
            this.click('.ssc-un');
        });
        this.waitUntilVisible('#ssc-lis', function() {
            this.click('#ssc-lis');
        });
    });
}

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
