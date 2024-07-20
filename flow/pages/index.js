import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import * as fcl from "@onflow/fcl";
import "../flow/config.js";

export default function Home() {
  const [user, setUser] = useState({ loggedIn: false });
  const [list, setList] = useState([]);
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);

  // This keeps track of the logged in 
  // user for you automatically.
  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
    getAvailableNFTs();
    getNFTs();
  }, [])

  useEffect(() => {
    getNFTs();
  }, [user])

  async function getAvailableNFTs() {

    const result = await fcl.query({
      cadence: `
      import ExampleNFT from 0xDeployer

      pub fun main(): [&ExampleNFT.NFT?] {
        let answer: [&ExampleNFT.NFT?] = []
        let availableNFTIds = ExampleNFT.getAvailableNFTIds()
        for id in availableNFTIds {
          answer.append(ExampleNFT.getNFTMetadata(nftId: id))
        }

        return answer
      }
      `,
      args: (arg, t) => []
    });

    setList(result);
  }

  async function getNFTs() {
    try {
      const result = await fcl.query({
        cadence: `
        import ExampleNFT from 0xDeployer
        import MetadataViews from 0xNFTStandard
  
        pub fun main(address: Address): [NFT] {
          let collection = getAccount(address).getCapability(ExampleNFT.CollectionPublicPath)
                            .borrow<&ExampleNFT.Collection{MetadataViews.ResolverCollection}>()
                            ?? panic("Could not borrow a reference to the collection")
          let ids = collection.getIDs()
          let answer: [NFT] = []
          for id in ids {
            // Get the basic display information for this NFT
            let nft = collection.borrowViewResolver(id: id)
            // Get the basic display information for this NFT
            let view = nft.resolveView(Type<MetadataViews.Display>())!
            let display = view as! MetadataViews.Display
            answer.append(
              NFT(
                id: id, 
                name: display.name, 
                description: display.description, 
                thumbnail: display.thumbnail
              )
            )
          }
          return answer
        }
        pub struct NFT {
          pub let id: UInt64
          pub let name: String 
          pub let description: String 
          pub let thumbnail: AnyStruct{MetadataViews.File}
          
          init(id: UInt64, name: String, description: String, thumbnail: AnyStruct{MetadataViews.File}) {
            self.id = id
            self.name = name 
            self.description = description
            self.thumbnail = thumbnail
          }
        }
        `,
        args: (arg, t) => [
          arg(user?.addr, t.Address)
        ]
      });

      setPurchasedNFTs(result);
    } catch (e) {
      setPurchasedNFTs([]);
    }
  }

  async function purchaseNFT(nftId, price) {

    const transactionId = await fcl.mutate({
      cadence: `
      import ExampleNFT from 0xDeployer
      import FlowToken from 0xFlowToken
      import NonFungibleToken from 0xNFTStandard
      import MetadataViews from 0xNFTStandard

      transaction(nftId: UInt64, price: UFix64) {
        let Vault: &FlowToken.Vault
        let RecipientCollection: &ExampleNFT.Collection{NonFungibleToken.CollectionPublic}
        
        prepare(signer: AuthAccount) {
          self.Vault = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!

          /* 
            NOTE: In any normal DApp, you would NOT DO these next 2 lines. You would never want to destroy
            someone's collection if it's already set up. The only reason we do this for the
            tutorial is because there's a chance that, on testnet, someone already has 
            a collection here and it will mess with the tutorial.
          */
          destroy signer.load<@NonFungibleToken.Collection>(from: ExampleNFT.CollectionStoragePath)
          signer.unlink(ExampleNFT.CollectionPublicPath)

          // This is the only part you would have.
          if signer.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath) == nil {
            signer.save(<- ExampleNFT.createEmptyCollection(), to: ExampleNFT.CollectionStoragePath)
            signer.link<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(ExampleNFT.CollectionPublicPath, target: ExampleNFT.CollectionStoragePath)
          }

          self.RecipientCollection = signer.getCapability(ExampleNFT.CollectionPublicPath)
                                      .borrow<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic}>()!
        }

        execute {
          let payment <- self.Vault.withdraw(amount: price) as! @FlowToken.Vault
          ExampleNFT.purchaseNFT(nftId: nftId, recipient: self.RecipientCollection, payment: <- payment)
        }
      }
      `,
      args: (arg, t) => [
        arg(nftId, t.UInt64),
        arg(price, t.UFix64)
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999
    });

    console.log('Transaction Id', transactionId);
    getAvailableNFTs();
    getNFTs();
  }

  return (
    <div className='bg-[#011E30] flex flex-col min-h-screen'>
      <Head>
        <title>3-NFT-MINTING</title>
        <meta name="description" content="Used by Emerald Academy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='container mx-auto flex-1 p-5'>
        <div className='mb-10 flex justify-between items-center pr-10 pt-2'>
          <h1 className={styles.sooth}>NFT-MINTING</h1>
          <div className='flex space-x-4 items-center'>
            <h1 className='text-[#38E8C6]'>Address: </h1>
            <h1 className='border px-7 text-center text-[#38E8C6] text-sm py-1 rounded-xl border-[#38E8C6] w-56'>{user.loggedIn ? user.addr : "Please connect wallet -->"}</h1>
          </div>
          <div>{!user.loggedIn ? <button className='border rounded-xl border-[#38E8C6] px-5 text-sm text-[#38E8C6] py-1'
            onClick={fcl.authenticate}>Connect</button> : <button className='border rounded-xl border-[#38E8C6]
          px-5 text-sm text-[#38E8C6] py-1' onClick={fcl.unauthenticate}>Logout</button>}
          </div>
        </div>
        <hr className='border-[#38E8C6]' />
        <div className='flex  flex-col items-center justify-center pt-10'>
          <div className='pt-5'>
            {list.length == 0 ?
              <div className='flex flex-col justify-center items-center'>
                <img src='/whistle.svg' width={200} alt='nothing to see here' />
                <h1 className='pt-5 font-semibold text-gray-600'>There are no available NFTs to purchase. Mint some NFTs to make them available for purchase!</h1>
              </div> :
              <div className='flex flex-col justify-center items-center mb-12 mt-12'>
                <h1 className='pt-5 text-2xl font-semibold text-gray-200'>Available NFTs</h1>
              </div>
            }
            <div className='grid grid-cols-3 gap-20 px-5'>
              {list.map((nft, index) => (
                <div key={index} className="border shadow-lg bg-[#38E8C6] border-[#38E8C6] bg-opacity-40 bg-clip-padding rounded-lg backdrop-blur-sm p-4">
                  <div className='flex justify-between pb-2'>
                    <h1 className='font-bold text-[#38E8C6] font-xl'>{nft.name}</h1>
                    <p className='text-[#38E8C6] font-semibold'>{nft.id}</p>
                  </div>
                  <p className='text-gray-300 text-md'>{nft.description}</p>
                  <div className='flex justify-center py-2'>
                    <img src={`https://cloudflare-ipfs.com/ipfs/${nft.thumbnail}`} width={150} />
                  </div>
                  <div className='flex flex-col pt-2'>
                    <button onClick={() => purchaseNFT(nft.id, nft.price)} className="border rounded-lg py-2 text-sm px-5 border-[#38E8C6] text-blue-900 font-bold bg-[#38E8C6]">Purchase for {parseFloat(nft.price)} $FLOW</button>
                  </div>
                </div>
              ))}
            </div>
            {purchasedNFTs.length == 0 ?
              <div className='flex flex-col justify-center items-center'>
                <img src='/whistle.svg' width={200} alt='nothing to see here' />
                <h1 className='pt-5 font-semibold text-gray-600'>You have not purchased any NFTs.</h1>
              </div> :
              <div className='flex flex-col justify-center items-center mb-12 mt-12'>
                <h1 className='pt-5 text-2xl font-semibold text-gray-200'>Purchased NFTs</h1>
              </div>
            }
            <div className='grid grid-cols-3 gap-20 px-5'>
              {purchasedNFTs.map((nft, index) => (
                <div key={index} className="border shadow-lg bg-[#38E8C6] border-[#38E8C6] bg-opacity-40 bg-clip-padding rounded-lg backdrop-blur-sm p-4">
                  <div className='flex justify-between pb-2'>
                    <h1 className='font-bold text-[#38E8C6] font-xl'>{nft.name}</h1>
                    <p className='text-[#38E8C6] font-semibold'>{nft.id}</p>
                  </div>
                  <p className='text-gray-300 text-md'>{nft.description}</p>
                  <div className='flex justify-center py-2'>
                    <img src={`https://cloudflare-ipfs.com/ipfs/${nft.thumbnail.url}`} width={150} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer>
        <img className="w-full" src='/city.svg' alt='city' />
        <div className='bg-black flex pt-10 pb-5 justify-center text-white'>
          <div className='w-[80%] flex justify-between items-center'>
            <div className='font-jet text-xs'>2022. All rights reserved.</div>
            <a className='flex items-center text-[#38E8C6] hover:underline hover:underline-offset-2 space-x-1 font-poppins text-lg' href='https://academy.ecdao.org/'><h1>Emerald</h1>
              <img src='/EC_Education.png' width={40} alt='city' />
              <h1>Academy</h1></a>
            <div className='font-jet text-xs'>Created by <a href='https://discord.gg/emeraldcity' className='text-[#38E8C6] hover:underline hover:underline-offset-2 '>Emerald City DAO</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
