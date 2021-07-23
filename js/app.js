$(function () {
    const stockAPIKey = '4KC80LZJJDQIVU5Is'
    const interval = {
        twenty_four_hour: '24-HOUR',
        one_month: '1-MONTH',
        six_month: '6-MONTH'
    }

    /**
     * 
     * @param {cryptoSymbol} 'BTC', 'ETH',...
     * @param {iv} interval time interval like 6 months, 24 hours, one month
     * @returns 
     */
    function getCryptoPrices(cryptoSymbol, iv) {
        var result = []
        var url = ''
        var parameters = ''
        if (iv === interval.twenty_four_hour) {
            url = 'https://min-api.cryptocompare.com/data/v2/histohour'
            parameters = 'tsym=USD&fsym=' + cryptoSymbol + '&limit=24&aggregate=3&e=Kraken'
        } else if (iv === interval.one_month) {
            url = 'https://min-api.cryptocompare.com/data/v2/histoday'
            parameters = 'tsym=USD&fsym=' + cryptoSymbol + '&limit=30&aggregate=3&e=Kraken'

        } else if (iv === interval.six_month) {
            url = 'https://min-api.cryptocompare.com/data/v2/histoday'
            parameters = 'tsym=USD&fsym=' + cryptoSymbol + '&limit=180&aggregate=3&e=Kraken'

        } else {
            console.log('Incorrect Interval!')
        }

        // Create asynchronous call to wait for the prices to be retrieved
        $.ajaxSetup({ async: false });
        $.get(url, parameters)
            .done((data) => {
                for (var i = 0; i < data.Data.Data.length; i++) {
                    result.push(data.Data.Data[i].close)
                }
            })
            .fail((xhr, status, error) => {
                console.log('error! failed to get prices. ' + error)
            })
        return result
    }

    function getStockPrices(stockSymbol, iv) {
        var result = []
        var url = 'https://www.alphavantage.co/query'
        var parameters = ''
        if (iv === interval.twenty_four_hour) {
            parameters = 'function=TIME_SERIES_INTRADAY&symbol=' + stockSymbol + '&interval=60min&apikey=' + stockAPIKey
        } else if (iv === interval.one_month || iv === interval.six_month) {
            parameters = 'function=TIME_SERIES_MONTHLY&symbol=' + stockSymbol + '&apikey=' + stockAPIKey
        } else {
            console.log('Incorrect Interval!')
        }

        $.ajaxSetup({ async: false });
        $.get(url, parameters)
            .done((data) => {
                $.each(data['Time Series (60min)'], function (index, element) {
                    result.push(parseFloat(element['4. close']))
                });
                $.each(data['Monthly Time Series'], function (index, element) {
                    result.push(parseFloat(element['4. close']))
                });
            })
            .fail((xhr, status, error) => {
                console.log('error! failed to get prices. ' + error)
            })

        // Adjust Results for time interval
        adjustedResult = []
        if (iv === interval.twenty_four_hour) {
            for (var i = 0; i < 24; i++) {
                adjustedResult.push(result[i])
            }
        } else if (iv === interval.one_month) {
            for (var i = 0; i < 2; i++) {
                adjustedResult.push(result[i])
            }
        } else if (iv === interval.six_month) {
            for (var i = 0; i < 6; i++) {
                adjustedResult.push(result[i])
            }
        }
        return result
    }

    /**
     * Take the difference between the first and last values in the time interval.
     * Assume the price difference will occur again. So add the price difference to
     * the current value.
     * @param {S} prices 
     * @returns 
     */
    function predictCryptoPrice(prices) {
        const priceDifference = prices[prices.length - 1] - prices[0]
        return (prices[prices.length - 1] + priceDifference < 0)? 0: prices[prices.length - 1] + priceDifference
    }

    function predictStockPrice(prices) {
        const priceDifference =  prices[0] - prices[prices.length - 1]
        return (prices[0] + priceDifference < 0)? 0: prices[0] + priceDifference
    }

    $(document).ready(function () {
        $('#predictPrice').click('button', function (e) {
            const cryptoSymbol = $('#symbol').children('option:selected').val()
            const timeInterval = $('#interval').children('option:selected').val()
            const symbolFormat = cryptoSymbol.substr(1, cryptoSymbol.length - 2)
            const timeIntervalFormat = timeInterval.substr(1, timeInterval.length - 2)
            const prices = getCryptoPrices(symbolFormat, timeIntervalFormat)
            const predictedPrice = predictCryptoPrice(prices)
            $('#showPredictedPrice').text('1 ' + symbolFormat + ' = $' + predictedPrice)
        });

        $('#predictStockPrice').click('button', function (e) {
            const stockSymbol = $('#stockSymbol').children('option:selected').val()
            const timeInterval = $('#stockInterval').children('option:selected').val()
            const symbolFormat = stockSymbol.substr(1, stockSymbol.length - 2)
            const timeIntervalFormat = timeInterval.substr(1, timeInterval.length - 2)
            const prices = getStockPrices(symbolFormat, timeIntervalFormat)
            const predictedPrice = predictStockPrice(prices)
            $('#showPredictedStockPrice').text('1 ' + symbolFormat + ' = $' + predictedPrice)
        })
    });
})