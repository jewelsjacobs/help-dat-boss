const expect = chai.expect;
const should = chai.should();
import { getTemplateParams } from '../template';
const templateParams = ['rows', 'limit:4', 'paging:true'];
const templateParamObj = { limit: '4', paging: true };

describe('getTemplateParams', () => {
  it('should convert template param string to object', () => {
    expect(getTemplateParams(templateParams)).to.have.all.keys('limit', 'paging');
  });
});
