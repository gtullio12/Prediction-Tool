$(function () {
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
        console.log('iv: ' + iv)
        console.log('interval: ' + interval.twenty_four_hour)
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
                console.log('error! failed to get prices')
            })
            .always((data) => {

            })
        return result
    }

    /**
     * Take the difference between the first and last values in the time interval.
     * Assume the price difference will occur again. So add the price difference to
     * the current value.
     * @param {S} prices 
     * @returns 
     */
    function predictPrice(prices) {
        const priceDifference = prices[prices.length-1] - prices[0]
        return prices[prices.length-1] + priceDifference
    }

    $(document).ready(function () {
        $('#predictPrice').click('button', function (e) {
            const cryptoSymbol = $('#symbol').children('option:selected').val()
            const timeInterval = $('#interval').children('option:selected').val()
            const prices = getCryptoPrices(cryptoSymbol.substr(1,cryptoSymbol.length -2), timeInterval.substr(1,timeInterval.length -2))
            const predictedPrice = predictPrice(prices)
            $('#showPredictedPrice').text('$'+predictedPrice)
        });
    });
})