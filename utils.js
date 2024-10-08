const path = require('path');
const fs = require('fs');

const getLogFileName = ()=>{
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // YYYY:MM:DD
    return path.join(__dirname,'logs',`app-${formattedDate}.log`);
}

const shouldRotateLog = (filePath,maxSize =  5 * 1024 * 1024) =>{
    try {
        const stats = fs.statSync(filePath);
        console.log("stats:", stats)
        return stats.size >= maxSize
    } catch (error) {
        return false // if the file doesn't exits, no rotation is needed
    }
}

module.exports ={
    getLogFileName,
    shouldRotateLog
}