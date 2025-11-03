import { NextApiRequest, NextApiResponse } from 'next';
import { usersApi } from '@libs/api';
import { tokenSettings } from '@libs/token';
import withHandler from '@libs/server/withHandler';
import { serialize } from 'cookie';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // SNS 로그인만 지원
    const {
      data: { msg, access_token },
    } = await usersApi.snsLogin(req.body);

    if (msg) {
      return res.status(200).json({ ok: true, msg });
    }

    if (access_token) {
      res.setHeader(
        'Set-Cookie',
        serialize('token', access_token, tokenSettings)
      );
      return res.status(200).json({ ok: true });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default withHandler({ method: 'POST', handler });
