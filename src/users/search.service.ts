import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.model';
import {
  mergeAndRemoveDuplicates,
  paginateArray,
  rows,
  shuffleArray,
} from './utils/parse.user';
import { NotFound } from 'http-errors';
import { Orders } from '../orders/order.model';
import { search_result } from './dto/update.user.dto';
import { SearchQuery } from './users.resolver';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Orders.name)
    private ordersModel: Orders,
  ) {}

  async searchUsers(query: SearchQuery): Promise<search_result> {
    const { req, loc, page, cat, subcat, limit } = query;
    try {
      const curentPage = page || 1;
      const curentlimit = limit || 8;
      const totalCount = await this.userModel.countDocuments();

      const totalPages = Math.ceil(totalCount / curentlimit);
      const offset = (curentPage - 1) * curentlimit;
      // Если ничего не задано в строке
      if (!req && !loc && !cat && !subcat) {
        const result = await this.userModel
          .aggregate([
            {
              $match: {
                verify: true,
                title: { $exists: true },
                description: { $exists: true },
              },
            },
            { $sample: { size: curentlimit } },
          ])
          .limit(curentlimit)
          .skip(offset)
          .exec();
        return {
          totalPages: totalPages,
          currentPage: curentPage,
          data: result,
        };
      }

      const regexReq = new RegExp(req, 'i');
      const regexLoc = new RegExp(loc, 'i');
      // Если заданы пустые значения локации и запроса
      if (
        (!req && !loc) ||
        (cat && !subcat && !loc) ||
        (cat && subcat && !loc)
      ) {
        const category = await this.userModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const subcategory = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const resultArray = await mergeAndRemoveDuplicates(
          category,
          subcategory,
        );
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: resultArray,
          };
        } else {
          const result = await paginateArray(resultArray, curentPage);

          const totalPages = Math.ceil(resultArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      }
      // Если есть запрос без локации
      if (req && !loc && !cat && !subcat) {
        const findTitle = await this.userModel
          .find({
            title: { $regex: regexReq },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const findCat = await this.userModel
          .find({
            category: {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const findSubcat = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const findDescr = await this.userModel
          .find({
            description: { $regex: regexReq },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const findLocation = await this.userModel
          .find({
            location: { $regex: regexReq },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const findName = await this.userModel
          .find({
            firstName: { $regex: regexReq },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();

        const resultArray = await mergeAndRemoveDuplicates(
          findTitle,
          findDescr,
          findCat,
          findSubcat,
          findLocation,
          findName,
        );
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: resultArray,
          };
        } else {
          const result = await paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
        //Если нет запроса, но есть локация
      } else if (!req && loc && cat && subcat) {
        const subcategory = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
            location: { $regex: regexLoc },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const randomArray = await shuffleArray(subcategory);
        if (Array.isArray(randomArray) && randomArray.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: randomArray,
          };
        } else {
          const result = await paginateArray(randomArray, curentPage);
          const totalPages = Math.ceil(randomArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      } else if (!req && loc && !cat && !subcat) {
        const location = await this.userModel
          .find({
            location: { $regex: regexLoc },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const randomArray = await shuffleArray(location);
        if (Array.isArray(randomArray) && randomArray.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: randomArray,
          };
        } else {
          const result = await paginateArray(randomArray, curentPage);
          const totalPages = Math.ceil(randomArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      } else if (!req && loc && cat && !subcat) {
        const category = await this.userModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
            location: { $regex: regexLoc },
            verify: true,
          })
          .sort({ createdAt: -1 })
          .select(rows)
          .exec();
        const randomArray = await shuffleArray(category);
        if (Array.isArray(randomArray) && randomArray.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: randomArray,
          };
        } else {
          const result = await paginateArray(randomArray, curentPage);
          const totalPages = Math.ceil(randomArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
        // Если есть локация и запрос
      } else if (
        (req && loc && cat && subcat) ||
        (req && loc && cat && !subcat)
      ) {
        const findTitle = await this.userModel
          .find({
            title: { $regex: regexReq },
            location: { $regex: regexLoc },
            verify: true,
          })
          .select(rows)
          .exec();

        const findDescr = await this.userModel
          .find({
            description: { $regex: regexReq },
            location: { $regex: regexLoc },
            verify: true,
          })
          .select(rows)
          .exec();

        const category = await this.userModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
            location: { $regex: regexLoc },
            verify: true,
          })
          .select(rows)
          .exec();

        const subcategory = await this.userModel
          .find({
            $and: [
              {
                'category.subcategories': {
                  $elemMatch: {
                    id: subcat,
                  },
                },
              },
              {
                location: { $regex: regexLoc },
              },
              { verify: true },
            ],
          })
          .select(rows)
          .exec();
        const findCat = await this.userModel
          .find({
            category: {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            location: { $regex: regexLoc },
            verify: true,
          })
          .select(rows)
          .exec();
        const findSubcat = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            location: { $regex: regexLoc },
            verify: true,
          })
          .select(rows)
          .exec();
        const findName = await this.userModel
          .find({
            firstName: { $regex: regexReq },
            location: { $regex: regexLoc },
            verify: true,
          })
          .select(rows)
          .exec();

        const resultArray = await mergeAndRemoveDuplicates(
          findTitle,
          findDescr,
          category,
          subcategory,
          findCat,
          findSubcat,
          findName,
        );

        if (Array.isArray(resultArray) && resultArray.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: resultArray,
          };
        } else {
          const result = await paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      }
    } catch (e) {
      throw e;
    }
  }
  ////////////////  ORDERS SEARCH
  async searchOrders(query: any): Promise<any> {
    const { req, loc, page, cat, subcat, limit } = query;
    try {
      const curentPage = page || 1;
      const curentlimit = 8;
      const totalCount = await this.ordersModel.countDocuments();

      const totalPages = Math.ceil(totalCount / curentlimit);
      const offset = (curentPage - 1) * curentlimit;
      // Если ничего не задано в строке
      if (!req && !loc && !cat && !subcat) {
        const result = await this.ordersModel
          .find() // добавить поиск по
          .select(rows)
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(curentlimit)
          .exec();
        return {
          totalPages: totalPages,
          currentPage: curentPage,
          data: result,
        };
      }

      const regexReq = new RegExp(req, 'i');
      const regexLoc = new RegExp(loc, 'i');
      // Если заданы пустые значения
      if (
        (req === '' && loc === '') ||
        (!req && !loc) ||
        (cat && !subcat) ||
        (!cat && subcat)
      ) {
        const category = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
          })
          .select(rows)
          .exec();
        const subcategory = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
          })
          .select(rows)
          .exec();
        const resultArray = await mergeAndRemoveDuplicates(
          category,
          subcategory,
        );
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = await paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      }
      // Если есть запрос без локации
      if ((req !== '' && loc === '') || !loc) {
        const findCat = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
          })
          .select(rows)
          .exec();
        const findSubcat = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
          })
          .select(rows)
          .exec();
        const findDescr = await this.ordersModel
          .find({
            description: { $regex: regexReq },
          })
          .select(rows)
          .exec();
        const category = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
          })
          .select(rows)
          .exec();
        const subcategory = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
          })
          .select(rows)
          .exec();
        const findLocation = await this.ordersModel
          .find({
            location: { $regex: regexReq },
          })
          .select(rows)
          .exec();
        const findName = await this.ordersModel
          .find({
            name: { $regex: regexReq },
          })
          .select(rows)
          .exec();

        const resultArray = await mergeAndRemoveDuplicates(
          findDescr,
          category,
          subcategory,
          findCat,
          findSubcat,
          findLocation,
          findName,
        );
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
        //Если нет запроса, но есть локация
      } else if ((req === '' && loc !== '') || !req) {
        const findLocation = await this.ordersModel
          .find({
            location: { $regex: regexLoc },
          })
          .select(rows)
          .skip(offset)
          .limit(curentlimit)
          .exec();
        const category = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
          })
          .select(rows)
          .exec();
        const subcategory = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
          })
          .select(rows)
          .exec();

        const resultArray = await mergeAndRemoveDuplicates(
          category,
          subcategory,
          findLocation,
        );

        if (Array.isArray(resultArray) && findLocation.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = await paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      } else if (req !== '' && loc !== '') {
        const findDescr = await this.ordersModel
          .find({
            description: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const category = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const subcategory = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const findCat = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const findSubcat = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const findName = await this.ordersModel
          .find({
            name: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const resultArray = await mergeAndRemoveDuplicates(
          findDescr,
          category,
          subcategory,
          findCat,
          findSubcat,
          findName,
        );

        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = await paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / curentlimit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      }
    } catch (e) {
      throw e;
    }
  }
}
