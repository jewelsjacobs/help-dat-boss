const expect = chai.expect;
const should = chai.should();
import { hello } from '../hello';

describe('hello', () => {
  it('should say hello', () => {
    expect(hello()).to.equal('hello world');
  });
  it('should say hello to person', () => {
    expect(hello('Bob')).to.equal('hello Bob');
  });
});
