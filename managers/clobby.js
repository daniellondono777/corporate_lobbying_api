const cheerio = require('cheerio');
const { sign } = require('crypto');
const request = require('request');

const lobbyingManager = {


    fetch: async (type, cycle = 'a') => {

        if (type === "RC-1") {
            const responseList = [];

            const billName = [];
            const billUrl = [];
            const billDescriptions = [];
            const arrBillLatestUpdates = [];
            const arrDateLatestUpdates = [];
            const arrRelevantTrades = [];
            const arrLobbists = [];

            let $ = await new Promise((resolve, reject) => {
                request('https://www.quiverquant.com/sources/behind-the-curtain/', (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        resolve(cheerio.load(body));
                    } else {
                        reject(error);
                    }
                });
            });

            /*
            *   Bills
            */

            const bill = $('div.bill-card-front-header').find('a');
            bill.slice(0, 60).each((index, element) => {
                billUrl.push($(element).attr('href'));
                billName.push($(element).text());
            });

            /*
            *   Bill Description
            */

            const billDescription = $('div.bill-card-front-inner-left').find('h6');
            billDescription.slice(0, 60).each((index, element) => {
                billDescriptions.push($(element).text());
            });

            /*
             *   Latest Update
             */

            const billLatestUpdate = $('div.bill-card-front-update').find('p');
            const dateLatestUpdate = $('div.bill-card-front-update').find('span');

            billLatestUpdate.slice(0, 60).each((index, element) => {
                arrBillLatestUpdates.push($(element).text());
            });
            dateLatestUpdate.slice(0, 60).each((index, element) => {
                arrDateLatestUpdates.push($(element).text());
            });

            /*
             *   Lobbying Companies
             */

            const billLobbyingCompanies = $('div.bill-card-back-lobbying-inner');
            billLobbyingCompanies.slice(0, 60).each((index, element) => {
                let ptCompanies = [];
                const lobbists = $(element).find('a')
                lobbists.each((index, ticker) => {
                    ptCompanies.push($(ticker).text());
                });
                arrLobbists.push(ptCompanies);
            });

            /*
             *   Relevant Trades
             */

            const relevantTrades = $('div.bill-card-back-trades-inner');
            const limit = 60;
            relevantTrades.slice(0, limit).each((index, element) => {

                let relevantTradesForBill = [];
                let arrPoliticians = [];
                let arrStocks = [];
                let arrTrades = [];
                let arrDates = [];

                // Politician
                const names = $(element).find('div.name-data').find('span');
                names.each((index, name) => {
                    arrPoliticians.push($(name).text());
                });

                // Stock
                const stocks = $(element).find('div.stock-data').find('span');
                stocks.each((index, stock) => {
                    arrStocks.push($(stock).text());
                });

                // Trade
                const tradeTypes = $(element).find('div.trade-data').find('span');
                tradeTypes.each((index, tt) => {
                    arrTrades.push($(tt).text());
                });

                // Date
                const dates = $(element).find('div.date-data').find('span');
                dates.each((index, date) => {
                    arrDates.push($(date).text());
                });

                // console.log(arrPoliticians.length);
                arrPoliticians.forEach((element, index) => {
                    let temp = {};
                    temp['politician'] = arrPoliticians[index]
                    temp['stock'] = arrStocks[index];
                    temp['trade'] = arrTrades[index];
                    temp['date'] = arrDates[index];

                    relevantTradesForBill.push(temp);
                });
                arrRelevantTrades.push(relevantTradesForBill);
                // console.log('------ [] Bill break [] ------'); // Se agrega entonces al arreglo al arreglo de relevant trades

            });

            billUrl.forEach((element, index) => {
                let responseObject = {}

                responseObject['name'] = billName[index];
                responseObject['url'] = billUrl[index];
                responseObject['description'] = billDescriptions[index];
                responseObject['date_latest_update'] = arrDateLatestUpdates[index];
                responseObject['bill_latest_update'] = arrBillLatestUpdates[index];
                responseObject['lobbists'] = arrLobbists[index];
                responseObject['relevant_trades'] = arrRelevantTrades[index];

                // console.log(responseObject);
                responseList.push(responseObject);
            });

            console.log(responseList);
            return responseList;

        }
        if (type === "RC-2") {
            let $ = await new Promise((resolve, reject) => {
                request(`https://www.opensecrets.org/federal-lobbying/top-contracts?cycle=${cycle}`, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        resolve(cheerio.load(body));
                    } else {
                        reject(error);
                    }
                });
            });

            const firm = [];
            const firmUrl = [];
            const client = [];
            const clientUrl = [];
            const contractAmount = [];

            /*
             *   Firms
             */

            const firms = $('table tr');
            firms.each((i, row) => {

                let rowObject = {};
                const tableCells = $(row).find('td');

                let signaler = 0; 

                tableCells.each((j, cell) => {

                    const href = $(cell).find('a').attr('href');
                    const text = $(cell).text();

                    if( signaler === 0 && typeof href !== 'undefined'){
                        rowObject['firm'] = text;
                        rowObject['firmUrl'] = href
                        signaler += 1;
                    }
                    
                    if( signaler === 1 && typeof href !== 'undefined'){
                        rowObject['client'] = text;
                        rowObject['clientUrl'] = href
                    }
                    rowObject['amount'] = text;
                    
                });
                console.log(rowObject);
                console.log('------ break --------');
            });


            /*
             *   Clients
             */

            /*
             *   Contracts 
             */


        }


    }
}


module.exports = lobbyingManager;