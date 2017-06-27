'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

var data={};

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {

        if (req.body) {
            var body = req.body;
            var mailId='';

            switch(body.result.action){
                case 'asdaItem':
                for(var i of body.result.contexts){
                    if(i.name=='mail-set'){
                        mailId=i.parameters.mailId;
                    }
                }
                data[mailId]={'item':body.result.parameters.item.toUpperCase(), 'tab':'browse', 'orderLocation':null, 'orderList':null};
                return res.json({
                        speech: 'Please open asda app on mobile. Would you like to view related offers?',
                        displayText: 'Please open asda app on mobile. Would you like to view related offers?',
                        source: 'apiai-webhook'
                    });
                break;

                case 'asdaOffers':
                for(var i of body.result.contexts){
                    if(i.name=='mail-set'){
                        mailId=i.parameters.mailId;
                    }
                }
                data[mailId].tab='offers';
                data[mailId].orderLocation=null;
                return res.json({
                        speech: 'Offers displayed on app',
                        displayText: 'Offers displayed on app',
                        source: 'apiai-webhook'
                    });
                break;

                case 'asdaTrack':
                for(var i of body.result.contexts){
                    if(i.name=='mail-set'){
                        mailId=i.parameters.mailId;
                    }
                }
                var location='53.792033,-1.545054';
                data[mailId].tab='track';
                data[mailId].orderLocation=location;
                return res.json({
                        speech: 'Order tracking info displayed on app',
                        displayText: 'Order tracking info displayed on app',
                        source: 'apiai-webhook'
                    });
                break;

                case 'asdaList':
                for(var i of body.result.contexts){
                    if(i.name=='mail-set'){
                        mailId=i.parameters.mailId;
                    }
                }
                var list='';
                for(var i of body.result.parameters.itemList){
                    list=list+i+',';
                }
                list=list.slice(0,list.length-1);
                if(data[mailId]){
                    data[mailId].tab='list';
                    data[mailId].orderList=list;
                }
                else{
                    data[mailId]={'item':null, 'tab':'list', 'orderLocation':null, 'orderList':list};
                }
                return res.json({
                        speech: 'Did I miss any items?',
                        displayText: 'Did I miss any items?',
                        source: 'apiai-webhook'
                    });
                break;

                case 'asdaListMore':
                for(var i of body.result.contexts){
                    if(i.name=='mail-set'){
                        mailId=i.parameters.mailId;
                    }
                }
                data[mailId].tab='list';
                var list='';
                for(var i of body.result.parameters.itemList){
                    list=list+i+',';
                }
                list=list.slice(0,list.length-1);
                data[mailId].orderList=data[mailId].orderList+','+list;
                return res.json({
                        speech: 'Our best picks are displayed on your app',
                        displayText: 'Our best picks are displayed on your app',
                        source: 'apiai-webhook'
                    });
                break;
            }
        }

        return res.json({
            speech: 'Webhook input error',
            displayText: 'Webhook input error',
            source: 'apiai-webhook'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.post('/mobileapp', function (req, res) {

    var mailId='';
    console.log('mobileapp request');

    try {

        if (req.body) {
            mailId=req.body.mailId;
        }

        if(data[mailId]){
            return res.json({
            mailId: mailId,
            item: data[mailId].item,
            tab: data[mailId].tab,
            orderLocation: data[mailId].orderLocation,
            orderList: data[mailId].orderList,
            status: 'Success'
        });
        }
        else {
            return res.json({
            mailId: mailId,
            item: null,
            tab: null,
            orderLocation: null,
            orderList: null,
            status: 'Mail Id not found'
        });
        }
        
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log('Server listening');
});
