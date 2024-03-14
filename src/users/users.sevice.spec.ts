import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

const mockUserModel = {
  findOne: jest.fn(),
  updateOne: jest.fn(),
};

const mockUserModelProvider = {
  provide: getModelToken(User.name),
  useValue: mockUserModel,
};

interface Request {
  headers: {
    authorization?: string;
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, mockUserModelProvider],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logout', () => {
    it("should revoke the user's access token and make them unauthenticated", async () => {
      const mockUser = { _id: 'test-user-id' };
      userModel.findOne(Promise.resolve(mockUser));
      userModel.updateOne(Promise.resolve());

      try {
        await service.logout({
          headers: { authorization: 'Bearer test-token' },
        });

        expect(userModel.updateOne).toHaveBeenCalledWith(
          { _id: 'test-user-id' },
          { $set: { token: null } },
        );
        expect(userModel.findOne).toHaveBeenCalledWith({ _id: 'test-user-id' });
      } catch (error) {
        // Обработка ошибок и вывод информации
        console.error('Test failed:', error);
        throw error;
      }
    });
  });
});
