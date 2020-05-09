/**
 *  Get envinroment variable
 *
 * @param name Name of environment variable
 */
export default function (name: string) {
  let env = process.env[name];
  if (!env) throw new Error(`Cannot find ${name} env`);
  return env;
}
