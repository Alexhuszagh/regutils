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

import expect from './expect'
import errors from '../src/errors'

describe('errors', () => {
  describe('abstract', () => {
    it('should ignore arguments', () => {
      let error = new errors.AbstractMethod()
      expect(error.name).to.equal('AbstractMethodError')
      expect(error.message).to.equal('AbstractMethodError: method is abstract')
    })
  })

  describe('vcard', () => {
    it('should create a proper message', () => {
      let error = new errors.Vcard(["vcard", []])
      expect(error.name).to.equal('VCardError')
      expect(error.message).to.equal('vCard: invalid vCard data \'["vcard",[]]\'')
    })
  })

  describe('rdap', () => {
    it('should create a proper message', () => {
      let error = new errors.Rdap('Invalid syntax.')
      expect(error.name).to.equal('RdapError')
      expect(error.message).to.equal('RDAP error: \'Invalid syntax.\'')
    })
  })

  describe('ipv4', () => {
    it('should create a proper message', () => {
      let error = new errors.Ipv4('192.168.0')
      expect(error.name).to.equal('Ipv4Error')
      expect(error.message).to.equal('IPv4: invalid Ipv4 record \'192.168.0\'')
    })
  })

  describe('ipv6', () => {
    it('should create a proper message', () => {
      let error = new errors.Ipv6('2001:4200::1::')
      expect(error.name).to.equal('Ipv6Error')
      expect(error.message).to.equal('IPv6: invalid Ipv6 record \'2001:4200::1::\'')
    })
  })
})