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

import expect from '../expect'
import card from '../../src/jcard/card'

const VCARD_ARRAY = ["vcard",
  [
    ["version", {}, "text", "4.0"],
    ["fn", {}, "text", "Redpill Linpro RIPE hostmaster"],
    ["kind", {}, "text", "group"],
    ["adr",
      {
        "label" : "Managed Services team 0\nPostbox 4 Nydalen\n0409 Oslo\nNorway"
      },
      "text",
      ["", "", "", "", "", "", ""]
    ],
    ["tel", { "type" : "voice" }, "text", "+47 08192"],
    ["email", { "type" : "email" }, "text", "noc@redpill-linpro.com"],
    ["email", { "type" : "abuse" }, "text", "abuse@redpill-linpro.com"],
    ["org", {}, "text", "ORG-LA61-RIPE"]
  ]
]

describe('card', () => {
  it('should parse basic text', () => {
    expect(card(VCARD_ARRAY[1])).to.eql({
      version: '4.0',
      fn: 'Redpill Linpro RIPE hostmaster',
      kind: 'group',
      adr: {
        label: 'Managed Services team 0\nPostbox 4 Nydalen\n0409 Oslo\nNorway'
      },
      tel: {
        voice: '+47 08192'
      },
      email: {
        email: 'noc@redpill-linpro.com',
        abuse: 'abuse@redpill-linpro.com'
      },
      org: 'ORG-LA61-RIPE'
    })
  })
})
