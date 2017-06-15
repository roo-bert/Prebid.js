var utils = require('../utils.js');
var bidfactory = require('../bidfactory.js');
var bidmanager = require('../bidmanager.js');
var adloader = require('../adloader');

var YieldlabAdapter = function YieldlabAdapter() {
    var pro = (document.location.protocol === 'https:' ? 'https:' : 'http:');
    var random = Math.floor((Math.random() * 1e9) + 1);
    var _bidderCode ="yieldlab";
    var bidarr = [];
    var prebaseUrl = '//ad.yieldlab.net/yp/',
        posbaseUrl = '?ts=' + random,// +'&json=true',
        handlerPrefix = 'adYieldlabHandler_',

        LOG_ERROR_MESS = {
            noUnit: 'Bid has no unit',
            JSON: 'Error parsing JSON',
            noAdTag: 'Bid has missmatch format.',
            noBid: 'Response has no bid.',
            anotherCode: 'Bid has another bidderCode - ',
            undefBid: 'Bid is undefined',
            unitNum: 'Requested unit is '
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

    function _makeHandler(handlerName, sizesstring, placementCode, bid, querry) {
        return function(response) {
            try {
                delete window[handlerName];
            } catch (err) { // catching for old IE
                window[handlerName] = undefined;
            }
            _responseProcessing(response, sizesstring, placementCode, bid, querry);
        };
    };

    // Collector from Bids to send just a single Request Missing. Needed a split for Creatives to send to AdServer as well.

    function _sendBidRequest(bidarr) {
        var querry = [];
        var sizesstring = "";
        if (bidarr.length < 1) {
            // throw exception, or call utils.logError
            utils.logError(LOG_ERROR_MESS.noUnit, _bidderCode);
            return;
        }
        else
        {
            for(var i = 0; i < bidarr.length; i++){
                if(alreadyinArray(querry,bidarr[i].params.placements)){
                    querry.push(bidarr[i].params.placements);
                    var placements = bidarr[i];
                    if (placements.sizes.length > 0) {
                        for (var iii = 0; iii < placements.sizes.length; iii++) {
                            sizesstring += placements.params.placements + ":" + placements.sizes[iii][0] + "x" + placements.sizes[iii][1] + ",";
                        }
                    };
                };
            };
        sizesstring = sizesstring.slice(0, sizesstring.length - 1);

        // make handler name for request
        var querryS = querry.toString();
        var handlerName = handlerPrefix;
        window[handlerName] = _makeHandler(handlerName, sizesstring, bidarr.placementCode, bidarr, querry);
        adloader.loadScript(pro + prebaseUrl + querryS + posbaseUrl , window[handlerName],);
        }
    }

    /*
     {
     "id":2117502,
     "price":150,
     "advertiser":"yieldlab",
     "curl":"http://www.yieldlab.de",
     "format":0
     }
     */

    function _responseProcessing(resp, sizesstring, placementCode, bid, querry) {

        if(yl.YpResult.getAll()){
        var resp = yl.YpResult.getAll();//parseBidResponse(resp);
        }
        var bid = bid;
        var callObjectPlacementCode =[];
        var callObjectId =[];
        var placementBids = [];
        // register the bid response
        if (resp) {
            for (var i = 0; i < bid.length; i++) {
                var bidObject ={};
                var placementCode = bid[i].placementCode;
                var respS = JSON.stringify(resp);
                if(respS.indexOf(bid[i].params.placements)>-1) {
                    var o = bid[i].params.placements;
                    var obj = resp;
                    obj.o = o;
                    obj = obj[obj.o];
                    if (o == obj.id) {
                        if(alreadyinArray(callObjectPlacementCode,placementCode)){
                            callObjectPlacementCode.push(placementCode);
                        };
                        bidObject = {};
                        var size = "";
                        var width = "";
                        var height = "";
                        var Sform = "";
                        var YLid = "";
                        size = bid[i].params.size;

                        bidObject = bidfactory.createBid(1);
                        bidObject.bidderCode = _bidderCode;
                        bidObject.cpm = obj.price;
                        if(bid[i].params.format=="Wallpaper"){Sform="101"};//Wallpaper
                        if(bid[i].params.format=="Sidebar"){Sform="119"};//Sidebar
                        var deal = "YLFormat:"+Sform+" YLURL:"+obj.curl;
                        bidObject.dealId = deal;
                        var content = "<scr" + "ipt ipt type='text/javascript' language='JavaScript' src='"+pro+"//ad.yieldlab.net/d/" + obj.id + "/2117490/"+size+"?ts=" + random +"'></scr" + "ipt>";
                        bidObject.ad = content;
                        bidObject.width = size.split("x")[0];
                        bidObject.height = size.split("x")[1];
                        bidObject.YLid = obj.id;

                        bidObject.placementCode = placementCode;
                        if(placementBids[placementCode]){}else{placementBids[placementCode] = []}
                        placementBids[placementCode].push(bidObject);
                    }
                }
            }
            for (var i = 0; i < callObjectPlacementCode.length; i++) {
                var a = "";
                var b = 0;
                var c = {};
                for (var ii = 0; ii < placementBids[callObjectPlacementCode[i]].length; ii++) {
                    if(parseFloat(placementBids[callObjectPlacementCode[i]][ii].cpm) > parseFloat(b) && alreadyinArray(callObjectId,placementBids[callObjectPlacementCode[i]][ii].YLid)){
                        a = placementBids[callObjectPlacementCode[i]][ii].placementCode;
                        b = placementBids[callObjectPlacementCode[i]][ii].price;
                        c = placementBids[callObjectPlacementCode[i]][ii];
                        callObjectId.push(placementBids[callObjectPlacementCode[i]][ii].YLid)
                    }
                }
            bidmanager.addBidResponse(a, c);
            }
        } else {
            bidObject = _invalidBidResponse();
        }
    };

        function _invalidBidResponse() {
            var bidObject = bidfactory.createBid(2);
            bidObject.bidderCode = _bidderCode;
            return bidObject;
        }

        function _callBids(params) {
            var bid, bids = params.bids || [];
            for (var i = 0; i < bids.length; i++) {
                bid = bids[i];
                if (bid && bid.bidder === _bidderCode) {
                    bidarr.push(bid);
                }
            };
            _sendBidRequest(bidarr);
        };

    return {
        callBids: _callBids
    };
};

module.exports = YieldlabAdapter;
