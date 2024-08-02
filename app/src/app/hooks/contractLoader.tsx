import { useEffect, useState } from "react";
import { useChainId } from "wagmi";

// Pre-imported contract addresses
import contractAddressesBaseSepolia from "@/contracts/contractAddresses-baseSepolia.json";
import contractAddressesLocalhost from "@/contracts/contractAddresses-localhost.json";
import contractAddressesPolygon from "@/contracts/contractAddresses-polygon.json";
import contractAddressesSepolia from "@/contracts/contractAddresses-sepolia.json";
// Add more imports as needed

export const useContractAddressLoader = () => {
  const [contractsAddresses, setContracts] = useState({
    UMDP: "",
    MusicERC721: "",
    MusicERC721Factory: "",
  });
  
  const chainId = useChainId();

  useEffect(() => {
    // Function to select and set contract addresses based on the current chain ID
    function selectContractAddresses() {
      switch (chainId) {
        // case 1: // chain id for Mainnet
        //   setContracts(contractAddressesMainnet);
        //   break;
        // case 5: // chain id for Goerli
        //   setContracts(contractAddressesGoerli);
        //   break;
        case 31337: // chain id for Localhost
          setContracts(contractAddressesLocalhost);
          break;
        case 137: // chain id for Polygon
          setContracts(contractAddressesPolygon);
          break;
        case 80001: // chain id for Polygon Mumbai
          setContracts(contractAddressesPolygon);
          break;
        case 84532: // chain id for Localhost
          setContracts(contractAddressesBaseSepolia);
          break;
        case 11155111: // chain id for Sepolia
          setContracts(contractAddressesSepolia);
          break;
        // Add more cases as needed
        default:
          // Consider having a default or error state
          setContracts(contractAddressesLocalhost); // Defaulting to localhost for safety
          break;
      }
    }

    selectContractAddresses();
  }, [chainId]);

  return contractsAddresses;
};
