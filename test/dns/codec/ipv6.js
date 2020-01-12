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

import expect from '../../expect'
import ipv6 from '../../../src/dns/codec/ipv6'

const RECORD = { address: '2001:db8:0:1:1:1:1:1', expiration: 1578631364122 }
const ARRAY1 = new Uint8Array([32, 1, 13, 184, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 141, 194, 254, 26, 0, 0, 1, 111])
const RECORDS = [
  { address: '2001:db8:0:1:1:1:1:1', expiration: 1578631364122 },
  { address: '2001:db8::2:1', expiration: 1578631364182 }
]
const ARRAY2 = new Uint8Array([32, 1, 13, 184, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 141, 194, 254, 26, 0, 0, 1, 111, 32, 1, 13, 184, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 141, 194, 254, 86, 0, 0, 1, 111])

describe('ipv6', () => {
  it('should encode ipv6 records', () => {
    expect(ipv6.encode(RECORD)).to.eql(ARRAY1)
  })

  it('should encode multiple ipv6 records', () => {
    expect(ipv6.encodeList([RECORD])).to.eql(ARRAY1)
    expect(ipv6.encodeList(RECORDS)).to.eql(ARRAY2)
  })

  it('should decode ipv6 records', () => {
    expect(ipv6.decode(ARRAY1)).to.eql(RECORD)
  })

  it('should decode multiple ipv6 records', () => {
    expect(ipv6.decodeList(ARRAY1)).to.eql([RECORD])
    expect(ipv6.decodeList(ARRAY2)).to.eql(RECORDS)
  })
})