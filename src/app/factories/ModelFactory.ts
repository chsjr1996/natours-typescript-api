import {
  Model,
  Document,
  MongooseFilterQuery,
  MongooseUpdateQuery,
  QueryFindOneAndUpdateOptions,
} from 'mongoose';
import { Query } from 'express-serve-static-core';
import AdvancedQueries from '../builders/AdvancedQueries';
import AppError from '../helpers/AppError';

export default class ModelFactory<T extends Document> {
  constructor(model: Model<T>) {
    this.model = model;
  }

  public model: Model<T>;

  /**
   * Validate the document and return if it is a valid or throw AppError if is not.
   *
   * @param doc Document to validate
   */
  private validateDoc(doc: T | null) {
    let {
      collection: { collectionName },
    } = this.model;
    collectionName = collectionName.slice(0, -1);

    if (!doc) {
      throw new AppError(`No ${collectionName} found with that ID`, 404);
    }
    return doc;
  }

  /**
   *  Create a new document
   *
   * @param req Request body used to create the document
   */
  public async create(req: object) {
    return await this.model.create(req);
  }

  /**
   * List all documents
   *
   * @param reqQuery The req.query object from Express.JS
   */
  public async getAll(reqQuery: Query) {
    const advQueries = new AdvancedQueries(this.model.find(), reqQuery)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await advQueries.docQuery;
  }

  /**
   * Get specific document
   *
   * @param id ID of document
   */
  public async getOne(id: string) {
    return this.validateDoc(await this.model.findById(id));
  }

  /**
   * Update specific document
   *
   * @param id ID of document
   * @param req Request body used to update the document
   * @param options Optional findByIdAndUpdate options
   */
  public async update(
    id: string,
    req: object,
    options?: QueryFindOneAndUpdateOptions
  ) {
    if (options) {
      return this.validateDoc(
        await this.model.findByIdAndUpdate(id, req, options)
      );
    }
    return this.validateDoc(await this.model.findByIdAndUpdate(id, req));
  }

  /**
   * Soft delete cannot remove document from database,
   * but use a flag for this like "active: boolean"
   *
   * @param query Query used for find the document to be deleted
   * @param field Flag to update to consider this document deleted
   */
  public async softDelete(
    query: MongooseFilterQuery<T>,
    field: MongooseUpdateQuery<T>
  ) {
    return this.validateDoc(await this.model.findOneAndUpdate(query, field));
  }

  /**
   * Remove document, this is IRREVERSIBLE!!!
   *
   * @param id ID of document
   */
  public async delete(id: string) {
    return this.validateDoc(await this.model.findByIdAndDelete(id));
  }
}
