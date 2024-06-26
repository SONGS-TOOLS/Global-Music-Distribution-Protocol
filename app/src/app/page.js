"use client";

import ConnectButton from "@/components/ConnectButton";
import Grid from "@/components/Grid";
import StepsList from "@/components/StepList";
import Step1 from "@/components/Steps/Step1";
import Step2 from "@/components/Steps/Step2";
import Step3 from "@/components/Steps/Step3";
import { usePageContext } from "@/context/PageContext";
import {
  Body3,
  Button,
  Headline1,
  Headline3
} from "@gordo-d/mufi-ui-components";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useChainId, useReadContract, useWriteContract } from "wagmi";
import abi from "../contracts/UMDP.json";
import contracts from "../contracts/contractAddresses.json";

export default function Home() {
  // TODO type
  const stepColors = {
    active: "text-rose-600 border-rose-600 ",
    ahead: "text-gray-500 border-gray-500 ",
  };

  const result = useReadContract({
    abi: abi,
    address: contracts.UMDP,
    functionName: "getISRCMetadataURI",
  });
  const { writeContract } = useWriteContract();
  const { currentStep, trackFile, trackCover, setStep } = usePageContext();
  const [trackCoverUrl, setTrackCoverUrl] = useState("");
  const [trackFileUrl, setTrackFileUrl] = useState("");
  const {chainId} = useChainId();

  useEffect(() => {
    if (trackCover) {
      const url = URL.createObjectURL(trackCover);
      setTrackCoverUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [trackCover]);

  useEffect(() => {
    if (trackFile) {
      const url = URL.createObjectURL(trackFile);
      setTrackFileUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [trackFile]);

  const colorClass =
    stepColors[currentStep] || "text-gray-500 border-gray-500 ";

  const steps = [
    {
      stepNumber: 0,
      title: "Wrapped Song",
      details: "A special Music NFT",
    },
    {
      stepNumber: 1,
      title: "Song Royalties distribution",
      details: "Add the song participants",
    },
    { stepNumber: 2, title: "Prepare Release", details: "Pre-release review" },
  ];

  return (
    <main className="flex w-screen justify-center text-black">
      <div className="max-w-6xl w-full">
        <Grid>
          {/* 
          TOPBAR
           */}

          <header className="mx-3 relative mt-3 col-start-1 col-end-13 flex justify-between items-center border-2 bg-white/50 border-rose-300 backdrop-blur-sm rounded-full p-2">
            <div className="flex items-center gap-3 relative">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={40} // Replace with actual logo size
                height={50} // Replace with actual logo size
                className="md:inline-block"
              />
              <div className="md:flex w-full items-center">
              <h2 className="text-2xl font-semibold text-[#2b2b2b] tracking-[5px]">SONGS</h2>
                <p className="text-sm text-rose-800 pl-3 mt-1">Alpha v0.1</p>
              </div>
            </div>
            <ConnectButton />
            {/* <Profile/> */}
            {chainId !== 1 && <a
              className="text-sm underline absolute right-6 text-rose-700 top-[70px]"
              href={chainId === 11155111 ? "https://www.alchemy.com/faucets/ethereum-sepolia" : chainId === 84532 ? "https://app.optimism.io/faucet" : "" }>
              <p>{`Get ${chainId === 84532 ? "Base Sepolia" : "Sepolia"} ETH`}</p>
            </a>}
          </header>

          {/* 
          CONTENT HEADER
          */}

          {currentStep === 0 && (
            <div className="col-start-1 col-end-13 flex flex-col w-full p-5 md:p-0 pt-10 text-rose-800 px-10">
              <Headline1 color="rose-700">{"Wrapped Song"}</Headline1>
              <Body3 color="rose-500" className="md:mb-2 md:w-2/3">
                A wrapped song is a novel way to distribute your music in which
                you are the sole owner of the track, you set all the rules,
                while having the possibility to interact and publish on the same
                platforms as always.
              </Body3>
            </div>
          )}

          {currentStep === 1 && (
            <div className="col-start-1 col-end-13 flex flex-col w-full p-5 md:p-0 pt-10 text-rose-800">
              <Headline3 color="rose-700">
                {"Set Royalties distribution"}
              </Headline3>
              <Body3 color="rose-500" className="mb-2 md:w-2/3">
                {
                  "Now that you've created your basic song metadata, let's identify the participants in the song. Whether you're a solo artist or part of a group with many members, simply allocate the participation in the song by assigning percentages to each."
                }
              </Body3>
            </div>
          )}

          {currentStep === 2 && (
            <div className="col-start-1 col-end-13 flex flex-col w-full v text-rose-800">
              <Headline3 color="rose-700">{"Release your song"}</Headline3>
              <Body3 color="rose-500" className="mb-2 md:w-2/3">
                {
                  "Now that you've created your basic song metadata, let's identify the participants in the song. Whether you're a solo artist or part of a group with many members, simply allocate the participation in the song by assigning percentages to each."
                }
              </Body3>
            </div>
          )}


          <div className="col-start-1 col-end-10 mb-28 md:p-0 p-5">
          <div className="flex gap-2 mb-5 justify-between md:p-0">
              {/* <Body3 onClick={() => setStep(stepNumber-1)} className=" cursor-pointer">
                ⬅️ Back
              </Body3> */}
              <Body3 onClick={() => setStep(1)} className=" cursor-pointer">
                Ahead ➡️
              </Body3>
            {currentStep === 1 && (
              <Body3 onClick={() => setStep(0)} className=" cursor-pointer">
                ⬅️ Back
              </Body3>
            )}
          </div>
            {currentStep === 0 && <Step1 />}
            {currentStep === 1 && <Step2 />}
            {currentStep === 2 && <Step3 />}
            {currentStep === 2 && (
              <Button className="mt-5" onClick={() => setStep(0)}>
                Create a new track
              </Button>
            )}
          </div>

          <section className="col-start-10 col-end-13 pt-5 md:flex flex-col hidden">
            <StepsList steps={steps} currentStep={currentStep} />
            {trackCover && (
              <img className="rounded-xl mt-10" src={trackCoverUrl}></img>
            )}
            {trackFile && (
              <audio
                className="rounded-xl mt-5 w-full"
                controls
                src={trackFileUrl}></audio>
            )}
          </section>
        </Grid>
      </div>
    </main>
  );
}
