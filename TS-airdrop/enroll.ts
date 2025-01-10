import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";

// Importing keypair from wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// github Account
const github = Buffer.from("Weebad123", "utf-8");
const encoded = github.toString("base64");
console.log(encoded);

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// Create the program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// Create PDA for my enrollment Account
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];

const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId
);

// Let's attempt to Execute our Enrollment Transaction
async () => {
  try {
    const txHash = await program.methods
      .complete(github)
      .accounts({
        signer: keypair.publicKey,
        // @ts-ignore
        prereq: enrollment_key,
        system_program: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    // Let's log the transaction hash
    console.log(`Success! Check out your transaction here!
            https://explorer.solana.com/tx/${txHash}?cluster=devnet`);

    // The success of the tx is: https://explorer.solana.com/tx/61npYGykdrNzuNvgZqdUBG2iVkhrGoqYRPjeuY5Ro2i39FKxFhR9LjrNPzFKyGPHbRPZuh3iPqWygV7bA5LXkDnk?cluster=devnet
  } catch (error) {
    console.error(`Oops! Something went wrong!: ${error}`);
  }
};
