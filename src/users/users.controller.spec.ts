import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SearchService } from './search.service';
import { CloudinaryService } from './cloudinary.service';
import { CreateUserDto } from './dto/create.user.dto';
import { verify } from './dto/verify.user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, SearchService, CloudinaryService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'payalnic@ukr.net',
        password: 'Vovan-123545',
        firstName: 'Volodymyr',
        phone: '380934071399',
      };

      const expectedUserData = {
        _id: '64ff012f1424c2d37e2d0467',
        email: 'payalnic@ukr.net',
        password: 'Vovan-123545',
        phone: '380934071399',
        location: 'Бровари, Київська область, Україна',
        isOnline: false,
        tg_chat: null,
        viber_chat: null,
        viber: null,
        paid: false,
        trial: null,
        token: null,
        refresh_token: null,
        verified: 'new',
        googleId: null,
        facebookId: null,
        metaUrl: 'null',
        ban: false,
        totalRating: 0,
        numberOfRatings: 0,
        agree_order: 0,
        disagree_order: 0,
        trialEnds: null,
        paidEnds: null,
        accepted_orders: [],
        firstName: 'Павлик Равлик',
        telegram: 'makakosik',
        price: '100$ за час',
        description:
          "пою танцюю та роблю все длkdtjfbkvknjghnkjghlnuglmkhjm.nm;lkj;lkjl/kh'kя плалслслслалалплплплпьаьаьпьпьплiugoiuyglghlvkjvkjgckjhckjgcвфвдоатдфл",
        title: ' самолетики',
        whatsapp: '+380984561225',
        photo: [
          {
            publicId:
              'user-64ff012f1424c2d37e2d0467/61BC1629-F9A8-4C63-B007-B525EE62F2D8_1_201_a-1701286446314.jpeg',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701286447/user-64ff012f1424c2d37e2d0467/61BC1629-F9A8-4C63-B007-B525EE62F2D8_1_201_a-1701286446314.jpeg.jpg',
          },
          {
            publicId:
              'user-64ff012f1424c2d37e2d0467/6D47C938-D9A3-49CA-A9F3-35E84083DCDB_1_201_a-1701286464314.jpeg',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701286465/user-64ff012f1424c2d37e2d0467/6D47C938-D9A3-49CA-A9F3-35E84083DCDB_1_201_a-1701286464314.jpeg.jpg',
          },
          {
            publicId:
              'user-64ff012f1424c2d37e2d0467/9B80FFD5-1B1A-4421-A3FE-2AC94CCDC6EB-1701716579072.jpeg',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701716581/user-64ff012f1424c2d37e2d0467/9B80FFD5-1B1A-4421-A3FE-2AC94CCDC6EB-1701716579072.jpeg.jpg',
          },
          {
            publicId:
              'user-64ff012f1424c2d37e2d0467/EC54175E-5AD6-4798-AB50-BF0458985E87-1701717201795.jpeg',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701717202/user-64ff012f1424c2d37e2d0467/EC54175E-5AD6-4798-AB50-BF0458985E87-1701717201795.jpeg.jpg',
          },
        ],
        video: [
          {
            publicId: 'c1a5489d-6a25-4f18-8465-6ce35f7f21ee',
            url: 'https://www.youtube.com/watch?v=5G-21rw1LD8&list=PLo7G1JSZSAkKH7EvYXvmIJsmsEZoRr1Au',
          },
          {
            publicId: '424eddee-d868-4403-81f3-94b026927e65',
            url: 'https://www.youtube.com/watch?v=mg7netw1JuM',
          },
          {
            publicId: '506145ba-c0b8-4a1d-95fb-6098e758c23f',
            url: 'https://www.youtube.com/watch?v=OA0pVvUaLOs',
          },
        ],
        master_photo: {
          publicId:
            'user-64ff012f1424c2d37e2d0467/EC54175E-5AD6-4798-AB50-BF0458985E87-1701717201795.jpeg',
          url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701717202/user-64ff012f1424c2d37e2d0467/EC54175E-5AD6-4798-AB50-BF0458985E87-1701717201795.jpeg.jpg',
        },
        avatar: {
          publicId:
            'user-64ff012f1424c2d37e2d0467/avatar-IMG_0961-1706040520335.jpeg',
          url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1706040522/user-64ff012f1424c2d37e2d0467/avatar-IMG_0961-1706040520335.jpeg.jpg',
        },
        verify: true,
        category: [
          {
            _id: '65258a576f9a7d99e555c7bd',
            name: 'Музичні послуги',
            subcategories: [
              {
                name: 'Жива музика',
                id: '872c7525-ef5b-4dc3-9082-bdb98426fb1a',
              },
            ],
          },
          {
            _id: '65258b446f9a7d99e555c7e2',
            name: 'Фото та відео',
            subcategories: [],
          },
        ],
        social: {
          Facebook: 'https://www.facebook.com/psmirnyj/',
          Instagram: 'https://www.instagram.com/payalnic/',
          Youtube: 'https://www.youtube.com/watch?v=1Fj-2yVFEVE',
          TikTok: 'https://www.tiktok.com/ru-RU/',
          WebSite: 'https://www.wechirka.com/',
        },
      };

      jest.spyOn(userService, 'create').mockResolvedValueOnce(expectedUserData);

      // Call the controller method
      const result = await controller.create(createUserDto);

      // Assert the result
      expect(result).toEqual(expectedUserData);
    });
  });

  afterEach(() => {
    // Optionally, clear any mocks or perform cleanup
    jest.clearAllMocks();
  });
});
