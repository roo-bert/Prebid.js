var PREBID_TIMEOUT = 5000;
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];
pbjs.logging = true;

var urbanPreBidWrapper = function(slots,urbanid) {
    try {
        if (pbjs.logging) {
            console.log("try to init prebid");
            console.log(slots);
            console.log(urbanid);
        };
        var sendAdserverRequest;
        if (slots.length>0) {
            if(pbjs.urbanbidscycle){pbjs.urbanbidscycle = pbjs.urbanbidscycle+1;urban.configQueue[0].headerbiddingcycle=urban.configQueue[0].headerbiddingcycle+1}else{pbjs.urbanbidscycle=1;urban.configQueue[0].headerbiddingcycle=1;}
            urban.configQueue[0].headerbiddingloaded = false;
            if (pbjs.adserverRequestSent){pbjs.adserverRequestSent=false;};
            if (pbjs.logging) {
                console.log("init prebid sucessfull");
            }
            var urbanbidderconfig = [{
                    bidder: 'openx',
                    params: {
                        sizes: [{
                            size: '300x600',
                            id: '539057691',
                            pl: 'medrec'
                        }, {
                            size: '300x600',
                            id: '539057693',
                            pl: 'right'
                        }, {
                            size: '300x600',
                            id: '539057693',
                            pl: 'gallery'
                        }, {
                            size: '800x250',
                            id: '539057690',
                            pl: 'leader'
                        }, {
                            size: '728x90',
                            id: '539057692',
                            pl: 'leader'
                        }, {
                            size: '300x250',
                            id: '539057694',
                            pl: 'mobile'
                        }],
                        placementnameing: 'unit',
                        addStringtocall: 'delDomain:urbanmedia-d.openx.net'
                    }
                },
                {
                    bidder: 'yieldlab',
                    params: {
                        sizes: [{
                            size: '300x600',//Sidebar
                            id: '2146120',
                            pl: 'right',
                            format: 'Sidebar'
                        }, {
                            size: '728x90',//Wallpaper
                            id: '2146121',
                            pl: 'leader',
                            format: 'Wallpaper'
                        }, {
                            size: '300x250',
                            id: '2146113',
                            pl: 'medrec'
                        }, {
                            size: '300x250',
                            id: '2146114',
                            pl: 'medrec'
                        }, {
                            size: '300x600',
                            id: '2146115',
                            pl: 'medrec'
                        }, {
                            size: '300x600',
                            id: '2146116',
                            pl: 'medrec'
                        }, {
                            size: '300x600',
                            id: '2146115',
                            pl: 'right'
                        }, {
                            size: '300x600',
                            id: '2146116',
                            pl: 'right'
                        }, {
                            size: '300x600',
                            id: '2146115',
                            pl: 'gallery'
                        }, {
                            size: '300x600',
                            id: '2146116',
                            pl: 'gallery'
                        }, {
                            size: '300x600',
                            id: '2146117',
                            pl: 'medrec'
                        }, {
                            size: '300x600',
                            id: '2146117',
                            pl: 'right'
                        }, {
                            size: '728x90',
                            id: '2146118',
                            pl: 'leader'
                        }, {
                            size: '800x250',
                            id: '2146119',
                            pl: 'leader'
                        }, {
                            size: '160x600',
                            id: '2146112',
                            pl: 'right'
                        }, {
                            size: '160x600',
                            id: '2146112',
                            pl: 'gallery'
                        }, {
                            size: '300x250',
                            id: '2146122',
                            pl: 'mobile'
                        }, {
                            size: '300x50',
                            id: '2146123',
                            pl: 'mobile'
                        }],
                        placementnameing: 'placements',
                        addStringtocall: ''
                    }
                },
                {
                    bidder: 'criteo',
                    params: {
                        sizes: [{
                            size: '300x600',
                            id: '773763',
                            pl: 'right'
                        },{
                            size: '300x600',
                            id: '773763',
                            pl: 'gallery'
                        }, {
                            size: '300x600',
                            id: '773765',
                            pl: 'medrec'
                        }, {
                            size: '300x600',
                            id: '773765',
                            pl: 'right'
                        }, {
                            size: '300x250',
                            id: '791583',
                            pl: 'medrec'
                        }, {
                            size: '300x250',
                            id: '773764',
                            pl: 'mobile'
                        }, {
                            size: '728x90',
                            id: '773766',
                            pl: 'leader'
                        }, {
                            size: '800x250',
                            id: '773767',
                            pl: 'leader'
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
            var urbanSlotInitConfig = slots;
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
                if (a.name && a.size) {
                    splitAndPush(sizes, buildsize(a.size));
                    codes.push(a.name);
                    codeSizes.push({
                        adcode: a.name,
                        sizes: a.size,
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
                        if (biddies[i].code === urbanSlotInitConfig[j].name) {
                            c = urbanSlotInitConfig[j].size;
                            var abidder = [];
                            for (var k = 0; k < urbanbidderconfig.length; k++) {
                                for (var l = 0; l < urbanbidderconfig[k].params.sizes.length; l++) {
                                    if (biddies[i].code.indexOf(urbanbidderconfig[k].params.sizes[l].pl)>-1 && biddies[i].size == urbanbidderconfig[k].params.sizes[l].size) {
                                        var a = "default";
                                        console.log(urbanbidderconfig[k].params.sizes)
                                        if(urbanbidderconfig[k].params.sizes[l].format){
                                            a = urbanbidderconfig[k].params.sizes[l].format;
                                        };
                                        var b = "default";
                                        if(urbanbidderconfig[k].params.addStringtocall){
                                            b = urbanbidderconfig[k].params.addStringtocall;
                                        };
                                        var c = "placement";
                                        if(urbanbidderconfig[k].params.placementnameing){
                                            c = urbanbidderconfig[k].params.placementnameing;
                                        };
                                        var bidderOBJ = {
                                            'bidder': urbanbidderconfig[k].bidder,
                                            'id': urbanbidderconfig[k].params.sizes[l].id,
                                            'size': urbanbidderconfig[k].params.sizes[l].size,
                                            'format': a,
                                            'placementnameing': c,
                                            'addStringtocall': b
                                        };
                                        if (pbjs.logging) {console.log(bidderOBJ)}
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
                            p.format = urbanSlotInitConfig[ii].headerBidderInfo.bidder[ik].format;
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
                            'code': "urban-" + urbanSlotInitConfig[ii].name,
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
                pbjs.urbanbids = urbanSlotInitConfig;
                var prebidloadedEvent = document.createEvent('CustomEvent');
                prebidloadedEvent.initCustomEvent('prebidloaded', true, true, urbanid);
                document.dispatchEvent(prebidloadedEvent);
            };

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
                for (var i = 0; i < UrbanUnits.length; i++) {
                pbjs.que.push(function() {
                    pbjs.removeAdUnit(UrbanUnits[i].code);});
                };
                setTimeout(function() { callbacksender(); }, 10);
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
                            })(), bidderReady = !0, sendAdserverRequest(), clearTimeout(prebidtimer)
                        }
                    });
                    if (pbjs.logging) {
                        console.log("request Bids")
                    }
                });
                if (pbjs.logging) {
                    console.log(pbjs.que);
                    console.log("bids recived: ")
                    console.log(pbjs._bidsReceived)
                }

                var prebidtimer = window.setTimeout(function() {
                    sendAdserverRequest();
                    if (pbjs.logging) {
                        console.log("Auction timed out")
                    };
                }, PREBID_TIMEOUT);
            };
            urbanlaunchbidder();

        }
        else{
            sendAdserverRequest();
            if (pbjs.logging) {
                console.log("Auction failed no slots send")
            };
        };
    } catch (e) {
        if (pbjs.logging) {
            console.log(e)
        };
    }
};
