import _ from 'lodash';
import { Type } from 'protobufjs';
const allowedFunctions = ['eq', 'gt', 'gte', 'lt', 'lte', 'size', 'startWith', 'endWith', 'includes', 'some', 'every'];

class BadRequest extends Error {
  readonly status: number;
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = 400;
  }
}

function sample(obj: { [key: string]: any }, limit: number, useSample: boolean): { [key: string]: any } {
  if (_.isArray(obj)) {
    const func = _.partialRight(sample, true);
    return useSample ? _.map(_.take(obj, limit), func) : obj;
  }
  if (!_.isObject(obj)) {
    return obj;
  }
  return _.reduce(
    obj,
    (agg: { [key: string]: any }, val, k) => {
      agg[k] = sample(val, limit, true);
      return agg;
    },
    {},
  );
}

function validateProp(messageType: Type, prop: string): Type {
  const def = _.get(messageType, `fields.${prop}`);
  if (_.isUndefined(def)) {
    throw new BadRequest(
      `${prop} is not a property in ${messageType.name}:\n
       ${JSON.stringify(messageType.toJSON(), null, '\\t')}`,
    );
  }
  return def.resolvedType || def.type;
}

function match(item: any, search: { [key: string]: any }, messageType: Type): boolean {
  return _.every(search, (val, attr) => {
    if (_.startsWith(attr, '$')) {
      const funcStr: string = _.trimStart(attr, '$');
      if (!_.includes(allowedFunctions, funcStr)) {
        throw new BadRequest(`${funcStr} is not allowed only ${allowedFunctions}`);
      }
      const lodashFunc: Function = _.get(_, funcStr);
      const compareTo = !_.isPlainObject(val) ? val : (x: any) => match(x, val, messageType);
      return lodashFunc(item, compareTo);
    }
    const propDef = validateProp(messageType, attr);
    if (_.isObjectLike(val)) {
      return match(item[attr], val, propDef);
    }
    return _.eq(item[attr], val);
  });
}
type ExploreRequest = {
  data: { [key: string]: any };
  search: { [key: string]: any };
  limit?: number;
  messageType: Type;
};

export function explorerCache(request: ExploreRequest) {
  const { data, search, limit = 100, messageType } = request;
  const query = _.reduce(
    search,
    (result: { [key: string]: any }, val, key) => {
      result[key] = isNaN(_.parseInt(val)) ? val : _.parseInt(val);
      return result;
    },
    {},
  );
  const filtered = !_.isEmpty(query) ? _.filter(data, item => match(item, query, messageType)) : data;
  return sample(filtered, limit, false);
}
