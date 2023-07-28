const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ame2ee = require("./ame2ee");
const app = express();
const port = 3000;

///
const regex = /([^,]+),([^,]+)/;
let m;
var e2Module;
var e2RsaExponent;



app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/pin/encrypt', (req, res) => {
  const data = req.body;

  if ((m = regex.exec(data.pubKey)) !== null) {
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (match !== 'undefined' && groupIndex == 1) {
        e2Module = match
      }
      if (match !== 'undefined' && groupIndex == 2) {
        e2RsaExponent = match
      }
    });
  }

  (async () => {
    res.status(200).send(pinEncrypt(data.Sid, data.ServerRandom, e2Module, e2RsaExponent, data.pin, data.hashType));
  })();
});

app.listen(port, () => console.log(`EncryptPin app listening on port ${port}!`));


function pinEncrypt(Sid, ServerRandom, e2Module, e2RsaExponent, pin, hashType) {
  return ame2ee.encryptPinForAM(
    Sid,
    e2Module + "," + e2RsaExponent,
    ServerRandom,
    pin,
    hashType
  );
}