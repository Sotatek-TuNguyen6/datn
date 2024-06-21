const crypto = require('crypto');

function checkHash(url, secretKey) {
  const splitUrl = url.split('&hash=');
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.write(splitUrl[0]);
  hmac.end();
  return splitUrl[1] === hmac.read().toString('hex');
}

const secretKey = '5g2DASF5DRbJKsQw3izrhwCTJhS7Wpwp';
const url = 'https://a37e-117-4-246-88.ngrok-free.app/api/webapi/affiliate/bitlabsResult?offer_state=NONE&uid=ec9b61c9-2052-4be3-b524-6f0c1cade463&val=1&offer_id=1&task_id=47186193&tx=1293133667&hash=1e60892caa24c2ac544d78c7524fff21acd4e369';
console.log(checkHash(url, secretKey));