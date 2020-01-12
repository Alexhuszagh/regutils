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
 *  Encode and decode strings to and from buffers.
 */

// BUFFER UTILITIES

const toBuffer = array => {
  return new Buffer(array.buffer)
}

const fromBuffer = array => {
  let start = array.byteOffset
  let stop = start + array.byteLength
  return new Uint8Array(array.buffer.slice(start, stop))
}

// ASCII

const isEncodedAscii = buffer => {
  return buffer.every(value => value < 0x80)
}

const isDecodedAscii = string => {
  return /^[\x00-\x7F]*$/.test(string)
}

const encodeAscii = string => {
  if (!isDecodedAscii(string)) {
    throw new Error('unable to encode invalid ascii')
  }
  return fromBuffer(new Buffer(string, 'ascii'))
}

const decodeAscii = buffer => {
  if (!isEncodedAscii(buffer)) {
    throw new Error('unable to decode invalid ascii')
  }
  return toBuffer(buffer).toString('ascii')
}

// BASE64

const isEncodedBase64 = () => {
  return true
}

const isDecodedBase64 = string => {
  return /^[A-Za-z0-9+/=]*$/.test(string)
}

const encodeBase64 = string => {
  if (!isDecodedBase64(string)) {
    throw new Error('unable to encode invalid base64')
  }
  return fromBuffer(new Buffer(string, 'base64'))
}

const decodeBase64 = buffer => {
  if (!isEncodedBase64(buffer)) {
    throw new Error('unable to decode invalid base64')
  }
  return toBuffer(buffer).toString('base64')
}

// HEX

const isEncodedHex = () => {
  return true
}

const isDecodedHex = string => {
  let isEven = (string.length % 2) === 0
  return isEven && /^[A-Fa-f0-9]*$/.test(string)
}

const encodeHex = string => {
  if (!isDecodedHex(string)) {
    throw new Error('unable to encode invalid hex')
  }
  return fromBuffer(new Buffer(string, 'hex'))
}

const decodeHex = buffer => {
  if (!isEncodedHex(buffer)) {
    throw new Error('unable to decode invalid hex')
  }
  return toBuffer(buffer).toString('hex')
}

// UNICODE

const isDecodedUnicode = string => {
  //  Javascript strings are exposed as UCS-2.
  //  Therefore, we need to determine if this
  //  string is valid UTF-16.
  //
  //    Single code points:
  //      [U+0000-U+D7FF]
  //      [U+E000-U+FFFF]
  //
  //    High surrogates:
  //      [U+D800-U+DBFF]
  //
  //    Low surrogates:
  //      [U+DC00-U+DFFF]
  const highBegin = 0xD800
  const highEnd = 0xDBFF
  const lowBegin = 0xDC00
  const lowEnd = 0xDFFF

  let index = 0
  while (index < string.length) {
    // Get the character code for the character.
    let code = string.charCodeAt(index)
    if (code >= highBegin && code <= highEnd) {
      // Have a high surrogate, need low surrogate pair.
      if (index + 1 >= string.length) {
        // No more remaining characters, naked high-surrogate pair.
        return false
      }

      let c2 = string.charCodeAt(index + 1)
      if (c2 >= lowBegin && c2 <= lowEnd) {
        // Have matching low-surrogate pair.
        index += 2
      } else {
        // No matching low-surrogate pair.
        return false
      }
    } else if (code >= lowBegin && code <= lowEnd) {
      // Have naked low surrogate pair.
      return false
    } else {
      // Valid single character.
      index += 1
    }
  }

  return true
}

// UTF-8

/**
 *  Mapping of each UTF-8 byte to the number of continuation
 *  bytes.
 */
const UTF8_BYTES = new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4,5,5,5,5])

/**
 *  Determine if byte is an ASCII byte.
 */
const isAsciiByte = code => {
  return code < 0x80
}

/**
 *  Determine if byte is a start byte.
 */
const isStartByte = code => {
  return code > 0xBF
}

/**
 *  Determine if byte is a continuation byte.
 */
const isContinuationByte = code => {
  return (code >= 0x80) && (code <= 0xBF)
}

/**
 *  Determine if byte is a valid.
 */
const isValidByte = (code, isContinuation) => {
  if (isContinuation) {
    return isContinuationByte(code)
  } else {
    return isAsciiByte(code) || isStartByte(code)
  }
}

const isEncodedUtf8 = buffer => {
  // Each UTF-8 byte is either ASCII or a start/continuation byte pair.
  // Therefore, we need to determine if each byte is valid.
  let index = 0
  while (index < buffer.length) {
    let code = buffer[index]
    let bytes = UTF8_BYTES[code]
    if (index + bytes >= buffer.length) {
      // Have more bytes needed to complete character
      // than available in source buffer.
      return false
    }

    // Check if each byte in encoded character is valid.
    // We want fallthrough, one of the few times this
    // is actually desired.
    let isContinuation = false
    switch (bytes) {
      // 5 and 6-byte UTF-8 characters were an extension,
      // are now invalid.
      case 5: return false
      case 4: return false
      case 3:
        if (!isValidByte(buffer[index], isContinuation)) {
          return false
        }
        isContinuation = true
        index += 1
        // fallthrough
      case 2:
        if (!isValidByte(buffer[index], isContinuation)) {
          return false
        }
        isContinuation = true
        index += 1
        // fallthrough
      case 1:
        if (!isValidByte(buffer[index], isContinuation)) {
          return false
        }
        isContinuation = true
        index += 1
        // fallthrough
      case 0:
        if (!isValidByte(buffer[index], isContinuation)) {
          return false
        }
        isContinuation = true
        index += 1
    }
  }

  return true
}

const encodeUtf8 = string => {
  if (!isDecodedUnicode(string)) {
    throw new Error('unable to encode invalid utf8')
  }
  return fromBuffer(new Buffer(string, 'utf-8'))
}

const decodeUtf8 = buffer => {
  if (!isEncodedUtf8(buffer)) {
    throw new Error('unable to decode invalid utf8')
  }
  return toBuffer(buffer).toString('utf-8')
}

export default {
  toBuffer,
  fromBuffer,
  ascii: {
    isDecoded: isDecodedAscii,
    isEncoded: isEncodedAscii,
    encode: encodeAscii,
    decode: decodeAscii
  },
  base64: {
    isDecoded: isDecodedBase64,
    isEncoded: isEncodedBase64,
    encode: encodeBase64,
    decode: decodeBase64
  },
  hex: {
    isDecoded: isDecodedHex,
    isEncoded: isEncodedHex,
    encode: encodeHex,
    decode: decodeHex
  },
  utf8: {
    isDecoded: isDecodedUnicode,
    isEncoded: isEncodedUtf8,
    encode: encodeUtf8,
    decode: decodeUtf8
  }
}