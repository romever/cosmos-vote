# Cosmos Governance dApp

A decentralized application for participating in governance proposals across multiple Cosmos chains. Users can view and vote on active proposals using their Keplr wallet.

> Note: This project was generated with the assistance of Cursor AI.

[中文说明](./README-CN.md)

## Features

- Multi-chain support (Cosmos Hub, Osmosis, Celestia, Dymension, Neutron)
- Real-time proposal tracking
- Visual vote distribution with pie charts
- Multilingual support (English/Chinese)
- Keplr wallet integration
- Vote status tracking

## Prerequisites

- Node.js (v16 or higher)
- Keplr wallet browser extension
- Yarn or npm

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cosmos-vote.git
cd cosmos-vote
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:5173`

## Usage

1. Connect your Keplr wallet using the connect button
2. Select the desired Cosmos chain from the chain selector
3. View active governance proposals
4. Cast your votes on proposals (Yes/No/Abstain/Veto)

## Technology Stack

- React
- TypeScript
- Vite
- TailwindCSS
- CosmJS
- i18next

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.