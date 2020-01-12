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
import ipv4 from '../../../src/dns/codec/ipv4'

const RECORD = { address: '192.168.0.1', expiration: 1578631364122 }
const ARRAY1 = new Uint8Array([192, 168, 0, 1, 141, 194, 254, 26, 0, 0, 1, 111])
const RECORDS = [
  { address: '192.168.0.1', expiration: 1578631364122 },
  { address: '192.168.0.255', expiration: 1578631364182 }
]
const ARRAY2 = new Uint8Array([192, 168, 0, 1, 141, 194, 254, 26, 0, 0, 1, 111, 192, 168, 0, 255, 141, 194, 254, 86, 0, 0, 1, 111])

describe('ipv4', () => {
  it('should encode ipv4 records', () => {
    expect(ipv4.encode(RECORD)).to.eql(ARRAY1)
  })

  it('should encode multiple ipv4 records', () => {
    expect(ipv4.encodeList([RECORD])).to.eql(ARRAY1)
    expect(ipv4.encodeList(RECORDS)).to.eql(ARRAY2)
  })

  it('should decode ipv4 records', () => {
    expect(ipv4.decode(ARRAY1)).to.eql(RECORD)
  })

  it('should decode multiple ipv4 records', () => {
    expect(ipv4.decodeList(ARRAY1)).to.eql([RECORD])
    expect(ipv4.decodeList(ARRAY2)).to.eql(RECORDS)
  })
})