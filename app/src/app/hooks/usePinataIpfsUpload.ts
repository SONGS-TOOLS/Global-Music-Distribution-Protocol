import { useState } from "react";

interface FileType {
  file: File;
  name: string;
}

const usePinataIpfsUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadIpfs = async (
    file: File
  ): Promise<{ cid?: string; url?: string } | undefined> => {
    // setIsUploading(true);
    // setUploadError(null);
    try {
      setIsUploading(true);
      const formData = new FormData();
      file.name;
      formData.append("file", file);
      const jwtRes = await fetch("/api/files", { method: "POST" });
      const { JWT } = await jwtRes.json();
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: formData,
        }
      );

      const json = await res.json();
      const { IpfsHash } = json;

      // setCid(IpfsHash);
      setIsUploading(false);
      return {
        cid: IpfsHash,
        url: `https://purple-accurate-pinniped-799.mypinata.cloud/ipfs/${IpfsHash}`,
      };
    } catch (e: any) {
      console.log(e);
      setIsUploading(false);
      setUploadError("Upload to IPFS failed: " + e.message);

      alert("Trouble uploading file");
    }
    // try {
    //     const NFT_STORAGE_KEY = process.env.NFTSTORAGE_APIKEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEMzQTMzMjJmM0I0MTAwNERmNDI3OGVjMzI0M0VlRDVGMEU4REJFQjEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMTI5MDIxNTM2OSwibmFtZSI6Ik11ZmkifQ.MnN00doPKofIdwPDpp2kQ_DQt9zPgwoJIxac3cXtDxg'; // Replace with your actual NFT.Storage API key
    //     const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
    //     const cid = await nftstorage.storeBlob(file);
    //     setIsUploading(false);
    //     return { cid: cid, url:`https://nftstorage.link/ipfs/${cid}`};
    // } catch (error: any) {
    //     console.error("Upload to IPFS failed", error);
    //     setIsUploading(false);
    //     setUploadError("Upload to IPFS failed: " + error.message);
    //     return undefined;
    // }
  };

  return { uploadIpfs, isUploading, uploadError };
};

export default usePinataIpfsUpload;
