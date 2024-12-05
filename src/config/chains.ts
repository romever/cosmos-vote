export interface ChainConfig {
  chainId: string;
  chainName: string;
  restEndpoint: string;
  rpcEndpoint: string;
  denom: string;
  displayName: string;
}

export const CHAIN_CONFIGS: ChainConfig[] = [
  {
    chainId: "cosmoshub-4",
    chainName: "cosmos",
    restEndpoint: "https://rest.cosmos.directory/cosmoshub",
    rpcEndpoint: "https://rpc.cosmos.directory/cosmoshub",
    denom: "uatom",
    displayName: "Cosmos Hub"
  },
  {
    chainId: "osmosis-1",
    chainName: "osmosis",
    restEndpoint: "https://rest.cosmos.directory/osmosis",
    rpcEndpoint: "https://rpc.cosmos.directory/osmosis",
    denom: "uosmo",
    displayName: "Osmosis"
  },
  {
    chainId: "celestia",
    chainName: "celestia",
    restEndpoint: "https://rest.cosmos.directory/celestia",
    rpcEndpoint: "https://rpc.cosmos.directory/celestia",
    denom: "utia",
    displayName: "Celestia"
  },
  {
    chainId: "dymension_1100-1",
    chainName: "dymension",
    restEndpoint: "https://rest.cosmos.directory/dymension",
    rpcEndpoint: "https://rpc.cosmos.directory/dymension",
    denom: "udym",
    displayName: "Dymension"
  },
  {
    chainId: "neutron-1",
    chainName: "neutron",
    restEndpoint: "https://rest.cosmos.directory/neutron",
    rpcEndpoint: "https://rpc.cosmos.directory/neutron",
    denom: "untrn",
    displayName: "Neutron"
  }
]; 