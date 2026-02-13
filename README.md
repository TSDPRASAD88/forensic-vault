
# Forensic Vault

* A secure digital evidence storage system that ensures immutability, authenticity, and forensic integrity of uploaded files using cryptographic hashing, digital signatures, and blockchain-style ledger.
* This system is designed for use in legal, law enforcement, and cyber forensic scenarios where evidence must be tamper-proof and verifiable.

# Overview

## Traditional storage systems can be tampered with silently — but Forensic Vault prevents that by:
* Generating a unique cryptographic hash (SHA-256) for every file
* Signing the hash with a private key to prove originality
* Recording a tamper-proof chain of evidence blocks (blockchain-style)
* Allowing verification of file authenticity at any time

# Once stored, evidence cannot be secretly modified without detection.

# Key Features

* Secure upload of digital evidence (images, videos, documents)
* SHA-256 hash generation for every file
* RSA digital signature for integrity and authenticity
* Tamper-proof blockchain of evidence blocks
* Visualization & verification of stored evidence
* User roles: Investigator, Auditor, Admin
* Live tamper detection

# Built Using

* Frontend:React
* Backend:Node.js + Express.js
* Database:MongoDB
* Cryptography:Node.js crypto module
* APIs:REST Endpoints


## How It Works

1. Upload Evidence
* Users upload a file via UI → backend:
* Calculates SHA-256 hash
* Digitally signs hash with RSA private key
* Stores file + metadata in database
* Creates a block in blockchain ledger

2. Blockchain Ledger
Each block contains:
* Field:Description
* index:Block number
* timestamp:When evidence was stored
* fileHash:File fingerprint
* digitalSignature:Signed hash
* previousHash:Previous block hash
* blockHash:Hash of this block
- Any modification breaks the chain.

3. Verify Evidence
- User selects a stored record:
* Re-generates SHA-256 hash
* Verifies digital signature with public key
* Confirms blockchain integrity
* Shows result on UI

# Demo Use Cases

* Upload new evidence
* View blockchain history
* Verify evidence integrity
* Simulate tampering & detect issue
* This demonstrates tamper detection in real time.

# Security Design Notes
* Private keys stored securely
* Public key shared for verification
* Hashing uses SHA-256
* Immutable ledger
* No single point of failure

## Future Enhancements
* Distributed peer-to-peer ledger
* Mobile app for on-site verification
* Biometric user access
* Multi-signature authorization

# Contribute
Feel free to contribute:
* Fork the repo
* Create a new branch
* Add feature / fix bug
* Make a pull request

# License
* This project is licensed under MIT License.