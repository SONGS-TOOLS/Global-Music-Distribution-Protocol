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

  };

  return { uploadIpfs, isUploading, uploadError };
};

export default usePinataIpfsUpload;
