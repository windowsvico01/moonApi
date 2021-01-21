const log4js = require('log4js');



log4js.configure({  
  appenders: {  
    fileout: { type: "file", filename: "./log/fileout.log" }, 
    datafileout: {
        type: "dateFile", 
        filename: "./log/datafileout.log", 
        pattern: ".yyyy-MM-dd"
    },
    consoleout: { type: "console" }, 
  }, 
  categories: {    
      default: { appenders: ["consoleout", 'datafileout'], level: "debug" },   
      anything: { appenders: ["consoleout"], level: "debug" }
  }
});

module.exports = log4js;