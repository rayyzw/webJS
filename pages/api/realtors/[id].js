const puppeteer = require('puppeteer');

export default async function handler(req, res) {
  if(req.method === 'GET'){
    let { id } = req.query;
    let realtors = await getRealtors(id);
    res.status(200).send(realtors);
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
    const url = `https://online.bcfsa.ca/search-results?WCE=C=20|P=up_dirMyEmployees_brn|K=Delears~${id}&page=${pageNumber}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
    
    await page.waitForSelector('table[class="dataTable"]');  

    const footer = await page.evaluate(() => {
      debugger;
      return document.querySelector(
        'tr[class="webgrid-footer"]'
      )?.innerHTML;
    }); 
    console.log(footer);

    if(!footer || String(footer).includes(`</a> ${pageNumber} </td>`))
    {
      console.log("no more!");
      hasMore = false;
    }
    else{
      console.log("has more!"); 
      hasMore = true;
    } 

    const tableContent = await page.evaluate(() => {
      debugger;
      let table = document.querySelector(
        'table[class="dataTable"]'
      ).innerHTML;
      
      return table;
    });
    
    let hrefs = String(tableContent).split('<td class="Priority-1"><a href="').splice(1).map((href)=>{
      let data = {};
      data.name = href.split('">')[1].split('</a>')[0];
      data.a = `a[href="${href.split('">')[0]}"]`;
      return data;
    });

    for(let i=0;i<hrefs.length;i++){
      const browser1 = await puppeteer.launch();
      const page1 = await browser1.newPage();
      await page1.goto(url, {
        waitUntil: 'networkidle2',
      });
      
      await page1.waitForSelector('table[class="dataTable"]');      
      await page1.click(hrefs[i].a);
      await page1.waitForSelector('tr[class="profilerow"]');
      const realtor = await page1.evaluate(() => {
        debugger;
        let td = document.querySelector(
          'td[class="directoryprofile"]'
        ).innerHTML;

        let data = {};
        if(String(td).includes('<div class="profilelabel">Also Known As:</div><div class="profilevalue">')){
          data.alsoKnowAs = String(td).split('<div class="profilelabel">Also Known As:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Team Name:</div><div class="profilevalue">')){
          data.teamName = String(td).split('<div class="profilelabel">Team Name:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Licensed As:</div><div class="profilevalue">')){
          data.licenseAs = String(td).split('<div class="profilelabel">Licensed As:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Licensed For:</div><div class="profilevalue">')){
          data.licenseFor = String(td).split('<div class="profilelabel">Licensed For:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Licence #:</div><div class="profilevalue">')){
          data.licenseNumber = String(td).split('<div class="profilelabel">Licence #:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Brokerage:</div><div class="profilevalue">')){
          data.brokerage = String(td).split('<div class="profilelabel">Brokerage:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Business Address:</div><div class="profilevalue">')){
          data.businessAddress = String(td).split('<div class="profilelabel">Business Address:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Business Address:</div><div class="profilevalue">')){
          data.businessAddress = String(td).split('<div class="profilelabel">Business Address:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Business Phone:</div><div class="profilevalue">')){
          data.businessPhone = String(td).split('<div class="profilelabel">Business Phone:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Business Fax:</div><div class="profilevalue">')){
          data.businessFax = String(td).split('<div class="profilelabel">Business Fax:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Licence Effective:</div><div class="profilevalue">')){
          data.licenceEffective = String(td).split('<div class="profilelabel">Licence Effective:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        if(String(td).includes('<div class="profilelabel">Licence Expiry:</div><div class="profilevalue">')){
          data.licenceExpiry = String(td).split('<div class="profilelabel">Licence Expiry:</div><div class="profilevalue">')[1].split('</div>')[0];
        }
        return data;
      });
      realtor.name = hrefs[i].name;
      console.log(realtor);
      realtors.push(realtor);
      await browser1.close();
    }      
    await browser.close();
  }

  return realtors;
};