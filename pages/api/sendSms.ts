import CryptoJS from 'crypto-js';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const timestamp = new Date().getTime().toString();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 요청 본문에서 content와 subject, toNumbers를 받아오기
  const { content, subject, toNumbers } = req.body;

  // content, subject, toNumbers의 유효성 확인
  if (!content || !subject || !toNumbers || !Array.isArray(toNumbers) || toNumbers.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid request body" });
  }

  try {
    // NCP SMS 전송을 위한 서명 생성
    const signature = makeSignature();

    // NCP API 호출하여 SMS 전송
    const response = await axios({
      url: `https://sens.apigw.ntruss.com${process.env.NUrl || ''}`,
      method: 'post',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-apigw-timestamp": timestamp,
        "x-ncp-iam-access-key": process.env.NAccessKey || '',
        "x-ncp-apigw-signature-v2": signature,
      },
      data: {
        "type": "LMS",
        "contentType": "COMM", // 일반적인 메시지
        "countryCode": "82",   // 한국 코드
        "from": "01043990068", // 발신 번호
        content, // 요청 본문에서 받아온 메시지
        "messages": toNumbers.map((to: string) => ({ "to": to })), // 수신 번호 리스트
        subject, // 요청 본문에서 받아온 제목
      },
    });

    // 응답 처리
    if (response.status === 202) {
      return res.status(200).json({ success: true, message: "SMS sent successfully" });
    } else {
      return res.status(response.status).json({ success: false, message: "SMS sending failed" });
    }
  } catch (error: unknown) {
    // 에러가 AxiosError 타입인지 확인
    if (axios.isAxiosError(error)) {
      // Axios 오류 처리
      return res.status(500).json({ success: false, message: error.response?.data || error.message });
    } else if (error instanceof Error) {
      // 일반적인 에러 처리
      return res.status(500).json({ success: false, message: error.message });
    } else {
      // 알 수 없는 에러 처리
      return res.status(500).json({ success: false, message: "Unknown error occurred" });
    }
  }
}

// 서명 생성 함수
function makeSignature() {
  const space = " ";      // 공백
  const newLine = "\n";    // 줄바꿈
  const method = "POST";   // 메소드

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, process.env.NSecretKey || '');
  hmac.update(method);
  hmac.update(space);
  hmac.update(`${process.env.NUrl || ''}`);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(`${process.env.NAccessKey || ''}`);

  const hash = hmac.finalize();
  return hash.toString(CryptoJS.enc.Base64);
}
