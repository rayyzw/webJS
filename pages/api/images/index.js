
import fs from "fs";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if(req.method === 'GET'){
    res.status(400).send({ error: 'GET requests not allowed!' });
  }
  else if(req.method === 'PUT'){
    res.status(400).send({ error: 'PUT requests not allowed!' });
  }
  else if(req.method === 'PATCH'){
    res.status(400).send({ error: 'PATCH requests not allowed!' });
  }
  else if(req.method === 'POST'){
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if(err){
        res.status(400).send({ error: String(err)});
      }
      else{
        let buff = fs.readFileSync(files.upload.filepath);
        res.status(200).send({ uploaded: true, url:`data:${files.upload.mimetype};base64,${buff.toString("base64")}` });
      }
    });
  }
  else if(req.method === 'DELETE'){
    res.status(400).send({ error: 'DELETE requests not allowed!' });
  }
}
