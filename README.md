# Price Prediction tool
This tool can make a prediction of the price of either a cryptocurrency or a stock. The parameters are the stock/crypto to 
be predicted, the time interval(24 hours, One Month, Six months). The actual prediction is not very accurate. The stradegy that
I created was for example the 24 hour prediction, if BTC=$28,000 24 hours ago, and now it is $30,000, then my algorithm will predict it will go up $2,000 again, the price 24 hours from now will be $32,000. It would work the same if for example it went down -$2,000. These predictions shouldn't be taken seriously. The crypto exchange the data was grabbed from was Kraken.com

## Access to the service
I deployed the service on Heroku.
https://crypto-price-prediction13.herokuapp.com/home.html#

The code can be found here
https://github.com/gtullio12/webservice

## Services Used
https://www.alphavantage.co/
https://www.cryptocompare.com/

## Endpoints used
Used to grab crypto prices for one month and six months
https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday

Used to grab crypto prices for 24 hours
https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistohour

Used to grab hourly stock prices
https://www.alphavantage.co/documentation/#intraday

Used to grab monthly stock prices
https://www.alphavantage.co/documentation/#monthly


