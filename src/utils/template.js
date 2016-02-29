/**
 * @desc Determines which HTML elements need to be added: inputFilter, Pagination
 * @example ["rows", "limit:4", "paging:true"] -> { paging: true }
 * @param aKey
 * @returns {{}}
 */
export function getTemplateParams(aKey: Array<string>): Object {
  // Identify any parameters
  const params = {};
  const aParams = aKey.splice(1, (aKey.length - 1));

  for (const param of aParams) {
    const tmp = (param.split(':'));

    if (tmp[1] === 'true') {
      params[tmp[0]] = true;
    } else if (tmp[1] === 'false') {
      params[tmp[0]] = false;
    } else {
      params[tmp[0]] = tmp[1];
    }
  }

  return params;
}