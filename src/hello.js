/**
 * just a hello world test file to make sure everything is working
 * @param name
 * @returns {*}
 */
export function hello(name: string): string {
  return `hello ${name || 'world'}`;
}
