const bitcoin = require("bitcoinjs-lib");
const ec = require("elliptic").ec;
const sha256 = require('js-sha256');
const ripemd160 = require('ripemd160');
const base58 = require('bs58');

let Bitcoin = {};

// Generate the key and address
Bitcoin.createWalletAddress = (callback) => {
    let privateKey = Bitcoin.createPrivateKey();
    let hash = Bitcoin.generatePublicKeyHash(privateKey);
    let address = Bitcoin.createPublicAddress(hash);
    callback({
        key: privateKey,
        address: address
    });
}

// Create the private key 
Bitcoin.createPrivateKey = () => {
    var keyPair = bitcoin.ECPair.makeRandom();
    let privateKey = keyPair.publicKey.toString('hex');
    return privateKey;
}

/**
 * Generate the public key hash
 * 
 * @param {String} privateKey 
 */
Bitcoin.generatePublicKeyHash = privateKey => {
    const ecdsa = new ec('secp256k1'),
        keys = ecdsa.keyFromPrivate(privateKey),
        publicKey = keys.getPublic('hex'),
        hash = sha256(Buffer.from(publicKey, 'hex')),
        publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest();

    return publicKeyHash;
}

/**
 * Create a public address based on the hash
 * 
 * @param {String} publicKeyHash 
 */
Bitcoin.createPublicAddress = publicKeyHash => {
    // step 1 - add prefix "00" in hex
    const step1 = Buffer.from("00" + publicKeyHash.toString('hex'), 'hex');
    // step 2 - create SHA256 hash of step 1
    const step2 = sha256(step1);
    // step 3 - create SHA256 hash of step 2
    const step3 = sha256(Buffer.from(step2, 'hex'));
    // step 4 - find the 1st byte of step 3 - save as "checksum"
    const checksum = step3.substring(0, 8);
    // step 5 - add step 1 + checksum
    const step4 = step1.toString('hex') + checksum;
    // return base 58 encoding of step 5
    const address = base58.encode(Buffer.from(step4, 'hex'));
    return address;
  }

module.exports = Bitcoin;