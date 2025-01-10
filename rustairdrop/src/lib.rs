mod programs;

#[cfg(test)]
mod tests {
    use crate::programs::Turbin3_prereq::{TurbinePrereqProgram, CompleteArgs, UpdateArgs};
    use solana_client::rpc_client::RpcClient;
    use solana_program::{pubkey::Pubkey, system_instruction::transfer,};
    use solana_sdk::{message::Message, signature::{read_keypair_file, Keypair, Signer}, system_program, transaction::Transaction};
    use bs58;
    use std::str::FromStr;
    use std::io::{self, BufRead};

    const RPC_URL: &str = "https://api.devnet.solana.com";

    #[test]
    fn keygen() {
        // Let's create a new Keypair
        let kp = Keypair::new();
        // Print newly created keypair to the console
        println!("You've generated a new Solana wallet: {}", kp.pubkey().to_string());
        println!("");
        println!("To save your wallet, Copy and Paste the following into a JSON file!");
        println!("{:?}", kp.to_bytes());
    }

    #[test]
    fn airdrop() {
        // let's read our keypair file
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        // Connected to Solana Devnet RPC Client
        let client = RpcClient::new(RPC_URL);
        // Now, we're gonna claim 2 SOL
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(s) => {
                println!("Success! Check out your TX here");
                println!("https://explorer.solana.com/tx/{}?cluster=devnet", s.to_string());
            },
            Err(e) => println!("Oops, Something went wrong: {}", e.to_string())
        };
    }

    #[test]
    fn transfer_sol() {
        // Let's get our dev-wallet.json file 
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        // Define our Turbin3 public key
        let turbin3_pubkey = Pubkey::from_str("EnhBRG71jQBpJE5yj7QMEYLaWaHsPGHVbs3do6dg6p9q").unwrap();
        // Create a solana devnet connection
        let rpc_client = RpcClient::new(RPC_URL);
        // To sign transactions, we're gonna need recent blockhash
        let recent_blockhash = rpc_client.get_latest_blockhash().expect("Failed to get recent blockhash");
        // We're gonna transfer 0.1 SOL from our dev wallet to Turbin3 wallet
        //let transaction = Transaction::new_signed_with_payer(&[transfer(&keypair.pubkey(), &turbin3_pubkey, 100_000_000)], Some(&keypair.pubkey()), &vec![&keypair], recent_blockhash);
        // Let's submit transaction and grab the tx Signature
        //let signature = rpc_client.send_and_confirm_transaction(&transaction).expect("Failed to send transaction");
        // Print and grab transaction signature on success
        //println!("Success! Check out your TX here: https://explorer.solana.com/tx/{}?cluster=devnet", signature);

        // ATTEMPTING TO EMPTY THE DEVNET WALLET 
        let balance = rpc_client.get_balance(&keypair.pubkey()).expect("Failed to get balance");
        // creating test transaction to calculate fees
        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &turbin3_pubkey, balance)],
            Some(&keypair.pubkey()),
            &recent_blockhash
        );
        // Now, we ask the Rpc client what the fee for this mock transaction gonna be
        let fee = rpc_client.get_fee_for_message(&message).expect("Failed to get fee calculator");
        // Let's transact with lamports of : balance -fee
        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &turbin3_pubkey, balance - fee)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash
        );
        // let's submit and grab the tx signature
        let signature = rpc_client.send_and_confirm_transaction(&transaction).expect("Failed to send transaction");
        println!("Success! Check out your TX here: https://explorer.solana.com/tx/{}?cluster=devnet", signature);
    }

    #[test]
    fn enroll() {
        // Let's create a Solana Devnet Connection
        let rpc_client = RpcClient::new(RPC_URL);
        // Let's define our accounts
        let signer = read_keypair_file("turbin3-wallet.json").expect("Couldn't find wallet file");
        // Creating first PDA
        let prereq = TurbinePrereqProgram::derive_program_address(&[b"prereq", signer.pubkey().to_bytes().as_ref()]);

        // Let's set our github account
        let args = CompleteArgs {
            github: b"Weebad123".to_vec()
        };

        // Need Recent blockhash to publish our transaction
        let blockhash = rpc_client.get_latest_blockhash().expect("Failed to get recent blockhash");
        
        // Now, we need to invoke our complete function
        let transaction = TurbinePrereqProgram::complete(
            &[&signer.pubkey(), &prereq, &system_program::id()],
            &args,
            Some(&signer.pubkey()),
            &[&signer],
            blockhash
        );

        // Let's publish our transaction
        let signature = rpc_client.send_and_confirm_transaction(&transaction).expect("Failed to send transaction");
        // Print tx hash upon success
        println!("Success! Check out your TX here: https://explorer.solana.com/tx/{}?cluster=devnet", signature);
    }

    #[test]
    fn base58_to_wallet() {
        // Get User's private key as base58
        println!("Input your private key as base58: ");
        let stdin = io::stdin();
        let base58 = stdin.lock().lines().next().unwrap().unwrap();
        println!(" Your wallet file is: ");
        let wallet = bs58::decode(base58).into_vec().unwrap();
        println!("{:?}", wallet);
    }

    #[test]
    fn wallet_to_base58() {
        // Let's Get user's private key as bytes array
        println!("Input your private key as a wallet file byte array: ");
        let stdin = io::stdin();
        let wallet = stdin.lock().lines().next().unwrap().unwrap().trim_start_matches("[").trim_end_matches("]").split(",").map(|s| s.trim().parse::<u8>().unwrap()).collect::<Vec<u8>>();
        println!("Your private key is: ");
        let base58 = bs58::encode(wallet).into_string();
        println!("{:?}", base58);
    }
}
