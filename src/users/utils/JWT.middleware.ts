/* eslint-disable prettier/prettier */
import { Unauthorized } from 'http-errors';
import { User } from 'src/users/users.model';
import { sign, verify, JwtPayload } from 'jsonwebtoken';

export async function refreshAccessToken(req: any): Promise<User> {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new Unauthorized('Not authorized');
    }
    const user = await User.findById({ token: token });

    if (!user) {
      throw new Error('User not found');
    }
    const payload = {
      id: user._id,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const accessToken = sign(payload, SECRET_KEY, { expiresIn: '24h' });
    await this.userModel.findByIdAndUpdate(user._id, { accessToken });
    const authentificationUser = await User.findById({
      _id: user._id,
    });
    return authentificationUser;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

export async function findToken(req: any): Promise<User> {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    throw new Unauthorized('Not authorized');
  }

  const SECRET_KEY = process.env.SECRET_KEY;
  const findId = verify(token, SECRET_KEY) as JwtPayload;
  const user = await this.User.findById({ _id: findId.id });

  return user;
}

export async function createToken(authUser: { _id: string }) {
  const payload = {
    id: authUser._id,
  };
  const SECRET_KEY = process.env.SECRET_KEY;
  const token = sign(payload, SECRET_KEY, { expiresIn: '15m' });
  await User.findByIdAndUpdate(authUser._id, { token });
  const authentificationUser = await User.findById({
    _id: authUser._id,
  });
  return authentificationUser;
}
