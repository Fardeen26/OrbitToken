# OrbitToken

OrbitToken is a decentralized web application built with **React**, **Tailwind CSS**, **Web3.js**, and **Solana's SPL Token program**. It allows users to manage their Solana tokens and SOL balance seamlessly. Users can create custom tokens with custom metadata, transfer tokens to others (including Token-22 tokens), sign messages, and see their account and token balances.

## Features

- **Create Custom Tokens**: Users can create their own token with customizable metadata (e.g., token name, symbol, image URL, etc.).
- **Transfer Tokens**: Send SPL tokens or Token-22 tokens to others using the Solana blockchain.
- **Transfer SOL**: Easily send SOL tokens to any address.
- **View Token Balances**: Displays user's token balances, including custom tokens and tokens created using Solana's Token-22 program.
- **Sign Messages**: Users can sign messages to verify ownership of their wallet.
- **View Account Balances**: Check account balance and all tokens in the user's wallet.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Blockchain Interaction**: Web3.js, SPL Token Program, Metaplex
- **Wallet Integration**: Phantom Wallet, Backpack Wallet, Brave Wallet

## Getting Started

### Prerequisites
Make sure you have the following installed:

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **Phantom Wallet** or **Backpack Wallet**
- **Solana CLI** (optional but recommended for interacting with Solana blockchain)

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Fardeen26/OrbitToken.git
   cd OrbitToken
   ```
2. **install dependencies**

    Using npm:
    ```bash
    npm install
    ```

    or using yarn:    
    ```bash
    yarn install
    ```

3. **Create a .env file in the root directory and add the following environment variables:**   

    ```bash
    VITE_UPLOADCARE_PUBLIC_KEY=''
    VITE_DEFAULT_URI='https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json'
    ```

4. **Run the app**

    Start the development server: 
    ```bash
    npm run dev
    ```

    or using yarn: 
    ```bash
    yarn install
    ```

5. **Connect Wallet**

    - Install Phantom or Backpack wallet and configure it for the Solana Devnet.
    - Connect your wallet to the app to manage tokens and SOL balance.


## How to Create a Custom Token
- Navigate to the Token page.
- Go to Create Token tab.
- Enter the token name, symbol, image URL, Decimal and Supply.
- Click Create Token.
- Approve the transaction in your wallet.

Your new token will be created and displayed in your wallet.

## How to Transfer Tokens
- Navigate to the Token page.
- Go to Create Transfer Token tab.
- Select the token you want to transfer.
- Enter the recipient's wallet address and the amount.
- Click Send Transaction and approve the transaction in your wallet.

## How to Transfer SOL
- Navigate to the Transaction page.
- Go to Transfer SOL tab.
- Enter the recipient's wallet address and the amount of SOL to send.
- Click Send Transaction and approve the transaction.

## Contributing
Contributions are welcome! Please follow these steps:
- Fork the repository.
- Create a new branch for your feature or bugfix.
- Submit a pull request, describing your changes.

## Contact
For any questions or concerns, please reach out:
- Twitter: https://x.com/fardeen14693425
- Email: fardeenmansuri0316@gmail.com