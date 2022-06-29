import { createClient } from 'redis';
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if(req.method === 'GET'){
    let { pid } = req.query;
    console.log(pid);
    if(pid){
      try{
        const client = createClient({
            url: 'redis://default:X1nY@xiny.ca:6379'
        });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        let hasData = await client.exists(`Assessment${pid}`);
        let assessment = {};
        if(1==2 && hasData){
          assessment = await client.get(`Assessment${pid}`);
        }
        else{
          assessment = await getAssessment(pid);
          await client.set(`Assessment${pid}`, assessment);
        }
        res.status(200).send(assessment);
      }
      catch(ex){
        console.log(ex);
        res.status(400).send({ error: 'Assessment ID incorrect!' });
      }
    }
    else{
      res.status(400).send({ error: 'Assessment ID not found!' });
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



const getAssessment = async (pid) => {
  const url = `https://www.bcassessment.ca/`;
  const browser = await puppeteer.launch(process.platform==='linux'?{executablePath: '/usr/bin/chromium-browser', headless: false}:{ headless: false });
  try{
    const page = await browser.newPage();
    await page.goto(url);

    //select pid method first
    await page.select("#ddlSearchType", "PID");
  
    // type in to the
    await page.type("#txtPID", pid);
  
    //click search btn
    await page.click("#btnSearch");
    await page.waitForNavigation();
  
    //get total value
    let totalValueString = await page.evaluate(()=>{
      return document.getElementById('lblTotalAssessedValue').innerHTML;
    })
    console.log(totalValueString);
    let totalVauleNumber = parseInt(totalValueString.replace(/\D/g, ""));
    console.log(totalVauleNumber);
    return totalValueString;

  }
  catch(ex){
    console.log(ex);
    return 'Assessment ID incorrect!';
  }
  finally{
    await browser.close();
  }
};

