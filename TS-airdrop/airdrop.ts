import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

// import keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
console.log("Keypair is: ", keypair.publicKey.toBase58());
// Establish connection to Solana Devnet
const connection = new Connection("https://api.devnet.solana.com");

// Now, we are gonna claim 2 devnet SOL tokens
(async () => {
  try {
    if (!Array.isArray(wallet)) {
      throw new Error("Invalid Wallet format");
    }
    // Claiming 2 devnet SOL tokens
    const txHash = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    console.log(`Success! Check out your tx here
            https://explorer.solana.com/tx/${txHash}?cluster=devnet`);

    // The transaction hash link is: https://explorer.solana.com/tx/PJzW1bvBxBFDpGEneXqYFyAsDJahroeaHTbjVNYnrnb6BH65MVnwC9LLWy7Nt5tXGwd7X32AmSLwxCZ1k7fCHvn?cluster=devnet
  } catch (error) {
    console.error(`Oops! Something Went Wrong!, ${error}`);
  }
})();
