let fs = require("fs");
let request = require("request");
let cheerio = require("cheerio");
let path = require("path");


function teamsFolder(url){
    let newUrl = url+"/points-table-standings";
    request(newUrl,cb);
    function cb(err,res,html){
        if(err){
            console.log(err);
        }else{
            extractHtml(html);
        }
    }
}
function extractHtml(html){
    let selTool = cheerio.load(html);
    let teamsNames = selTool(".header-title");
    for(let i=1; i<teamsNames.length;i++){
        let tName = selTool(teamsNames[i]).text();
        makeFolder(tName);
    }
}
function makeFolder(tName){
    let dirName = path.join("C:\\Users\\asus.LAPTOP-F97U0B83\\Desktop\\pep tests and assignment\\homework2\\data",tName);
    if(fs.existsSync(dirName)==false){
        fs.mkdirSync(dirName);
    }
}

module.exports={
    mtf: teamsFolder
}