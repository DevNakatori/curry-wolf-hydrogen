import {createCookieSessionStorage} from '@shopify/remix-oxygen';

class SanitySession {
  #session;
  #sessionStorage;

  /**
   * @param {SessionStorage} sessionStorage
   * @param {Session} session
   */
  constructor(sessionStorage, session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }
  /**
   * @static
   * @param {Request} request
   * @param {string[]} secrets
   */
  static async init(request, secrets) {
    const storage = createCookieSessionStorage({
      cookie: {
        httpOnly: true,
        name: 'sanityPreview',
        // samesite must be none so Sanity Studio can access the cookie
        sameSite: 'none',
        secrets,
        secure: true,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  commit() {
    return this.#sessionStorage.commitSession(this.#session);
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }

  get has() {
    return this.#session.has.bind(this.#session);
  }

  get set() {
    return this.#session.set.bind(this.#session);
  }
}

export {SanitySession};
/** @typedef {import('@shopify/hydrogen').HydrogenSession} HydrogenSession */
/** @typedef {import('@shopify/remix-oxygen').SessionStorage} SessionStorage */
/** @typedef {import('@shopify/remix-oxygen').Session} Session */
