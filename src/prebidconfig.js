var PREBID_TIMEOUT = 5000;
var urbanLOOP = false;
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];
pbjs.logging = true;

//DFP perdefinitio
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
    googletag.pubads().disableInitialLoad();
});

(function() {
    var urbanPreBidWrapper = function() {
        try {
            if (pbjs.logging) {
                console.log("try to init prebid")
            };
            if (urban.configQueue[0].slots) {
                if (pbjs.logging) {
                    document.addEventListener('prebidloaded', function(e) {
                        console.log("Send trigger for loaded to URBAN-JS")
                    }, false);
                    console.log(urban.configQueue[0].slots);
                    console.log(pbjs);
                }
                urban.configQueue[0].headerbiddingloaded = false;
                if (pbjs.logging) {
                    console.log("init prebid sucessfull");
                }
                var urbanbidderconfig = [{
                        bidder: 'openx',
                        params: {
                            sizes: [{
                                size: '300x250',
                                id: '538971715'
                            }, {
                                size: '300x600',
                                id: '538971715'
                            }],
                            placementnameing: 'unit',
                            addStringtocall: 'delDomain:urbanmedia-d.openx.net'
                        }
                    },
                    {
                        bidder: 'yieldlab',
                        params: {
                            sizes: [{
                                size: '300x250',
                                id: '2117509'
                            }, {
                                size: '300x600',
                                id: '2117507'
                            }],
                            placementnameing: 'placements',
                            addStringtocall: ''
                        }
                    },
                    {
                        bidder: 'criteo',
                        params: {
                            sizes: [{
                                size: '300x250',
                                id: '773765'
                            }, {
                                size: '300x600',
                                id: '773765'
                            }],
                            placementnameing: 'zoneId',
                            addStringtocall: ''
                        }
                    }
                ];
                if (pbjs.logging) {
                    console.log("Bidder-Config init done");
                    console.log(urbanbidderconfig)
                };
                var urbanSlotInitConfig = urban.configQueue[0].slots;
                var sizes = []; // Array of serached sizes
                var codes = []; // Array of serached codes
                var codeSizes = []; // Array of sizes per placement
                var bsizes = [];
                var biddies = [];
                var obj = {};

                var buildsize = function(arr) {
                    if (Object.prototype.toString.call(arr) === '[object Array]') {
                        var b = [];
                        for (var i = 0; i < arr.length; i++) {
                            var a = arr[i];
                            if (a[0] && a[1]) {
                                b.push(a[0] + "x" + a[1])
                            }
                        }
                        return b
                    } else {
                        return arr
                    }
                };
                var alreadyinArray = function(t, p) {
                    var s = true;
                    if (pbjs.logging) {
                        console.log(t);
                        console.log(p);
                    }
                    for (var i = 0; i < t.length; i++) {
                        if (String(p) == String(t[i])) {
                            s = false;
                        }
                    }
                    return s
                };

                var splitAndPush = function(t, p) {
                    if (t && p) {
                        if (Object.prototype.toString.call(p) === '[object Array]') {
                            var a = p;
                            for (var i = 0; i < a.length; i++) {
                                var b = a[i];
                                if (alreadyinArray(t, b)) {
                                    t.push(String(b));
                                }
                            }
                        } else {
                            if (typeof p === 'string') {
                                if (p.indexOf(",") > -1) {
                                    var a = p.split(",");
                                    for (var i = 0; i < a.length; i++) {
                                        var b = a[i];
                                        if (alreadyinArray(t, b)) {
                                            t.push(String(b));
                                        }
                                    }
                                } else {
                                    if (alreadyinArray(t, p)) {
                                        t.push(String(p));
                                    }
                                }
                            }
                        }
                    }
                }

                for (var i = 0; i < urbanbidderconfig.length; i++) {
                    for (var j = 0; j < urbanbidderconfig[i].params.sizes.length; j++) {
                        if (alreadyinArray(bsizes, urbanbidderconfig[i].params.sizes[j].size)) {
                            bsizes.push(urbanbidderconfig[i].params.sizes[j].size);
                        }
                    }
                }

                for (var i = 0; i < urbanSlotInitConfig.length; i++) {
                    var a = urbanSlotInitConfig[i];
                    if (a.unit && a.size) {
                        splitAndPush(sizes, buildsize(a.size));
                        codes.push(a.unit);
                        codeSizes.push({
                            adcode: a.unit,
                            sizes: a.size
                        });
                        urbanSlotInitConfig[i].headerBidderInfo = {
                            bidder: 'no bidder found for this placement(default msg)',
                            error: 'No error. All riunning as expected (default msg)'
                        };
                    }
                };

                if (pbjs.logging) {
                    console.log(sizes);
                    console.log(codes);
                    console.log(codeSizes);
                    console.log("appending to urban config done");
                };

                // URBAN-MEDIA PUB-CONFIG IMPORT
                var UrbanUnits = [];

                var pushbids = function(code, size) {
                    biddies.push({
                        'size': size,
                        'code': code
                    });
                };

                if (urbanbidderconfig && sizes && codes && codeSizes) {
                    for (var i = 0; i < codeSizes.length; i++) {
                        var b = [];
                        if (Object.prototype.toString.call(codeSizes[i].sizes) === '[object Array]') {
                            for (var j = 0; j < codeSizes[i].sizes.length; j++) {
                                var s = codeSizes[i].sizes[j][0] + "x" + codeSizes[i].sizes[j][1];
                                if (!alreadyinArray(bsizes, s)) {
                                    pushbids(codeSizes[i].adcode, s);
                                }
                            }
                        } else if (codeSizes.sizes == "out-of-page") {
                            if (!alreadyinArray(bsizes, codeSizes.sizes)) {
                                pushbids(codeSizes[i].adcode, codeSizes.sizes);
                            }
                        }
                    };
                    var bidsforbidder = [];
                    for (var i = 0; i < biddies.length; i++) {
                        var c = "";
                        for (var j = 0; j < urbanSlotInitConfig.length; j++) {
                            if (biddies[i].code == urbanSlotInitConfig[j].unit) {
                                c = urbanSlotInitConfig[j].size;
                                var abidder = [];
                                for (var k = 0; k < urbanbidderconfig.length; k++) {
                                    for (var l = 0; l < urbanbidderconfig[k].params.sizes.length; l++) {
                                        if (biddies[i].size == urbanbidderconfig[k].params.sizes[l].size) {
                                            var bidderOBJ = {
                                                'bidder': urbanbidderconfig[k].bidder,
                                                'id': urbanbidderconfig[k].params.sizes[l].id,
                                                'size': urbanbidderconfig[k].params.sizes[l].size,
                                                'placementnameing': urbanbidderconfig[k].params.placementnameing,
                                                'addStringtocall': urbanbidderconfig[k].params.addStringtocall
                                            };
                                            abidder.push(bidderOBJ);
                                        }
                                        if (abidder.length > 0) {
                                            urbanSlotInitConfig[j].headerBidderInfo.bidder = abidder;
                                        }
                                    }
                                }
                            };
                        };
                    };
                    for (var ii = 0; ii < urbanSlotInitConfig.length; ii++) {
                        if (typeof urbanSlotInitConfig[ii].headerBidderInfo.bidder != 'string') {
                            if (pbjs.logging) {
                                console.log(urbanSlotInitConfig[ii].headerBidderInfo);
                            }
                            for (var ik = 0; ik < urbanSlotInitConfig[ii].headerBidderInfo.bidder.length; ik++) {
                                var p = {};
                                var s = urbanSlotInitConfig[ii].headerBidderInfo.bidder[ik].addStringtocall;
                                var a = urbanSlotInitConfig[ii].headerBidderInfo.bidder[ik].placementnameing;
                                p[a] = urbanSlotInitConfig[ii].headerBidderInfo.bidder[ik].id;
                                p.size = urbanSlotInitConfig[ii].headerBidderInfo.bidder[ik].size;
                                if (!s.indexOf(",") > -1 && s.indexOf(":") > -1) {
                                    var ss = s.split(":");
                                    p[ss[0]] = ss[1];
                                };
                                bidsforbidder.push({
                                    'bidder': urbanSlotInitConfig[ii].headerBidderInfo.bidder[ik].bidder,
                                    'params': p,
                                });
                            };
                            obj = {
                                'code': "urban-" + urbanSlotInitConfig[ii].unit,
                                'sizes': urbanSlotInitConfig[ii].size,
                                bids: bidsforbidder
                            };
                            UrbanUnits.push(obj);
                            bidsforbidder = [];
                            obj = {};
                        };
                    };
                };
                var callbacksender = function() {
                    var prebidloadedEvent = document.createEvent('Event');
                    prebidloadedEvent.initEvent('prebidloaded', true, true);
                    document.dispatchEvent(prebidloadedEvent);
                }


                var sendAdserverRequest = function() {
                    if (pbjs.logging) {
                        console.log("Adding AdServerrequest");
                    }
                    if (pbjs.adserverRequestSent) return;
                    pbjs.adserverRequestSent = true;
                    if (pbjs.logging) {
                        console.log(pbjs.adserverRequestSent);
                        console.log("Check for AdServersettings");
                    }
                    googletag.cmd.push(function() {
                        pbjs.enableSendAllBids(); // send all Bids to DFP
                        pbjs.que.push(function() {
                            pbjs.setTargetingForGPTAsync();
                            //googletag.pubads().refresh();
                            console.log("GTP-CMD-Push")
                            console.log(googletag.pubads().getTargetingKeys());
                        });
                    });
                    callbacksender();
                    urban.configQueue[0].headerbiddingloaded = true;
                };

                var urbanlaunchbidder = function() {
                    if (pbjs.logging) {
                        console.log("in urbanlaunchbidder pushing to pbjs que");
                        console.log(pbjs);
                        console.log("Push Config to Prebid Que");
                        console.log(UrbanUnits);
                    }
                    pbjs.que.push(function() {
                        pbjs.addAdUnits(UrbanUnits);
                    });
                    if (pbjs.logging) {
                        console.log("Push Config to Prebid Que ...  DONE");
                    }

                    <!-- Prebid Config Section END -->

                    <!-- Prebid Boilerplate Section START. No Need to Edit. -->

                    if (pbjs.logging) {
                        console.log("Init Bids from Prebid");
                        console.log(pbjs.que);
                    }
                    pbjs.que.push(function() {
                        pbjs.requestBids({
                            bidsBackHandler: function(a) {
                                "object" == typeof console && (function() {
                                    if (pbjs.logging) {
                                        console.log(a); pbjs.urbanbids = a;
                                    } else {
                                        console.log("Bidding OK")
                                    }
                                })(), bidderReady = !0, sendAdserverRequest()
                            }
                        });
                        if (pbjs.logging) {
                            console.log("request Bids")
                        }
                    });
                    if (pbjs.logging) {
                        console.log(pbjs.que);
                    }

                    setTimeout(function() {
                        sendAdserverRequest();
                        if (pbjs.logging) {
                            console.log("Auction timed out")
                        }
                    }, PREBID_TIMEOUT);
                };

                var bidderque = function() {
                    var i = 0;
                    if (pbjs.logging) {
                        console.log("Setting pbjs on hold for: " + i)
                    }
                    if (!pbjs && i < 10) {
                        i++;
                        window.setTimeout(function() {
                            bidderque()
                        }, 250)
                    } else if (pbjs) {
                        urbanlaunchbidder();
                        if (pbjs.logging) {
                            console.log("urbanlaunchbidder init")
                        }
                    } else {
                        if (pbjs.logging) {
                            console.log("Error loading pbjs")
                        }
                    }
                };
                bidderque();

            }
        } catch (e) {
            if (pbjs.logging) {
                console.log(e)
            };
            if (!urbanLOOP) {
                document.addEventListener('urbanInitialized', function(e) {
                    urbanPreBidWrapper();
                }, false);
                urbanLOOP = true;
                if (pbjs.logging) {
                    console.log("failed loading urban-config for Urban-JS CsallBack retry soon");
                }
            } else {
                if (pbjs.logging) {
                    console.log("cancel loading prebidder");
                }
            };
        }
    };
    urbanPreBidWrapper();
})();
