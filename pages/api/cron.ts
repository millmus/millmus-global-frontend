import CryptoJS from 'crypto-js';
import axios from 'axios';

const timestamp = new Date().getTime().toString();

export default async function handler(req: any, res: any) {
  const authHeader = req.headers.authorization;
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ success: false });
  }

  const { today, week } = await fetch('https://api.밀머스.com/lectures/end_soon/',
    ).then(res => res.json()).then(json => json);
  const content = `오늘 종료: ${today.length ? today.substr(0, 1900) : '0건'}\n7일 내에 종료: ${week}`;

  const signature = await makeSignature();
  await axios({
    url: `https://sens.apigw.ntruss.com${process.env.NUrl||''}`,
    method: 'post', 
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-ncp-apigw-timestamp": timestamp,
      "x-ncp-iam-access-key": process.env.NAccessKey||'',
      "x-ncp-apigw-signature-v2": signature,
    },
    data: {
      "type": "LMS",
      "subject": "[얼리버드 종료 알림]",
      "from": "01043990068",
      content,
      "messages": [
        {"to": "01020507491"}, 
        {"to": "01032305101"}
      ],
    },
  });
  return res.status(200).json({ ok: true });
}

function makeSignature() {
  var space = " ";        // one space
  var newLine = "\n";       // new line
  var method = "POST";       // method

  var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, process.env.NSecretKey||'');
  hmac.update(method);
  hmac.update(space);
  hmac.update(`${process.env.NUrl||''}`);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(`${process.env.NAccessKey||''}`);

  var hash = hmac.finalize();

  return hash.toString(CryptoJS.enc.Base64);
}