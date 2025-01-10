import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import prompt from "prompt-sync";

// Generate a new keypair
let kp = Keypair.generate();

console.log(`You've generated a new Solana wallet: 
    ${kp.publicKey.toBase58()}`);

// The public key of the generated keypair is: GcZmVXajacAkRYzPX2M3KncZ6FYqLeTvF34f49FCPiWK

// Copying the output of the following into a JSON file
console.log(`[${kp.secretKey}]`);

// Rewriting the Rust CLI tool for converting between Phantom And Solana Wallets into Typescript
const userPrompt = prompt();

function base58ToWallet() {
  // prompt User for base58 private key
  const base58key: string = userPrompt("Enter your base58 private key here!");

  if (!base58key) {
    console.log("No input provided!");
    return;
  }

  try {
    // Decode the base58 string to a byte array
    const walletBytes = bs58.decode(base58key);
    // convert uint8Array to array for logging
    const walletBytesArray = Array.from(walletBytes);
    console.log("Decoded Wallet Bytes is : ", walletBytesArray);
  } catch (error) {
    console.error("Invalid base58 input. Error: ", error);
  }
}

// Call the function
base58ToWallet();

function walletToBase58(): void {
  const input = prompt({ sigint: true });
  // Get Input from user
  console.log(
    "Please enter the wallet numbers separated by commas and no space. (e.g., 34,68,35..."
  );
  const userInput = input("Enter your wallet Numbers here separated by commas");
  // Let's put in a try/catch block
  try {
    // convert string input into number array
    const numberArray = userInput.split(",").map((num) => parseInt(num.trim()));
    // Validate Input
    if (numberArray.some(isNaN)) {
      throw new Error(
        "Invalid Input: Please enter only numbers separated by commas!"
      );
    }

    // convert to a uint8Array
    const wallet = new Uint8Array(numberArray);
    // convert to base58 string
    const base58Wallet = bs58.encode(wallet);
    console.log("Base58 encoded wallet is: ", base58Wallet);
  } catch (error) {
    console.error("Error is: ", error);
  }
}

walletToBase58();
