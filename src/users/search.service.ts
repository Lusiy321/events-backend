import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.model';
import {
  mergeAndRemoveDuplicates,
  paginateArray,
  rows,
} from './utils/parse.user';
import { NotFound } from 'http-errors';
import { search_result } from './dto/update.user.dto';
import { Orders } from 'src/orders/order.model';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Orders.name)
    private ordersModel: Orders,
  ) {}

  async searchUsers(query: any): Promise<search_result> {
    const { req, loc, page, cat, subcat } = query;
    try {
      const curentPage = page || 1;
      const limit = 8;
      const totalCount = await this.userModel.countDocuments();

      const totalPages = Math.ceil(totalCount / limit);
      const offset = (curentPage - 1) * limit;
      // Если ничего не задано в строке
      if (!req && !loc && !cat && !subcat) {
        const result = await this.userModel
          .aggregate([
            { $match: { verify: true } },
            { $sample: { size: limit } },
          ])
          .limit(limit)
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
        const resultArray = mergeAndRemoveDuplicates(category, subcategory);
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: resultArray,
          };
        } else {
          const result = paginateArray(resultArray, curentPage);

          const totalPages = Math.ceil(resultArray.length / limit);
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

        const resultArray = mergeAndRemoveDuplicates(
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
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
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

        if (Array.isArray(subcategory) && subcategory.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: subcategory,
          };
        } else {
          const result = paginateArray(subcategory, curentPage);
          const totalPages = Math.ceil(subcategory.length / limit);
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

        if (Array.isArray(location) && location.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: location,
          };
        } else {
          const result = paginateArray(location, curentPage);
          const totalPages = Math.ceil(location.length / limit);
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

        if (Array.isArray(category) && category.length === 0) {
          return {
            totalPages: 0,
            currentPage: 0,
            data: category,
          };
        } else {
          const result = paginateArray(category, curentPage);
          const totalPages = Math.ceil(category.length / limit);
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

        const resultArray = mergeAndRemoveDuplicates(
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
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
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

  async searchOrders(query: any): Promise<any> {
    const { req, loc, page, cat, subcat } = query;
    try {
      const curentPage = page || 1;
      const limit = 8;
      const totalCount = await this.ordersModel.countDocuments();

      const totalPages = Math.ceil(totalCount / limit);
      const offset = (curentPage - 1) * limit;
      // Если ничего не задано в строке
      if (!req && !loc && !cat && !subcat) {
        const result = await this.ordersModel
          .find() // добавить поиск по
          .select(rows)
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(limit)
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
        const resultArray = mergeAndRemoveDuplicates(category, subcategory);
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
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

        const resultArray = mergeAndRemoveDuplicates(
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
          const totalPages = Math.ceil(resultArray.length / limit);
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
          .limit(limit)
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

        const resultArray = mergeAndRemoveDuplicates(
          category,
          subcategory,
          findLocation,
        );

        if (Array.isArray(resultArray) && findLocation.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
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

        const resultArray = mergeAndRemoveDuplicates(
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
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
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
