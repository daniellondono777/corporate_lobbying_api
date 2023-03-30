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
                    bill.each((index, element) => {
                        billUrl.push($(element).attr('href'));
                        billName.push($(element).text());
                    });

                    /*
                    *   Bill Description
                    */

                    const billDescription = $('div.bill-card-front-inner-left').find('h6');
                    let billDescriptions = [];
                    billDescription.each((index, element) => {
                        billDescriptions.push($(element).text());
                    });

                    /*
                     *   Latest Update
                     */

                    const billLatestUpdate = $('div.bill-card-front-update').find('p');
                    const dateLatestUpdate = $('div.bill-card-front-update').find('span');
                    let arrBillLatestUpdates = [];
                    let arrDateLatestUpdates = [];

                    billLatestUpdate.each((index, element) => {
                        arrBillLatestUpdates.push($(element).text());
                    });
                    dateLatestUpdate.each((index, element) => {
                        arrDateLatestUpdates.push($(element).text());
                    });

                    /*
                     *   Lobbying Companies
                     */
                    const billLobbyingCompanies = $('div.bill-card-back-lobbying-inner');
                    let arrLobbists = [];
                    billLobbyingCompanies.each((index, element)=>{
                        let ptCompanies = [];
                        const lobbists = $(element).find('a')
                        lobbists.each((index, ticker)=>{
                            ptCompanies.push($(ticker).text());
                        });
                        arrLobbists.push(ptCompanies);
                    });

                    for(let i = 0; i < 120; i++){
                        console.log('Bill')
                        console.log(billName[i]);
                        console.log(billUrl[i]);
                        console.log('-------')
                    }





                }
            });
        }
        if (type === "RC-2") {
            console.log("RC-2 underperformed");
        }
    }

}


module.exports = lobbyingManager