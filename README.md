# Registry Utils

A collection of server-side utilities for working with registries, including DNS, WHOIS, and mapping IP addresses to geographic regions.

## DNS

DNS, or domain name resolution, is a way to lookup IP addresses and other information from domain names.

Example using DNS:

```js
import regutils from 'regutils'

// Assumes async-await, so this must be run in a async block.

// Lookup a single value.
let cache = new regutils.dns.cache()
let ipv4 = await regutils.dns.lookup('example.org', {
  cache,                    // Cache to store DNS responses.
  servers: ['8.8.8.8'],     // Specify DNS nameservers.
  rrtype: 'A'               // 'A' for IPv4, 'AAAA' for IPv6
})
console.log(ipv4)
// Response
//  [ { address: '93.184.216.34', expiration: 1579109860784 } ]

// Lookup multiple values asynchronously.
let ipv4List = await dns.lookupList(['example.org', 'example.com'], {
  cache,
  servers: ['8.8.8.8'],
  rrtype: 'A'
})
console.log(ipv4List)
// Response
//  { 
//      'example.org': [ { address: '93.184.216.34', expiration: 1579036211858 } ],
//      'example.com': [ { address: '93.184.216.34', expiration: 1579045255858 } ] 
//  }
```

## WHOIS

WHOIS data allows you to identify useful metadata from an IP address, or domain name. Here, we only use RDAP, which only supports IP addresses.

Example using WHOIS:

```js
import regutils from 'regutils'

// Assumes async-await, so this must be run in a async block.

// Lookup a single value.
let cache = new regutils.whois.cache()
let ipv4 = await regutils.whois.lookup('93.184.216.0', {
  cache,                // Cache to store WHOIS responses.
  rir: 'arin',          // Regional internet registry to query.
  useHttps: false,      // Enforce HTTPs encryption for requests.
  timeout: 3000         // Timeout in milliseconds for each request.
})
// Response
//  {
//      range: {
//          start: "93.184.216.0",
//          end: "93.184.216.255",
//          version: "v4",
//          ...
//      },
//      metadata: { ... }
//  }

// Lookup multiple values asynchronously.
let ipv4 = await regutils.whois.lookupList(['93.184.216.0', '2a02:c0::'], {
  cache,                // Cache to store WHOIS responses.
  rir: 'arin',          // Regional internet registry to query.
  useHttps: false,      // Enforce HTTPs encryption for requests.
  timeout: 3000         // Timeout in milliseconds for each request.
})
// Response
//  {
//      "93.184.216.0": { ... },
//      "2a02:c0::": { ... }
//  }
```

## GEO-IP

GEO-IP is a way to use delegated IP ranges to geographical regions to map the likely location of a server from its IP range.

Example using GEO-IP:

```js
import regutils from 'regutils'

// Assumes async-await, so this must be run in a async block.

let cache = {
  asn: new regutils.geoip.cache.Asn(),      // Store ASN values.
  ipv4: new regutils.geoip.cache.Ipv4(),    // Store IPv4 addresses.
  ipv6: new regutils.geoip.cache.Ipv6()     // Store IPv6 addresses.
}

// Fetch the GEO-IP data from RIRs.
// Valid RIRs are: 'afrinic', 'apnic', 'arin', 'lacnic', 'ripe'
await fetch(cache, {
  timeout: 5000,      // Timeout in milliseconds for each request to each RIR.
  rirs: ['ripe'],     // Regional internet registries to query.
  useHttps: true      // Enforce HTTPs encryption for requests.
})

// Now, query the cache for valid IPv4 ranges.
let ipv4Parse = regutils.model.ipv4.parse
let range = await cache.ipv4.find(ipv4Parse('2.0.0.0'))
console.log(range)
// Response
//  Notice: IP addresses are stored numerically, use
//  `regutils.model.ipv4.format` to convert them to 
//  pretty strings.
//  {
//      key: 33554432           // '2.0.0.0'
//      value: {
//          stop: 33816575,     // '2.3.255.255'
//          country: 'FR',
//          date: '20100712',
//          identifier: 'a82276e2ca374d83903881154cc77ef6'
//      }
//  }

// You can query anywhere inside the range, so for example,
// [ipv4Parse('2.0.0.0'), ipv4Parse('2.3.255.255')] will work,
// but ipv4Parse('2.4.0.0') will not. This allows you to find
// the delegated range and metadata quite easily.
```

# License

Regutils is licensed under the Apache 2.0 license. See [LICENSE](/LICENSE) for more information.

# Contributing

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in regutils by you, as defined in the Apache-2.0 license, shall be licensed as above, without any additional terms or conditions.
