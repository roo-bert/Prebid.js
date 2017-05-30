var utils = require('../utils.js');
var bidfactory = require('../bidfactory.js');
var bidmanager = require('../bidmanager.js');
var adloader = require('../adloader');

var YieldlabAdapter = function YieldlabAdapter() {
    var pro = (document.location.protocol === 'https:' ? 'https:' : 'http:');
    var random = Math.floor((Math.random() * 1e9) + 1);
    var _bidderCode ="";
    var prebaseUrl = '//ad.yieldlab.net/yp/',
        posbaseUrl = '?ts=' + random,// +'&json=true',
        bidderCode = 'yieldlab',
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

    function _makeHandler(handlerName, sizesstring, placementCode, bid, querry) {
        return function(response) {
            try {
                delete window[handlerName];
            } catch (err) { // catching for old IE
                window[handlerName] = undefined;
            }
            _responseProcessing(response, sizesstring, placementCode, bid, querry);
        };
    }

    function _sendBidRequest(bid) {
        _bidderCode = bid.bidder;
        var querry = "";
        var placements = bid.params.placements;
        if (placements.length < 1 || !placements[0].placementId) {
            // throw exception, or call utils.logError
            utils.logError(LOG_ERROR_MESS.noUnit, bidderCode);
            return;
        }
        for (var i = 0; i < placements.length; i++) {
            var placement = placements[i];
            if (placement) {
                querry += placement.placementId + ",";
            }
        }
        querry = querry.slice(0, querry.length - 1);
        var sizesstring = "";
        if (bid.sizes.length > 0) {
            for (var i = 0; i < placements.length; i++) {
                sizesstring += placements[i].placementId + ":" + placements[i].sizes[0] + "x" + placements[i].sizes[1] + ",";
            }
        }
        sizesstring = sizesstring.slice(0, sizesstring.length - 1);

        // make handler name for request
        var handlerName = handlerPrefix+bid.bidId;

        window[handlerName] = _makeHandler(handlerName, sizesstring, bid.placementCode, bid, querry);
        adloader.loadScript(pro + prebaseUrl + querry + posbaseUrl , window[handlerName],);
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
    /*function parseBidResponse(bidsResponse) {
        try {
            return JSON.parse(bidsResponse);
        } catch (error) {
            utils.logError(LOG_ERROR_MESS.JSON, bidderCode);
            return {};
        }
    }*/

    function _responseProcessing(resp, sizesstring, placementCode, bid, querry) {

        var bidObject;
        if(yl.YpResult.getAll()){
        var resp = yl.YpResult.getAll();//parseBidResponse(resp);
        }
        var placements = bid.params.placements;
        var bid = bid;

        // register the bid response
        if (resp) {
            var count = querry.split(",");

            for (var i = 0; i < count.length; i++) {
                var o = count[i].toString();
                var obj = resp;
                obj.o = o;
                obj = obj[obj.o];
                bidObject = "";
                var size = "";
                var width = "";
                var height = "";
                for (var i = 0; i < placements.length; i++) {
                    if (placements[i].placementId == obj.id) {
                        size = placements[i].sizes[0] + "x" + placements[i].sizes[1];
                        width = placements[i].sizes[0];
                        height = placements[i].sizes[1];
                    }
                }
                bidObject = bidfactory.createBid(1);
                bidObject.bidderCode = _bidderCode;
                bidObject.cpm = obj.price;
                bidObject.cpm = Number(bidObject.cpm / 100);
                var content = "<scr" + "ipt ipt type='text/javascript' language='JavaScript' src='"+pro+"//ad.yieldlab.net/d/" + obj.id + "/" + obj.format + "/"+size+"?ts=" + random +"'></scr" + "ipt>";
                bidObject.ad = content;
                bidObject.width = width;
                bidObject.height = height;
                bidmanager.addBidResponse(placementCode, bidObject);
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
                if (bid && bid.bidder === bidderCode) {
                    _sendBidRequest(bid);
                }
            }
        };

    return {
        callBids: _callBids
    };
};

module.exports = YieldlabAdapter;
