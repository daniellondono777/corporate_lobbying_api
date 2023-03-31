const cheerio = require('cheerio');
const request = require('request');

const lobbyingManager = {

    fetch: async (type) => {

        if (type === "RC-1") {
            request('https://www.quiverquant.com/sources/behind-the-curtain/', (error, response, body) => {
                if (!error && response.statusCode == 200) {

                    const $ = cheerio.load(body);

                    /*
                    *   Bills
                    */

                    const bill = $('div.bill-card-front-header').find('a');
                    let billName = [];
                    let billUrl = []
                    bill.slice(0, 60).each((index, element) => {
                        billUrl.push($(element).attr('href'));
                        billName.push($(element).text());
                    });

                    /*
                    *   Bill Description
                    */

                    const billDescription = $('div.bill-card-front-inner-left').find('h6');
                    let billDescriptions = [];
                    billDescription.slice(0, 60).each((index, element) => {
                        billDescriptions.push($(element).text());
                    });

                    /*
                     *   Latest Update
                     */

                    const billLatestUpdate = $('div.bill-card-front-update').find('p');
                    const dateLatestUpdate = $('div.bill-card-front-update').find('span');
                    let arrBillLatestUpdates = [];
                    let arrDateLatestUpdates = [];

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
                    let arrLobbists = [];
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
                    const arrRelevantTrades = [];
                    const limit = 60;
                    relevantTrades.slice(0, limit).each((index, element) => {

                        let relevantTrade = {};

                        let arrPoliticians = [];
                        let arrStocks = [];
                        let arrTrades = [];
                        let arrDates = [];

                        // Politician
                        const names = $(element).find('div.name-data').find('span');
                        names.each((index, name)=> {
                            arrPoliticians.push($(name).text()); 
                        });

                        // Stock
                        const stocks = $(element).find('div.stock-data').find('span');
                        stocks.each((index, stock)=>{
                            arrStocks.push($(stock).text());
                        });

                        // Trade
                        const tradeTypes = $(element).find('div.trade-data').find('span');
                        tradeTypes.each((index, tt)=>{
                            arrTrades.push($(tt).text());
                        });

                        // Date
                        const dates = $(element).find('div.date-data').find('span');
                        dates.each((index, date)=> {
                            arrDates.push($(date).text());
                        });

                        console.log(arrPoliticians.length);
                        arrPoliticians.forEach((e)=>{console.log(e)});
                        console.log('------ Trade break ------');




                    });

                    

                }
            });
        }
        if (type === "RC-2") {
            console.log("RC-2 underperformed");
        }
    }

}


module.exports = lobbyingManager