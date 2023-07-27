import { PoweredByUnderdog } from "@/components/PoweredByUnderdog";
import { useUnderdogClient } from "@/hooks/useUnderdogClient";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NetworkEnum, StatusEnum, useNft } from "@underdog-protocol/js";
import { useProject } from "@underdog-protocol/js";
import { useEffect, useState } from "react";

const projectId = 1;

export function IndexView() {
  const underdogClient = useUnderdogClient(NetworkEnum.Devnet);

  const { publicKey } = useWallet();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [dropping, setDropping] = useState(false);

  const { project } = useProject(
    {
      params: { projectId },
      query: { page: 1, limit: 5, orderBy: "desc" },
    },
    underdogClient
  );
  const [nftId, setNftId] = useState(0);

  const { nft, refetch } = useNft({ 
    params: { projectId, nftId },
  }, underdogClient);

  useEffect(() => {
    if (dropping) {
      setIntervalId(setInterval(() => refetch(), 2000));
    }
  }, [dropping, refetch]);

  useEffect(() => {
    if (nft?.status === StatusEnum.Confirmed) {
      clearInterval(intervalId);
    }
  }, [intervalId, nft]);


  useEffect(() => {
    if (!publicKey) {
      setNftId(0);
    }
  }, [publicKey]);

  useEffect(() => {
    if (publicKey && project && !nft) {
      underdogClient.createNft({
        params: { projectId: 1 },
        body: {
          name: "Underdog NFT",
          image: "https://picsum.photos/200",
          receiverAddress: publicKey.toBase58(),
          attributes: { points: 0 },
          upsert: false,
        },
      }).then((response) => {
        setNftId(response.nftId)
        setDropping(true);
      });
    }
  }, [publicKey, project]);

  if (!project) return null;

  const getXrayNftLink = (mintAddress: string) =>
    `https://xray.helius.xyz/token/${mintAddress}`;

  return (
    <main className="flex min-h-screen flex-col items-center py-8 space-y-8 max-w-sm mx-auto w-full">
      <div className="space-y-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center text-white">
          Connect Your Wallet & Get An NFT
        </h1>

        {nft ? (
          <div className="w-full space-y-4">
            <img src={nft.image} className="w-full" />
          </div>
        ) : (
          <img src={project.image} />
        )}

        <div className="space-y-2 flex-col flex items-center">
          <WalletMultiButton className="bg-purple-900" />

          <div className="text-sm text-orange-400">
            {nft ? (
              <a href={getXrayNftLink(nft.mintAddress)} target="_blank">
                View on XRAY
              </a>
            ) : publicKey ? (
              <p>Looking for your NFT 👀</p>
            ) : (
              <p>Connect your wallet to get an NFT</p>
            )}
          </div>
        </div>
      </div>

      <PoweredByUnderdog />
    </main>
  );
}
