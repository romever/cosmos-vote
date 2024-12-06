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
  },
  {
    chainId: "irishub-1",
    chainName: "iris",
    restEndpoint: "https://rest.cosmos.directory/iris",
    rpcEndpoint: "https://rpc.cosmos.directory/iris",
    denom: "uiris",
    displayName: "IRISnet"
  },
  {
    chainId: "kava_2222-10",
    chainName: "kava",
    restEndpoint: "https://rest.cosmos.directory/kava",
    rpcEndpoint: "https://rpc.cosmos.directory/kava",
    denom: "ukava",
    displayName: "Kava"
  },
  {
    chainId: "emoney-3",
    chainName: "emoney",
    restEndpoint: "https://rest.cosmos.directory/emoney",
    rpcEndpoint: "https://rpc.cosmos.directory/emoney",
    denom: "ungm",
    displayName: "e-Money"
  },
  {
    chainId: "akashnet-2",
    chainName: "akash",
    restEndpoint: "https://rest.cosmos.directory/akash",
    rpcEndpoint: "https://rpc.cosmos.directory/akash",
    denom: "uakt",
    displayName: "Akash"
  },
  {
    chainId: "regen-1",
    chainName: "regen",
    restEndpoint: "https://rest.cosmos.directory/regen",
    rpcEndpoint: "https://rpc.cosmos.directory/regen",
    denom: "uregen",
    displayName: "Regen"
  },
  {
    chainId: "stargaze-1",
    chainName: "stargaze",
    restEndpoint: "https://rest.cosmos.directory/stargaze",
    rpcEndpoint: "https://rpc.cosmos.directory/stargaze",
    denom: "ustars",
    displayName: "Stargaze"
  },
  {
    chainId: "core-1",
    chainName: "persistence",
    restEndpoint: "https://rest.cosmos.directory/persistence",
    rpcEndpoint: "https://rpc.cosmos.directory/persistence",
    denom: "uxprt",
    displayName: "Persistence"
  },
  {
    chainId: "shentu-2.2",
    chainName: "shentu",
    restEndpoint: "https://rest.cosmos.directory/shentu",
    rpcEndpoint: "https://rpc.cosmos.directory/shentu",
    denom: "uctk",
    displayName: "Shentu"
  }
]; 