/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 *  Create a custom error, displaying a custom message.
 */
const createError = (name, message) => {
  class CustomError extends Error {
    constructor(text) {
      super(message(text))
      this.name = name
    }
  }

  return CustomError
}

/**
 *  Error type to denote abstract methods for base classes.
 */
class AbstractMethod extends Error {
  constructor() {
    super('AbstractMethodError: method is abstract')
    this.name = 'AbstractMethodError'
  }
}

export default {
  AbstractMethod,
  Vcard: createError('VCardError', data => `vCard: invalid vCard data '${JSON.stringify(data)}'`),
  Rdap: createError('RdapError', title => `RDAP error: '${title}'`),
  Ipv4: createError('Ipv4Error', text => `IPv4: invalid Ipv4 record '${text}'`),
  Ipv6: createError('Ipv6Error', text => `IPv6: invalid Ipv6 record '${text}'`)
}