import { createClient } from 'redis';
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if(req.method === 'GET'){
    let { id } = req.query;
    if(id){
      try{
        const client = createClient({
            url: 'redis://default:X1nY@xiny.ca:6379'
        });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        let hasData = await client.exists(`Brokerage${id}`);
        let realtors = {};
        if(hasData){
          realtors = await client.get(`Brokerage${id}`);
        }
        else{
          realtors = await getRealtors(id);
          await client.set(`Brokerage${id}`, JSON.stringify(realtors));
        }
        res.status(200).send(realtors);
      }
      catch(ex){
        console.log(ex);
        res.status(400).send({ error: 'Brokerage ID incorrect!' });
      }
    }
    else{
      res.status(400).send({ error: 'Brokerage ID not found!' });
    }
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    res.status(400).send({ error: 'POST requests not allowed!' });
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}



const getRealtors = async (id) => {
  let realtors = [];
  let hasMore = true;
  let pageNumber = 0;  
  while(hasMore){
    pageNumber++;
    console.log(`page ${pageNumber}`); 
    const url = `https://online.bcfsa.ca/search-results?WCE=C=20|P=up_dirMyEmployees_brn|K=Delears~${id}&page=${pageNumber}`;
    const browser = await puppeteer.launch(process.platform==='linux'?{executablePath: '/usr/bin/chromium-browser'}:undefined);
    try{
      const page = await browser.newPage();
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 0
      });
      
      await page.waitForSelector('table[class="dataTable"]');  
  
      const footer = await page.evaluate(() => {
        debugger;
        return document.querySelector(
          'tr[class="webgrid-footer"]'
        )?.innerHTML;
      });
  
      if(!footer || String(footer).includes(`</a> ${pageNumber} </td>`))
      {
        console.log("no more!");
        hasMore = false;
      }
      else{
        console.log("has more!"); 
        hasMore = true;
      } 
  
  
      let agentsFullName = await page.evaluate(() => {
        let res = [];
        let elements = document.getElementsByClassName("Priority-1");
        // console.log(elements.length);
        for (let i = 0; i < elements.length; i++) {
          if (i == 0) {
            continue;
          } else {
            //each agent
            elements[i].firstElementChild.click();
            let name = elements[i].firstElementChild.innerHTML;
            res.push(name);
          }
        }
        return res;
      });
  
      await page.waitForTimeout(2 * 1000);
  
      let agentsDetailInfo = await page.evaluate(() => {
        //read all data from profilewrapper
        let agentsInfoRes = [];
        let tables = document.getElementsByClassName("profilerow");
        for (let index = 0; index < tables.length; index++) {
          const table = tables[index];
          let tableInfos = table.querySelectorAll(".profilevalue");
          let tableLables = table.querySelectorAll(".profilelabel");
          let agentInfo = {};
          for (let c = 0; c < tableLables.length; c++) {
            let labelName = tableLables[c].innerHTML.replace(/[^a-zA-Z]+/g, "");
            let infoValue = tableInfos[c].innerHTML;
            agentInfo[`${labelName}`] = infoValue;
          }
          agentsInfoRes.push(agentInfo);
        }
        console.log(agentsInfoRes);
        return agentsInfoRes;
      });
  
      for (let index = 0; index < agentsDetailInfo.length; index++) {
        agentsDetailInfo[index]['Name'] = agentsFullName[index];
        realtors.push(agentsDetailInfo[index]);
      }  
    }
    catch(ex){
      console.log(ex);
    }
    finally{
      await browser.close();
    }    
    
  }

  return realtors;
};

