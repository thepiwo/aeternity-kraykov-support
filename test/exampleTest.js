/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */
const Ae = require('@aeternity/aepp-sdk').Universal;
const Crypto = require('@aeternity/aepp-sdk').Crypto;

const config = {
    host: "http://localhost:3001/",
    internalHost: "http://localhost:3001/internal/",
    gas: 200000,
    ttl: 55,
    compilerUrl: 'https://compiler.aepps.com'
};

const decodeAddress = (key) => {
    const decoded58address = Crypto.decodeBase58Check(key.split('_')[1]).toString('hex');
    return `#${decoded58address}`;
};

describe('Example Contract', () => {

    let owner, ownerKeyPair;

    before(async () => {
        ownerKeyPair = wallets[0];
        owner = await Ae({
            url: config.host,
            internalUrl: config.internalHost,
            keypair: ownerKeyPair,
            nativeMode: true,
            networkId: 'ae_devnet',
            compilerUrl: config.compilerUrl
        });

    });

    it('Deploying Example Contract', async () => {
        let tokenContractSource = utils.readFileRelative('./contracts/Token.aes', "utf-8"); // Read the aes file
        let tokenContract = await owner.getContractInstance(tokenContractSource);
        await tokenContract.deploy().catch(console.error);

        console.log(tokenContract);

        let exampleContractSource = utils.readFileRelative('./contracts/ExampleContract.aes', "utf-8"); // Read the aes file
        let exampleContract = await owner.getContractInstance(exampleContractSource);

        await exampleContract.deploy([ownerKeyPair.publicKey, 0, 0]).catch(console.error);

        console.log(exampleContract);

        console.log([`Some(${decodeAddress(tokenContract.deployInfo.address)})`, "1000000000000000000", ownerKeyPair.publicKey, ownerKeyPair.publicKey]);

        let call = await exampleContract.call('deposit', [`Some(${decodeAddress(tokenContract.deployInfo.address)})`, "1000000000000000000", ownerKeyPair.publicKey, ownerKeyPair.publicKey]);

        console.log("decode: " + await call.decode());

    });

});
