import { PoweredByUnderdog } from "@/components/PoweredByUnderdog";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Nft } from "@underdog-protocol/js";
import { createUnderdogClient, useProject } from "@underdog-protocol/js";
import { useEffect, useState } from "react";

const underdogClient = createUnderdogClient({});

export function IndexView() {
  const [nft, setNft] = useState<Nft>();

  const params = {
    type: {
      transferable: false,
      compressed: true,
    },
    projectId: 7,
  };

  const { publicKey } = useWallet();
 
  const { project } = useProject({
    params,
    query: { page: 1, limit: 5, orderBy: "desc" }
  });

  useEffect(() => {
    if (!publicKey) {
      setNft(undefined);
    }
  }, [publicKey]);

  useEffect(() => {
    if (publicKey && project && !nft) {
        underdogClient.getNfts({
          params,
          query: { page: 1, limit: 1, ownerAddress: publicKey.toBase58() },
        }).then((nfts) => {
          if (nfts.totalResults > 0) {
            return underdogClient.partialUpdateNft({
              params: { ...params, nftId: nfts.results[0].id },
              body: {
                attributes: {
                  "Latest Visit": new Date().toISOString(),
                }
              }
            })
          } else {
            return underdogClient.createNft({
              params,
              body: {
                name: project.name,
                image: "https://picsum.photos/200",
                upsert: true,
                receiverAddress: publicKey.toBase58(),
                attributes: {
                  "First Visit": new Date().toISOString(),
                  "Latest Visit": new Date().toISOString(),
                }
              }
            })
          }
        }).then((data) => {
          if ((data as Nft)?.mintAddress) {
            setNft(data as Nft);
          }
        });
    }
  }, [publicKey, project]);

  if (!project) return null;

  const getXrayNftLink = (mintAddress: string) => `https://xray.helius.xyz/token/${mintAddress}`;

  return (
    <main className="flex min-h-screen flex-col items-center py-8 space-y-8 max-w-sm mx-auto w-full">

      <div className="space-y-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center text-white">Connect Your Wallet & Get An NFT</h1>

        {nft ? (
          <div className="w-full space-y-4">
            <img src={nft.image} className="w-full" />
            <div className="grid grid-cols-2 gap-4">
              {nft.attributes && Object.entries(nft.attributes).map(([key, value]) => (
                <div className="border border-slate-600 rounded-lg p-4 text-sm flex flex-col">
                  <span className="text-xs text-slate-400">{key}</span>
                  <span className="text-white">{new Date(value).toLocaleString()}</span> 
                </div>
              ))}
            </div>
          </div>
        ) : (
          <img src={project.image} />
        )}

        <div className="space-y-2 flex-col flex items-center">
          <WalletMultiButton className="bg-purple-900" />

          <div className="text-sm text-orange-400">
            {nft ? (
              <a href={getXrayNftLink(nft.mintAddress)} target="_blank">View on XRAY</a>
            ) : (
              publicKey ? (
                <p>Looking for your NFT 👀</p>
              ) : (
                <p>Connect your wallet to get an NFT</p>
              )
            )}
          </div>
        </div>

      </div>

      <div className="flex flex-col w-full max-w-sm">
        <h1 className="text-2xl font-bold pb-4 text-white">Latest Visitors</h1>

        <div className="flex flex-col space-y-2 divide-y divide-gray-600">
          {project.nfts.results.map(({ ownerAddress, mintAddress, attributes }) => (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-white"> 
                  {ownerAddress?.slice(0, 4)}...{ownerAddress?.slice(-4)}
                </p>
                <p className="text-sm text-gray-400">
                  {attributes && attributes["Latest Visit"] && new Date(attributes["Latest Visit"]).toLocaleString()}
                </p>
              </div>
              <a href={getXrayNftLink(mintAddress)} target="_blank">
                👀
              </a>
            </div>
          ))}
        </div>
      </div>

      <PoweredByUnderdog />
    </main>
  );
}
