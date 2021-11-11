const fs = require('fs')
const apiData = fs.readFileSync('./api-data/apiResponse.json')
const apiResponse = JSON.parse(apiData);

function auction(id, year){
    const saleDetailsCost = apiResponse[id].saleDetails.cost;
    const vehicleYearRatios = apiResponse[id].schedule.years[year];

    return saleDetailsCost && vehicleYearRatios ?
        {
        "marketValue" : saleDetailsCost * vehicleYearRatios.marketRatio,
        "auctionValue" : saleDetailsCost * vehicleYearRatios.auctionRatio
        }
    : depreciateFrom(saleDetailsCost, id,year);
}


function depreciateFrom(saleDetailsCost, id, year){

    if(apiResponse[id]) {

        const oldestVehicleYear = Object.keys(apiResponse[id].schedule.years)[0];
        console.log(oldestVehicleYear);

        const defaultMarketRatio = apiResponse[id].schedule.defaultMarketRatio;
        const defaultAuctionRatio = apiResponse[id].schedule.defaultAuctionRatio;

        var returnCosts =
            {
            "marketValue" : saleDetailsCost * apiResponse[id].schedule.years[oldestVehicleYear].marketRatio,
            "auctionValue" : saleDetailsCost * apiResponse[id].schedule.years[oldestVehicleYear].auctionRatio
        }

        const numberOfYearsToDepreciate = oldestVehicleYear - year;

        const depreciationMarketRate = Math.pow(1-defaultMarketRatio, numberOfYearsToDepreciate);
        const depreciationAuctionRate = Math.pow(1-defaultAuctionRatio, numberOfYearsToDepreciate);

        return {
            "marketValue": returnCosts.marketValue * depreciationMarketRate,
            "auctionValue": returnCosts.auctionValue * depreciationAuctionRate
        }
    }
    return "The parameters passed in do not match any equipment entry";

}


var id = 87390;
var year = 2018;
    //console.log(auction(id, year));
    //
    console.log(auction(67352,2000))
    // console.log(auction(87964,2011))


//region testing
//     var years = [2006,2007,2008,2009,2010,2011,2012];
//     var years2 = [2016,2017,2018,2019,2020];
//
//     years.forEach( year => {
//         const id = 67352;
//         console.log('\n\n!!!marketValue,auctionValue:' + JSON.stringify(auction(id,year)))
//
//         console.log('===expectedMarketValue:' + apiResponse[id].saleDetails.cost
//         *apiResponse[id].schedule.years[year].marketRatio)
//         console.log('===expectedAuctionValue:' + apiResponse[id].saleDetails.cost
//         *apiResponse[id].schedule.years[year].auctionRatio)
//     })
//
//     years2.forEach( year => {
//         const id = 87390;
//         console.log('\n\n!!!marketValue,auctionValue:' + JSON.stringify(auction(id,year)))
//
//         console.log('===expectedMarketValue:' + apiResponse[id].saleDetails.cost
//             *apiResponse[id].schedule.years[year].marketRatio)
//         console.log('===expectedAuctionValue:' + apiResponse[id].saleDetails.cost
//             *apiResponse[id].schedule.years[year].auctionRatio)
//
//     })

//endregion