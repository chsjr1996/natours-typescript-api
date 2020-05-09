import { DocumentQuery, Document } from 'mongoose';
import { Query } from 'express-serve-static-core';

export default class AdvancedQueries<T, DocT extends Document> {
  /**
   * @param docQuery Document query like "Model.find()"
   * @param reqQuery Request query from req.query
   */
  constructor(docQuery: DocumentQuery<T, DocT>, reqQuery: Query) {
    this.docQuery = docQuery;
    this.reqQuery = reqQuery;
  }

  public docQuery: DocumentQuery<T, DocT>;
  public reqQuery: Query;

  /**
   * Query filters, use for find specific results. You can use mongo
   * operators and multiple fields in request query params, like this:
   *
   * price[gte]=256
   * rating[gt]=3
   */
  public filter() {
    const queryObj = { ...this.reqQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.docQuery.find(JSON.parse(queryStr));

    return this;
  }

  /**
   * Sort fields, you can use comma "," for sort multiple fields
   * and change sort order to decrescent using minus "-", like this:
   *
   * sort=name,-price
   */
  public sort() {
    if (this.reqQuery.sort) {
      const sort = this.reqQuery.sort as string;
      this.docQuery = this.docQuery.sort(sort.split(',').join(' '));
    } else {
      this.docQuery = this.docQuery.sort('-createdAt');
    }
    return this;
  }

  /**
   * If you not want see all fieds from documents, you can use "fields"
   * in query param and user comma "," for specify which fields will be show, like this:
   *
   * fields=name,price
   *
   * Only show the name and price fields (the id and _id cannot be omited)
   */
  public limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields as string;
      this.docQuery = this.docQuery.select(fields.split(',').join(' '));
    } else {
      this.docQuery = this.docQuery.select('-__v');
    }
    return this;
  }

  /**
   * Implement pagination, by default can list 100 results but you can use
   * "limit" query param for change this. Use "page" query param  for control current page
   */
  public paginate() {
    const page = parseInt(this.reqQuery.page as string, 10) * 1 || 1;
    const limit = parseInt(this.reqQuery.limit as string, 10) * 1 || 100;
    const skip = (page - 1) * limit;

    this.docQuery.skip(skip).limit(limit);
    return this;
  }
}
