let fs = require("fs");
let cheerio = require("cheerio");
let request = require("request");
let path = require("path");
let PDFDocument = require("pdfkit");

let url ="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
playerData(url);

function playerData(url){
    let newUrl = url+"/match-results";
    request(newUrl, cb);
    function cb(err,resp,html){
        if(err){
            console.log(err);
        }else{
            extractAllMatchLink(html);
        }
    }
}
function extractAllMatchLink(html){
    let selTool = cheerio.load(html);
    let links = selTool("a.match-info-link-FIXTURES");
    let linksArr =[];
    for(let i=0; i<links.length;i++){   ///remember to change the parameter i<1 to i<links.length
        linksArr.push(selTool(links[i]).attr("href"));
        linksArr[i]="https://www.espncricinfo.com"+linksArr[i];
        //console.log(linksArr[i]);
        matchData(linksArr[i]);
    }
}

function matchData(mlink){
    request(mlink,cb);
    function cb(err,resp,html){
        if(err){
            console.log(err);
        }else{
            extractMatchData(html);
        }
    }
}
function extractMatchData(html){
    let selTool = cheerio.load(html);
    let teamNameEleArr=selTool(".Collapsible h5");
    let teamNameArr=[];
    for(let i=0; i<teamNameEleArr.length;i++){
        let teamName =selTool(teamNameEleArr[i]).text();
        teamName = teamName.split("INNINGS")[0].trim();
        teamNameArr.push(teamName);
    }
    let batsmanTableEle = selTool(".table.batsman");
    for(let i=0;i<batsmanTableEle.length;i++){
        let singleInn = selTool(batsmanTableEle[i]).find("tbody tr");
        for(let j=0; j<singleInn.length-1;j+=2){
            let singleInnAllCol = selTool(singleInn[j]).find("td");
            let pName =selTool(singleInnAllCol[0]).text().trim();
            let status =selTool(singleInnAllCol[1]).text();
            let runs =selTool(singleInnAllCol[2]).text();
            let ballsPlayed =selTool(singleInnAllCol[3]).text();
            let four =selTool(singleInnAllCol[4]).text();
            let six =selTool(singleInnAllCol[6]).text();
            let strikeRate =selTool(singleInnAllCol[6]).text();
            let batsmanObj ={
                "Runs":runs,
                "Balls Played": ballsPlayed,
                "Status": status,
                "4s":four,
                "6s":six,
                "Strike Rate": strikeRate,
            };
            let batsmanArr=[{
                "Runs":runs,
                "Balls Played": ballsPlayed,
                "Status": status,
                "4s":four,
                "6s":six,
                "Strike Rate": strikeRate,
            }];
            //let pdfDoc = new PDFDocument;
            let filePath = path.join("C:\\Users\\asus.LAPTOP-F97U0B83\\Desktop\\pep tests and assignment\\homework2\\data",teamNameArr[i],pName+".json");
            // makePDF(filePath,arr);
            if(fs.existsSync(filePath)==false){
                let output = JSON.stringify(batsmanArr);
                fs.writeFileSync(filePath, output);
            }else{
                let batsmanD = fs.readFileSync(filePath);
                let batsmanJson = JSON.parse(batsmanD);
                batsmanJson.push(batsmanObj);
                let updated = JSON.stringify(batsmanJson);
                fs.writeFileSync(filePath,updated);
            }
            // pdfDoc.pipe(fs.createWriteStream(filePath));
            // pdfDoc.text(JSON.stringify(batsmanArr));
            // pdfDoc.end();
        }
        
    }
}
// function makePDF(filePath,arr){
//     let pdfDoc = new PDFDocument;
//     if(fs.existsSync(filePath)==false){
//         pdfDoc.pipe(fs.createWriteStream(filePath));
//         pdfDoc.text(JSON.stringify(arr));
//         pdfDoc.end();
//     }else{
//         pdfDoc.pipe(fs.createWriteStream(filePath));
//         pdfDoc.text(JSON.stringify(arr));
//         pdfDoc.end();
//     }
// }


module.exports={
    getPlayer: playerData
}