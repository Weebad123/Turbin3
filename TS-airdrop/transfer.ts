import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";
import { setDefaultAutoSelectFamily } from "net";

// Importing our dev wallet keypair from the dev-wallet.json file
const devWalletFrom = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define our Turbin3 public key
const turbin3PubTo = new PublicKey(
  "EnhBRG71jQBpJE5yj7QMEYLaWaHsPGHVbs3do6dg6p9q"
);

// let's create a solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  // Attempting to transfer 0.1 SOL from dev wallet to our Turbin3 wallet
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: devWalletFrom.publicKey,
        toPubkey: turbin3PubTo,
        lamports: LAMPORTS_PER_SOL / 10,
      })
    );
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    transaction.feePayer = devWalletFrom.publicKey;

    // Sign Transaction, Broadcast, and Confirm
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      devWalletFrom,
    ]);
    // let's log the transaction success
    console.log(`Success! Check out your tx here: 
            https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    // The transaction succeeded: Check it: https://explorer.solana.com/tx/4aNY9XqURJwz3TR8kesWzv1KggAvDhZp9p1Cg63bYvEptQKLKqQEv1pyGE5PijjFmoeLYzb5WSrU6x2H6k9NpKGo?cluster=devnet
  } catch (error) {
    console.error(`Oops! Something went wrong:  ${error}`);
  }
})();

// LET'S EMPTY OUR DEVNET WALLET
(async () => {
  try {
    // Get Balance of  Dev wallet
    const balance = await connection.getBalance(devWalletFrom.publicKey);

    // Create a test transaction to calculate fees
    const transaction2 = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: devWalletFrom.publicKey,
        toPubkey: turbin3PubTo,
        lamports: balance,
      })
    );
    transaction2.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    transaction2.feePayer = devWalletFrom.publicKey;

    // Calculate exact fee rate to transfer entire SOL amount out of account minus fees
    const fee =
      (
        await connection.getFeeForMessage(
          transaction2.compileMessage(),
          "confirmed"
        )
      ).value || 0;

    // Remove our transfer instruction to replace it;
    transaction2.instructions.pop();

    // Now, let's add the instruction back with the correct amount of lamports
    transaction2.add(
      SystemProgram.transfer({
        fromPubkey: devWalletFrom.publicKey,
        toPubkey: turbin3PubTo,
        lamports: balance - fee,
      })
    );

    // sign transaction, broadcast and confirm
    const signature2 = await sendAndConfirmTransaction(
      connection,
      transaction2,
      [devWalletFrom]
    );

    console.log(`Success! Check out your tx here! 
            https://explorer.solana.com/tx/${signature2}?cluster=devnet`);

    // The tx success hash is: https://explorer.solana.com/tx/akVSkA1H1S54vZ91j3YkxzQdwGSa4qcbuWfsXbDUJbHLKJa9mHvivDDZifXCAm6F4eM5An5acsMQdLWjvwiGCaL?cluster=devnet
  } catch (error) {
    console.error(`Oops! Something went wrong: ${error}`);
  }
})();
