# Creova

**Creova** is a Web3-native funding platform for decentralised, milestone-based crowdfunding and DAO treasury grants — built for the Ethereum ecosystem.

🔗 Live: [creova.xyz](https://www.creova.xyz)

---

## ✨ What is Creova?

Creova enables communities, DAOs, and public goods projects to coordinate transparent funding without the need for tokens or central intermediaries. Milestone-based smart contracts release ETH as work is completed and verified by the community.

All components are open source and designed to support Ethereum-aligned public goods.

---

## 🛠️ Features

- **Milestone-Based Funding**: ETH is released upon verified deliverables
- **DAO-Friendly**: Integrates with treasury wallets and delegate curation
- **Fully Open Source**: MIT-licensed contracts and frontend
- **Public Transparency**: All fund flows and milestone verifications are onchain
- **No Token Required**: Powered by ETH and governance — not speculation

---

## 🧩 Repo Structure

```bash
/contracts          # Solidity smart contracts
/frontend           # Next.js frontend application (Chakra UI)
/scripts            # Deployment and interaction scripts (Hardhat)
/ignition/modules   # Hardhat deployment modules
/test               # Smart contract tests
```

---

## 🚀 Getting Started (Developers)

1. Install dependencies:

```bash
npm install
```

2. Compile smart contracts:

```bash
npx hardhat compile
```

3. Deploy contracts to a testnet:

```bash
npx hardhat run scripts/deploy.js --network goerli
```

4. Run frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## 📚 Documentation

- [Website](https://www.creova.xyz)
- Governance Playbook (Coming Soon)
- Starter Kit for DAOs (Coming Soon)

---

## 🤝 Contributing

Contributions are welcome!  
Please open an issue or submit a pull request if you have improvements, suggestions, or fixes.

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🌍 Public Goods Commitment

Creova is committed to building transparent, non-extractive, and community-governed funding infrastructure for Ethereum and aligned ecosystems.
