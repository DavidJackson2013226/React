/* eslint-disable no-redeclare */
import { BigNumber, ethers } from "ethers";
import { getContractInfo, getContractObj, getTokenContract, getCollectionContract, getMysteryBoxContract, getStakingContract, CONTRACTS_BY_NETWORK } from ".";
import MysteryBoxABI from '../contracts/MysteryBox.json'

export function isAddress(address) {
    try {
        ethers.utils.getAddress(address);
    } catch (e) { return false; }
    return true;
}

export function toEth(amount, decimal) {
    return ethers.utils.formatUnits(String(amount), decimal);
}

export function toWei(amount, decimal) {
    return ethers.utils.parseUnits(String(amount), decimal);
}

/**
 * Payment Token Contract Management
 */


/**
 * getTokenBalance(account, tokenAddr, library)
 * account : user address
 * tokenAddr : payment token address
 */
export async function getTokenBalance(account, tokenAddr, chainId, library) {
    if (tokenAddr === '0x0000000000000000000000000000000000000000') {
        var balance = await library.getBalance(account);
        var etherVal = parseFloat(ethers.utils.formatEther(balance));
        return etherVal;
    } else {
        var tokenContract = getTokenContract(tokenAddr, chainId, library.getSigner());
        if (tokenContract) {
            var balance = await tokenContract.balanceOf(account);
            var decimal = await tokenContract.decimals();
            return parseFloat(toEth(balance, decimal));
        }
    }
    return 0;
}

/**
 * isTokenApproved(account, tokenAddr, amount, to, chainId, provider)
 * account : user address
 * tokenAddr : Payment token address
 * amount : approving amount
 * toAddr : address
 */
export async function isTokenApproved(account, tokenAddr, amount, toAddr, chainId, provider) {
    const tokenContract = getTokenContract(tokenAddr, chainId, provider);
    if (!tokenContract) return false;

    const decimal = await tokenContract.decimals();
    const allowance = await tokenContract.allowance(account, toAddr);
    if (BigNumber.from(toWei(amount, decimal)).gt(allowance)) {
        return false;
    }
    return true;
}

/**
 * approveToken(tokenAddr, to, chainId, provider)
 * tokenAddr : Payment token address
 * toAddr : address
 */
export async function approveToken(tokenAddr, toAddr, chainId, provider) {
    const tokenContract = getTokenContract(tokenAddr, chainId, provider);
    if (!tokenContract) return false;

    const approveAmount = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
    try {
        const approve_tx = await tokenContract.approve(toAddr, approveAmount);
        await approve_tx.wait(1);
        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
}


/**
 * NFT Contract Management
 */

/**
 * isNFTApproved(type, collection, to, account, chainId, provider)
 * type : single / multi
 * collection : collectioin address
 * account : user address
 * to : to address
 */
export async function isNFTApproved(type, collection, to, account, chainId, provider) {
    const nftToken = getCollectionContract(type, collection, chainId, provider);
    if (!nftToken) return false;
    return await nftToken.isApprovedForAll(account, to);
}

/**
 * setNFTApproval(type, collection, to, chainId, provider)
 * type : single / multi
 * collection : collectioin address
 * to : to address
 */
export async function setNFTApproval(type, collection, to, chainId, provider) {
    const nftToken = getCollectionContract(type, collection, chainId, provider);

    if (!nftToken) return false;
    try {
        const tx = await nftToken.setApprovalForAll(to, true);
        await tx.wait(1);
        return true;
    } catch (e) {
        console.log(e)
    }
    return false;
}

export async function getNFTTokenBalance(account, collection, tokenId, chainId, provider) {
    const nftToken = getCollectionContract('multi', collection, chainId, provider);
    if (nftToken) {
        var balance = await nftToken.balanceOf(account, tokenId);
        return balance;
    }
    return 0;
}


/**
 * AddNFTCollection Contract Management
*/

/**
 * importCollection(address, name, uri, chainId, provider)
 * name : collection name
 * uri : collectioin uri
*/
export async function importCollection(address, name, uri, chainId, provider) {
    const importContract = getContractObj('AddNFTCollection', chainId, provider);
    if (!importContract) return false;
    try {
        var publicAdd = await importContract.publicAdd();
        if (publicAdd) {
            var fee = await importContract.fee();
            const tx = await importContract.importCollection(address, name, uri, {
                value: fee
            });
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
            return false;
        } else {
            const tx = await importContract.importCollection(address, name, uri);
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function isNFTAddress(address, chainId, provider) {
    const nftToken = getCollectionContract('single', address, chainId, provider);
    if (!nftToken) return false;
    try {
        const result = await nftToken.supportsInterface('0x01ffc9a7')
        return result;
    } catch (e) { return false; }
}

export async function getImportInfo(chainId, provider) {
    var info = {
        publicAdd: false,
        fee: 0,
        owner: ''
    }
    const importContract = getContractObj('AddNFTCollection', chainId, provider);
    if (!importContract) return info;
    try {
        var publicAdd = await importContract.publicAdd();
        info.publicAdd = publicAdd;

        var fee = await importContract.fee();
        info.fee = parseFloat(toEth(fee, 18));

        var owner = await importContract.owner();
        info.owner = owner;

        return info;
    } catch (e) { return info; }
}





/**
 * NFTFactory Contract Management
*/

/**
 * createSingleCollection(name, uri, chainId, provider)
 * name : collection name
 * uri : collectioin uri
*/
export async function createSingleCollection(name, uri, chainId, provider) {
    const factoryContract = getContractObj('NFTFactory', chainId, provider);
    if (!factoryContract) return false;
    try {
        const tx = await factoryContract.createSingleCollection(name, uri, false);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * createMultipleCollection(name, uri, chainId, provider)
 * name : collection name
 * uri : collectioin uri
 */
export async function createMultipleCollection(name, uri, chainId, provider) {
    const factoryContract = getContractObj('NFTFactory', chainId, provider);
    if (!factoryContract) return false;
    try {
        const tx = await factoryContract.createMultipleCollection(name, uri, false);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}








/**
 * NFT Collection Contract Management
*/

/**
 * addSingleItem(collection, uri, provider)
 * collection : collection address
 * uri : token uri
*/
export async function addSingleItem(collection, uri, chainId, provider) {
    const contractObj = getCollectionContract('single', collection, chainId, provider);
    if (!contractObj) return false;
    try {
        const tx = await contractObj.addItem(uri);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e)
        return false;
    }
}

/**
 * addMultiItem(collection, uri, provider)
 * collection : collection address
 * supply : number of copies
 * uri : token uri
*/
export async function addMultiItem(collection, uri, supply, chainId, provider) {
    const contractObj = getCollectionContract('multi', collection, chainId, provider);
    if (!contractObj) return false;
    try {
        const tx = await contractObj.addItem(supply, uri);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e)
        return false;
    }
}


// Trnasfer NFT

export async function sendNFT(collection, type, from, to, tokenId, amount, chainId, provider) {
    if (type === 'multi') {
        const result = await transferMultiItem(collection, from, to, tokenId, amount, chainId, provider);
        return result;
    } else {
        const result = await transferSingleItem(collection, from, to, tokenId, chainId, provider);
        return result;
    }
}


/**
 * transferSingleItem(collection, from, to, tokenId, chainId, provider)
 * collection : collection address
 * from : sender address
 * to : receiver address
 * tokenId : nft token ID
*/
export async function transferSingleItem(collection, from, to, tokenId, chainId, provider) {
    const nftToken = getCollectionContract('single', collection, chainId, provider);
    try {
        const tx = await nftToken.safeTransferFrom(from, to, tokenId);
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * transferMultiItem(collection, from, to, tokenId, amount, chainId, provider)
 * collection : collection address
 * from : sender address
 * to : receiver address
 * tokenId : nft token ID
 * amount : transfer amount
*/
export async function transferMultiItem(collection, from, to, tokenId, amount, chainId, provider) {
    const nftToken = getCollectionContract('multi', collection, chainId, provider);
    var data = [];
    try {
        const tx = await nftToken.safeTransferFrom(from, to, tokenId, amount, data);
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}




/**
 * Market Contract Management
 */

/**
 * listSingleItem(collection, owner, token_id, tokenAddr, price, chainId, provider)
 * collection : SingleNFT collection addresss
 * owner : nft token owner
 * token_id : nft token id
 * tokenAddr : payment token address
 * price : nft token price
 */
export async function listSingleItem(collection, owner, token_id, tokenAddr, price, chainId, provider) {
    const marketContract = getContractObj('SingleFixed', chainId, provider);
    const marketContractInfo = getContractInfo('SingleFixed', chainId);
    const Token = getTokenContract(tokenAddr, chainId, provider);
    if (!marketContract || !marketContractInfo || !Token) return false
    try {
        let isApproved = await isNFTApproved('single', collection, marketContractInfo.address, owner, chainId, provider);
        if (!isApproved) {
            isApproved = await setNFTApproval('single', collection, marketContractInfo.address, chainId, provider);
        }
        if (isApproved) {
            var decimal = 18;
            if (tokenAddr !== '0x0000000000000000000000000000000000000000') {
                decimal = await Token.decimals();
            }
            const tx = await marketContract.singleList(collection, token_id, tokenAddr, toWei(price, decimal));
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * singleDelistItem(id, chainId, provider)
 * id : pair ID
 */
export async function singleDelistItem(id, chainId, provider) {
    const marketContract = getContractObj('SingleFixed', chainId, provider);
    if (!marketContract) return false;
    try {
        const tx = await marketContract.singleDelist(id);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

/**
 * singleBuy(account, id, tokenAddr, price, chainId, provider)
 * id : pair ID
 * tokenAddr : payment token address
 * price : pair price
 */
export async function singleBuy(account, id, tokenAddr, price, chainId, provider) {
    const marketContract = getContractObj('SingleFixed', chainId, provider);
    const marketContractInfo = getContractInfo('SingleFixed', chainId);
    if (!marketContract || !marketContractInfo) return false;
    try {
        if (tokenAddr === '0x0000000000000000000000000000000000000000') {
            const tx = await marketContract.singleBuy(id, {
                value: toWei(price, 18)
            })
            await tx.wait(2);
            return true;
        } else {
            const Token = getTokenContract(tokenAddr, chainId, provider);
            if (!Token) return false;
            let tokenApproveStatus = await isTokenApproved(account, tokenAddr, price, marketContractInfo.address, chainId, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(tokenAddr, marketContractInfo.address, chainId, provider);
            }
            if (tokenApproveStatus) {
                const tx = await marketContract.singleBuy(id, {
                    value: BigNumber.from(0)
                })
                await tx.wait(2);
                return true;
            }
            return false;
        }
    } catch (error) {
        console.log(error)
        return false;
    }
}

/**
 * listMultiItem(collection, owner, token_id, amount, tokenAddr, price, chainId, provider)
 * collection : MultipleNFT collection addresss
 * owner : nft token owner
 * token_id : nft token id
 * amount : nft item amount
 * tokenAddr : payment token address
 * price : nft token price
 */
export async function listMultiItem(collection, owner, token_id, amount, tokenAddr, price, chainId, provider) {
    const marketContract = getContractObj('MultipleFixed', chainId, provider);
    const marketContractInfo = getContractInfo('MultipleFixed', chainId);
    const Token = getTokenContract(tokenAddr, chainId, provider);
    if (!marketContract || !marketContractInfo || !Token) return false;
    try {
        let isApproved = await isNFTApproved('multi', collection, marketContractInfo.address, owner, chainId, provider);
        if (!isApproved) {
            isApproved = await setNFTApproval('multi', collection, marketContractInfo.address, chainId, provider);
        }
        if (isApproved) {
            var decimal = 18;
            if (tokenAddr !== '0x0000000000000000000000000000000000000000') {
                decimal = await Token.decimals();
            }
            const tx = await marketContract.multipleList(collection, token_id, tokenAddr, amount, toWei(price, decimal));
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * multipleDelistItem(id, chainId, provider)
 * id : pair ID
 */
export async function multipleDelistItem(id, chainId, provider) {
    const marketContract = getContractObj('MultipleFixed', chainId, provider);
    if (!marketContract) return false;
    try {
        const tx = await marketContract.multipleDelist(id);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
    } catch (e) {
        console.log(e)
        return false;
    }
}

/**
 * multipleBuy(account, id, amount, tokenAddr, price, chainId, provider)
 * id : pair ID
 * amount: nft item amount
 * tokenAddr : payment token address
 * price : pair price
 */
export async function multipleBuy(account, id, amount, tokenAddr, price, chainId, provider) {
    const marketContract = getContractObj('MultipleFixed', chainId, provider);
    const marketContractInfo = getContractInfo('MultipleFixed', chainId);
    if (!marketContract || !marketContractInfo) return false;
    try {
        if (tokenAddr === '0x0000000000000000000000000000000000000000') {
            const tx = await marketContract.multipleBuy(id, amount, {
                value: toWei(price * amount, 18)
            })
            await tx.wait(2);
            return true;
        } else {
            const Token = getTokenContract(tokenAddr, chainId, provider);
            if (!Token) return false;
            let tokenApproveStatus = await isTokenApproved(account, tokenAddr, price * amount, marketContractInfo.address, chainId, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(tokenAddr, marketContractInfo.address, chainId, provider);
            }
            if (tokenApproveStatus) {
                const tx = await marketContract.multipleBuy(id, amount, {
                    value: BigNumber.from(0)
                })
                await tx.wait(2);
                return true;
            }
            return false;
        }

    } catch (error) {
        console.log(error)
        return false;
    }
}


/**
 * Auction Contract Management
 */

/**
 * createAuction(collection, owner, token_id, tokenAddr, startPrice, startTime, endTime, chainId, provider)
 * collection : SingleNFT collection address
 * owner : nft token owner
 * token_id : nft token id
 * tokenAddr : governance token symbol ETH / POLL
 * startPrice : start bid price
 * startTime : auction start time
 * endTime : auction end time
 */
export async function createAuction(collection, owner, token_id, tokenAddr, startPrice, startTime, endTime, chainId, provider) {
    const auctionContract = getContractObj('SingleAuction', chainId, provider);
    const auctionContractInfo = getContractInfo('SingleAuction', chainId);
    const tokenContract = getTokenContract(tokenAddr, chainId, provider);
    if (!auctionContract || !auctionContractInfo || !tokenContract) return false;
    try {
        let isApproved = await isNFTApproved('single', collection, auctionContractInfo.address, owner, chainId, provider);
        if (!isApproved) {
            isApproved = await setNFTApproval('single', collection, auctionContractInfo.address, chainId, provider);
        }
        if (isApproved) {
            var decimal = 18;
            if (tokenAddr !== '0x0000000000000000000000000000000000000000') {
                decimal = await tokenContract.decimals();
            }
            const tx = await auctionContract.createAuction(collection, token_id, tokenAddr, toWei(startPrice, decimal), startTime, endTime);
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * finalizeAuction(id, chainId, provider)
 * id : auction ID
 */
export async function finalizeAuction(id, chainId, provider) {
    const auctionContract = getContractObj('SingleAuction', chainId, provider);
    if (!auctionContract) return false;
    try {
        const tx = await auctionContract.finalizeAuction(id);
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

/**
 * bidOnAuction(account, id, tokenAddr, price, chainId, provider)
 * account : bidder address
 * id : auction ID
 * tokenAddr : payment token address
 * price : bid price
 */
export async function bidOnAuction(account, id, tokenAddr, price, chainId, provider) {
    const auctionContract = getContractObj('SingleAuction', chainId, provider);
    const auctionContractInfo = getContractInfo('SingleAuction', chainId);
    if (!auctionContract) return false;
    try {
        if (tokenAddr === '0x0000000000000000000000000000000000000000') {
            const tx = await auctionContract.bidOnAuction(id, toWei(price, 18), {
                value: toWei(price, 18)
            })
            await tx.wait(2);
            return true;
        } else {
            const Token = getTokenContract(tokenAddr, chainId, provider);
            if (!Token) return false;

            let tokenApproveStatus = await isTokenApproved(account, tokenAddr, price, auctionContractInfo.address, chainId, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(tokenAddr, auctionContractInfo.address, chainId, provider);
            }
            if (tokenApproveStatus) {
                const decimal = await Token.decimals();
                const tx = await auctionContract.bidOnAuction(id, toWei(price, decimal), {
                    value: BigNumber.from(0)
                })
                await tx.wait(2);
                return true;
            }
            return false;
        }
    } catch (error) {
        console.log(error)
        return false;
    }
}




/**
 * MysteryBox Contract Management
*/

/**
 * createMysteryBox(name, uri, tokenAddress, price, provider)
 * name : MysteryBox name
 * uri : MysteryBox uri (it include name, description and image information)
 * tokenAddress : payment Token Address
 * price : playOncePrice
 */
export async function createMysteryBox(name, uri, tokenAddress, price, chainId, provider) {
    const factoryContract = getContractObj('MysteryBoxFactory', chainId, provider);
    if (!factoryContract) return false
    try {
        const creatingFee = await factoryContract.creatingFee();
        var decimal = 18;
        if (tokenAddress !== '0x0000000000000000000000000000000000000000') {
            const Token = getTokenContract(tokenAddress, chainId, provider);
            decimal = await Token.decimals();
        }
        const tx = await factoryContract.createMysteryBox(name, uri, tokenAddress, toWei(price, decimal), {
            value: creatingFee
        })
        await tx.wait(2)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * addToken(account, mysteryboxAddr, cardType, collection, tokenId, amount, provider)
 * mysteryboxAddr : mysteryboxAddr address
 * cardType : nft token type => 0:ERC721, 1:ERC1155
 * collection : adding NFT Collection Address
 * tokenId : adding NFT Token ID
 * amount : adding edition amount
 */

export async function addToken(account, mysteryboxAddr, cardType, collection, tokenId, amount, chainId, provider) {
    let nftType = 'single';
    if (cardType === 1) {
        nftType = 'multi';
    }
    const mysteryboxContract = getMysteryBoxContract(mysteryboxAddr, chainId, provider);
    if (!mysteryboxContract) return false

    try {
        let isApproved = await isNFTApproved(nftType, collection, mysteryboxAddr, account, chainId, provider);
        if (!isApproved) {
            isApproved = await setNFTApproval(nftType, collection, mysteryboxAddr, chainId, provider);
        }
        if (isApproved) {
            const tx = await mysteryboxContract.addToken(cardType, collection, tokenId, amount);
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true
            }
        }
        return false;
    } catch (e) {
        console.log(e);
        return false;
    }
}


/**
 * spin(account, mysteryboxAddr, tokenAddr, provider)
 * mysteryboxAddr : mysterybox address
 * tokenAddr : payment Token Address
 * price : price to spin
 */
export async function spin(account, mysteryboxAddr, tokenAddr, chainId, provider) {
    const mysteryboxContract = getMysteryBoxContract(mysteryboxAddr, chainId, provider);
    if (!mysteryboxContract) return false

    try {
        const price = await mysteryboxContract.price();

        if (tokenAddr === '0x0000000000000000000000000000000000000000') {

            const gasEstimated = await mysteryboxContract.estimateGas.spin({
                value: price,
            });
            const gasLimit = gasEstimated.toNumber() * 2;
            const tx = await mysteryboxContract.spin({
                value: price,
                gasLimit: gasLimit
            });
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                const interf = new ethers.utils.Interface(MysteryBoxABI);
                const logs = receipt.logs;
                console.log('logs:', logs);
                let key = '';
                for (let index = 0; index < logs.length; index++) {
                    const log = logs[index];
                    if (mysteryboxAddr?.toLowerCase() === log.address?.toLowerCase()) {
                        key = interf.parseLog(log).args[1];
                        console.log('key:', key);
                        return key;
                    }
                }
            }
            return false;
        } else {
            const Token = getTokenContract(tokenAddr, chainId, provider);
            if (!Token) return false;
            let tokenApproveStatus = await isTokenApproved(account, tokenAddr, 1, mysteryboxAddr, chainId, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(tokenAddr, mysteryboxAddr, chainId, provider);
            }
            if (tokenApproveStatus) {
                const gasEstimated = await mysteryboxContract.estimateGas.spin();
                const gasLimit = gasEstimated.toNumber() * 2;
                const tx = await mysteryboxContract.spin({
                    gasLimit: gasLimit
                });
                const receipt = await tx.wait(2);
                if (receipt.confirmations) {
                    const interf = new ethers.utils.Interface(MysteryBoxABI);
                    const logs = receipt.logs;
                    console.log('logs:', logs);
                    let key = '';
                    for (let index = 0; index < logs.length; index++) {
                        const log = logs[index];
                        if (mysteryboxAddr?.toLowerCase() === log.address?.toLowerCase()) {
                            key = interf.parseLog(log).args[1];
                            console.log('key:', key);
                            return key;
                        }
                    }
                }
                return false;
            }
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}





/**
 * NFT Staking Contract Management
 */

/**
 * createSingleNFTStaking
*/

export async function createSingleNFTStaking(
    account,
    startTime,
    subscriptionId,
    subscription_price,
    aprIndex,
    stakeNftAddress,
    rewardTokenAddress,
    stakeNftPrice,
    maxStakedNfts,
    depositTokenAmount,
    maxNftsPerUser,
    chainId,
    provider) {
    const factoryContract = getContractObj('SingleNFTStakingFactory', chainId, provider);
    const factoryContractInfo = getContractInfo('SingleNFTStakingFactory', chainId);

    if (!factoryContract || !factoryContractInfo) return false;
    try {
        var decimal = 18;
        if (rewardTokenAddress !== '0x0000000000000000000000000000000000000000') {
            const Token = getTokenContract(rewardTokenAddress, chainId, provider);
            if (!Token) return false;
            decimal = await Token.decimals();

            let tokenApproveStatus = await isTokenApproved(account, rewardTokenAddress, parseFloat(depositTokenAmount).toFixed(decimal), factoryContractInfo.address, chainId, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(rewardTokenAddress, factoryContractInfo.address, chainId, provider);
            }
            if (tokenApproveStatus) {
                const tx = await factoryContract.createSingleNFTStaking(
                    startTime,
                    subscriptionId,
                    aprIndex,
                    stakeNftAddress,
                    rewardTokenAddress,
                    toWei(stakeNftPrice, decimal),
                    maxStakedNfts,
                    maxNftsPerUser,
                    {
                        value: toWei(subscription_price, 18)
                    }
                );
                await tx.wait(2);
                return true;
            }
            return false;
        } else {
            const tx = await factoryContract.createSingleNFTStaking(
                startTime,
                subscriptionId,
                aprIndex,
                stakeNftAddress,
                rewardTokenAddress,
                toWei(stakeNftPrice, 18),
                maxStakedNfts,
                maxNftsPerUser,
                {
                    value: toWei(subscription_price + depositTokenAmount, 18)
                }
            );
            await tx.wait(2);
            return true;
        }

    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * createMultiNFTStaking
*/
export async function createMultiNFTStaking(
    account,
    startTime,
    subscriptionId,
    subscription_price,
    aprIndex,
    stakeNftAddress,
    rewardTokenAddress,
    stakeNftPrice,
    maxStakedNfts,
    depositTokenAmount,
    maxNftsPerUser,
    chainId,
    provider) {
    const factoryContract = getContractObj('MultiNFTStakingFactory', chainId, provider);
    const factoryContractInfo = getContractInfo('MultiNFTStakingFactory', chainId);

    if (!factoryContract || !factoryContractInfo) return false;
    try {
        var decimal = 18;
        if (rewardTokenAddress !== '0x0000000000000000000000000000000000000000') {
            const Token = getTokenContract(rewardTokenAddress, chainId, provider);
            if (!Token) return false;
            decimal = await Token.decimals();

            let tokenApproveStatus = await isTokenApproved(account, rewardTokenAddress, parseFloat(depositTokenAmount).toFixed(decimal), factoryContractInfo.address, chainId, provider);
            if (!tokenApproveStatus) {
                tokenApproveStatus = await approveToken(rewardTokenAddress, factoryContractInfo.address, chainId, provider);
            }
            if (tokenApproveStatus) {
                const tx = await factoryContract.createMultiNFTStaking(
                    startTime,
                    subscriptionId,
                    aprIndex,
                    stakeNftAddress,
                    rewardTokenAddress,
                    toWei(stakeNftPrice, decimal),
                    maxStakedNfts,
                    maxNftsPerUser,
                    {
                        value: toWei(subscription_price, 18)
                    }
                );
                await tx.wait(2);
                return true;
            }
            return false;
        } else {
            const tx = await factoryContract.createMultiNFTStaking(
                startTime,
                subscriptionId,
                aprIndex,
                stakeNftAddress,
                rewardTokenAddress,
                toWei(stakeNftPrice, 18),
                maxStakedNfts,
                maxNftsPerUser,
                {
                    value: toWei(subscription_price + depositTokenAmount, 18)
                }
            );
            await tx.wait(2);
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * getPendingRewards
*/
export async function getPendingRewards(type, staking_address, account, chainId, provider) {
    const contractObj = getStakingContract(type, staking_address, chainId, provider);
    if (!contractObj) return 0;
    try {
        const pendingRewards = await contractObj.pendingRewards(account);
        const stakingParams = await contractObj.stakingParams();
        console.log('staking_address:', staking_address);
        console.log('pendingRewards:', pendingRewards);
        var decimal = 18;
        if (stakingParams.rewardTokenAddress !== '0x0000000000000000000000000000000000000000') {
            var tokenContract = getTokenContract(stakingParams.rewardTokenAddress, chainId, provider);
            if (tokenContract) {
                decimal = await tokenContract.decimals();
            }
        }
        return parseFloat(toEth(pendingRewards, decimal));
    } catch (error) {
        console.log(error)
        return 0;
    }
}

/**
 * stake
*/
export async function stake(type, staking_address, stakeNftAddress, tokenIdList, amountList, depositFeePerNft, account, chainId, provider) {
    if (type === 'single') {
        const result = await singleStake(staking_address, stakeNftAddress, tokenIdList, depositFeePerNft, account, chainId, provider);
        return result;
    } else if (type === 'multi') {
        const result = await multiStake(staking_address, stakeNftAddress, tokenIdList, amountList, depositFeePerNft, account, chainId, provider);
        return result;
    } else {
        return false;
    }
}
// singleStake
export async function singleStake(staking_address, stakeNftAddress, tokenIdList, depositFeePerNft, account, chainId, provider) {
    const contractObj = getStakingContract('single', staking_address, chainId, provider);
    if (!contractObj) return false;
    try {

        let isApproved = await isNFTApproved('single', stakeNftAddress, staking_address, account, chainId, provider);
        if (!isApproved) {
            isApproved = await setNFTApproval('single', stakeNftAddress, staking_address, chainId, provider);
        }
        if (isApproved) {
            const countToStake = tokenIdList.length;
            const depositValue = depositFeePerNft * countToStake;
            const tx = await contractObj.stake(tokenIdList, {
                value: toWei(depositValue, 18)
            });
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
        }
        return false;
    } catch (e) {
        console.log(e)
        return false;
    }
}

// multiStake
export async function multiStake(staking_address, stakeNftAddress, tokenIdList, amountList, depositFeePerNft, account, chainId, provider) {
    const contractObj = getStakingContract('multi', staking_address, chainId, provider);
    if (!contractObj) return false;
    try {
        let isApproved = await isNFTApproved('multi', stakeNftAddress, staking_address, account, chainId, provider);
        if (!isApproved) {
            isApproved = await setNFTApproval('multi', stakeNftAddress, staking_address, chainId, provider);
        }
        if (isApproved) {
            var amountToStake = 0;
            for (let index = 0; index < amountList.length; index++) {
                amountToStake = amountToStake + amountList[index];
            }

            const depositValue = depositFeePerNft * amountToStake;
            const tx = await contractObj.stake(tokenIdList, amountList, {
                value: toWei(depositValue, 18)
            });
            const receipt = await tx.wait(2);
            if (receipt.confirmations) {
                return true;
            }
        }
        return false;

    } catch (e) {
        console.log(e)
        return false;
    }
}


/**
 * withdraw
*/
export async function withdraw(type, staking_address, tokenIdList, amountList, withdrawFeePerNft, chainId, provider) {
    if (type === 'single') {
        const result = await singleWithdraw(staking_address, tokenIdList, withdrawFeePerNft, chainId, provider);
        return result;
    } else if (type === 'multi') {
        const result = await multiWithdraw(staking_address, tokenIdList, amountList, withdrawFeePerNft, chainId, provider);
        return result;
    } else {
        return false;
    }
}
// singleWithdraw
export async function singleWithdraw(staking_address, tokenIdList, withdrawFeePerNft, chainId, provider) {
    const contractObj = getStakingContract('single', staking_address, chainId, provider);
    if (!contractObj) return false;
    try {
        const countToWithdraw = tokenIdList.length;
        const withdrawValue = withdrawFeePerNft * countToWithdraw;
        const tx = await contractObj.withdraw(tokenIdList, {
            value: toWei(withdrawValue, 18)
        });
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e)
        return false;
    }
}

// multiWithdraw
export async function multiWithdraw(staking_address, tokenIdList, amountList, withdrawFeePerNft, chainId, provider) {
    const contractObj = getStakingContract('multi', staking_address, chainId, provider);
    if (!contractObj) return false;
    try {
        var amountToWithdraw = 0;
        for (let index = 0; index < amountList.length; index++) {
            amountToWithdraw = amountToWithdraw + amountList[index];
        }

        const withdrawValue = withdrawFeePerNft * amountToWithdraw;
        const tx = await contractObj.withdraw(tokenIdList, amountList, {
            value: toWei(withdrawValue, 18)
        });
        const receipt = await tx.wait(2);
        if (receipt.confirmations) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e)
        return false;
    }
}


export async function getStakingSubscriptions(type, chainId, provider) {
    var factoryContract = getContractObj('SingleNFTStakingFactory', chainId, provider);
    if (type === 'multi') {
        factoryContract = getContractObj('MultiNFTStakingFactory', chainId, provider);
    }
    if (!factoryContract) return [];

    try {
        var allSubscriptions = await factoryContract.allSubscriptions();
        if (allSubscriptions && allSubscriptions.length > 0) {
            let ret = [];
            for (let index = 0; index < allSubscriptions.length; index++) {
                const subscriptionInfo = allSubscriptions[index];
                var subscriptionItem = {
                    id: Number(subscriptionInfo[0]),
                    name: subscriptionInfo[1],
                    period: Number(subscriptionInfo[2]),
                    price: ethers.utils.formatEther(subscriptionInfo[3]),
                    bValid: subscriptionInfo[4]
                }
                ret.push(subscriptionItem)
            }
            return ret;
        }
        return [];
    } catch (error) {
        console.log(error)
        return [];
    }
}

export async function getStakingAprs(type, chainId, provider) {

    var factoryContract = getContractObj('SingleNFTStakingFactory', chainId, provider);
    if (type === 'multi') {
        factoryContract = getContractObj('MultiNFTStakingFactory', chainId, provider);
    }
    if (!factoryContract) return [];

    try {
        var allAprs = await factoryContract.allAprs();
        if (allAprs && allAprs.length > 0) {
            let ret = [];
            for (let index = 0; index < allAprs.length; index++) {
                const aprInfo = allAprs[index];
                ret.push(Number(aprInfo))
            }
            return ret;
        }
        return [];
    } catch (error) {
        console.log(error)
        return [];
    }
}


// nft minting enging

// get mint information
export async function getMintingInfo(chainId, provider) {
    const mintContract = getContractObj('DropERC1155', chainId, provider);
    const tokenId = CONTRACTS_BY_NETWORK[369].DropERC1155.tokenId;
    if (!mintContract) return null;
    try {
        var totalSupply = await mintContract.totalSupply(tokenId);
        var conditionId = await mintContract.getActiveClaimConditionId(tokenId);
        var activeCondition = await mintContract.getClaimConditionById(tokenId, conditionId);
        return {
            totalSupply: Number(totalSupply),
            activeCondition: activeCondition
        };
    } catch (e) { return null; }
}

export async function claimNFT(account, mintInfo, amount, chainId, provider) {
    const mintContract = getContractObj('DropERC1155', chainId, provider);
    const tokenId = CONTRACTS_BY_NETWORK[369].DropERC1155.tokenId;
    const curreny = mintInfo.activeCondition.currency;    
    const quantityLimitPerWallet = mintInfo.activeCondition.quantityLimitPerWallet;    
    const pricePerToken = Number(toEth(mintInfo.activeCondition.pricePerToken, 18));
    const allowlistProof = {
        proof: [],
        quantityLimitPerWallet: quantityLimitPerWallet,
        pricePerToken: toWei(pricePerToken, 18),
        currency: curreny,        
    };
    if (!mintContract) return null;

    try {

        const tx = await mintContract.claim(
            account,
            tokenId,
            amount,
            curreny,
            toWei(pricePerToken, 18),
            allowlistProof,
            '0x',
            {
                value: toWei(pricePerToken * amount, 18)
            })
        await tx.wait(2);
        return true;

    } catch (error) {
        console.log(error)
        return false;
    }
}
