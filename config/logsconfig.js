var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: "console"
        },
        {
            type: 'DateFile',
            filename: 'logs/access.log',
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            category: 'normal',
        }]
});
module.exports = log4js.connectLogger(log4js.getLogger('normal'), {level: log4js.levels.INFO, format: ':method :url'});




