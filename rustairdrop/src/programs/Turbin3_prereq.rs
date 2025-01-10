use solana_idlgen::idlgen;

idlgen!(
  {
    "version": "0.1.0",
    "name": "turbine_prereq",
    "address": "ADcaide4vBtKuyZQqdU689YqEGZMCmS4tL35bdTv9wJa",
    "metadata": {
        "name": "turbine_prereq",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor",
        "address": "ADcaide4vBtKuyZQqdU689YqEGZMCmS4tL35bdTv9wJa"
    },
    "instructions": [
        {
            "name": "complete",
            "discriminator": [0, 77, 224, 147, 136, 25, 88, 76],
            "accounts": [
                {
                    "name": "signer",
                    "writable": true,
                    "isSigner": true,
                    "isMut": true
                },
                {
                    "name": "prereq",
                    "writable": true,
                    "isSigner": false,
                    "isMut": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [112, 114, 101, 114, 101, 113]
                            },
                            {
                                "kind": "account",
                                "path": "signer"
                            }
                        ]
                    }
                },
                {
                    "name": "system_program",
                    "isMut": false,
                    "isSigner": false,
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "github",
                    "type": "bytes"
                }
            ]
        },
        {
            "name": "update",
            "discriminator": [219, 200, 88, 176, 158, 63, 253, 127],
            "accounts": [
                {
                    "name": "signer",
                    "writable": true,
                    "isSigner": true,
                    "isMut": true
                },
                {
                    "name": "prereq",
                    "writable": true,
                    "isSigner": false,
                    "isMut": true
                },
                {
                    "name": "system_program",
                    "isSigner": false,
                    "isMut": false,
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "github",
                    "type": "bytes"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "SolanaCohort5Account",
            "discriminator": [167, 81, 85, 136, 32, 169, 137, 77],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "github",
                        "type": "bytes"
                    },
                    {
                        "name": "key",
                        "type": "pubkey"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidGithubAccount",
            "msg": "Invalid Github account"
        }
    ],
    "types": [
        {
            "name": "SolanaCohort5Account",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "github",
                        "type": "bytes"
                    },
                    {
                        "name": "key",
                        "type": "pubkey"
                    }
                ]
            }
        }
    ]
}
);

