let url ="https://www.espncricinfo.com/series/ipl-2020-21-1210595";


let makeTeamsFolderObj = require("./commands/teamsFolder");
let getPlayerObj = require("./commands/getPlayer");

makeTeamsFolderObj.mtf(url);
getPlayerObj.getPlayer(url);
