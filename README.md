# Forensic Vault - Secure Digital Evidence Management System

## Live Demo

https://forensic-vault.netlify.app/

---

# Overview

Forensic Vault is a secure digital evidence management platform designed to preserve the integrity, authenticity, and immutability of digital evidence.

The system uses cryptographic hashing, RSA digital signatures, and a blockchain-style evidence ledger to ensure that uploaded files cannot be modified without detection.

It is designed for forensic investigations, cybersecurity incidents, law enforcement workflows, and legal evidence management scenarios where evidence authenticity is critical.

---

# Key Features

## Secure Evidence Upload

* Upload digital evidence files securely
* Supports documents, images, videos, and other digital artifacts
* Stores evidence metadata for tracking and verification

## SHA-256 Cryptographic Hashing

* Generates a unique SHA-256 hash for every uploaded file
* Creates a digital fingerprint of evidence
* Detects any unauthorized modifications

## RSA Digital Signatures

* Signs evidence hashes using RSA private keys
* Verifies authenticity using corresponding public keys
* Prevents evidence forgery

## Blockchain-Style Evidence Ledger

* Creates immutable evidence blocks
* Links blocks using cryptographic hashes
* Maintains complete chain-of-custody records

## Evidence Verification System

* Recalculates file hashes
* Validates digital signatures
* Verifies blockchain integrity
* Detects tampering in real time

## Role-Based Access Control

Supports multiple user roles:

* Investigator
* Auditor
* Administrator

## Live Tamper Detection

* Detects file modifications instantly
* Highlights compromised evidence records
* Provides integrity verification results through the UI

---

# Tech Stack

## Frontend

* React.js
* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Security & Cryptography

* SHA-256 Hashing
* RSA Digital Signatures
* Node.js Crypto Module

## APIs

* RESTful API Architecture

## Deployment

* Frontend: Netlify
* Backend: Render

---

# System Architecture

## Step 1: Evidence Upload

When a user uploads evidence:

1. File is received by the backend
2. SHA-256 hash is generated
3. Hash is digitally signed using RSA private key
4. Evidence metadata is stored
5. New blockchain ledger block is created

---

## Step 2: Blockchain Ledger Creation

Each evidence block contains:

| Field             | Description              |
| ----------------- | ------------------------ |
| Index             | Block number             |
| Timestamp         | Evidence upload time     |
| File Hash         | SHA-256 fingerprint      |
| Digital Signature | Signed hash value        |
| Previous Hash     | Previous block reference |
| Block Hash        | Current block identifier |

Any modification to a block invalidates the chain and reveals tampering.

---

## Step 3: Evidence Verification

When verification is requested:

1. File hash is regenerated
2. Digital signature is validated
3. Blockchain integrity is checked
4. Verification result is displayed

---

# Demonstrated Security Concepts

* Cryptographic Hashing
* Digital Signatures
* Chain of Custody
* Tamper Detection
* Blockchain Data Structures
* Evidence Integrity Verification
* Role-Based Access Control (RBAC)

---

# Use Cases

## Digital Forensics

* Preserve digital evidence
* Maintain chain of custody
* Verify evidence integrity

## Cybersecurity Investigations

* Incident response documentation
* Malware evidence preservation
* Security breach investigations

## Legal Evidence Management

* Evidence authenticity verification
* Tamper-proof evidence storage
* Audit trail maintenance

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/TSDPRASAD88/forensic-vault.git
```

## Install Frontend Dependencies

```bash
cd client
npm install
```

## Install Backend Dependencies

```bash
cd server
npm install
```

## Start Frontend

```bash
npm run dev
```

## Start Backend

```bash
npm start
```

---

# Future Enhancements

* Distributed peer-to-peer ledger
* Multi-node blockchain synchronization
* Mobile forensic verification application
* Biometric authentication
* Multi-signature approval workflows
* Advanced audit reporting

---

# Author

## Thamarana Satya Durga Prasad

* GitHub: https://github.com/TSDPRASAD88
* LinkedIn: http://www.linkedin.com/in/satya-durga-prasad-thamarana-a65324326

---

# License

This project is licensed under the MIT License.

---

# Final Note

Forensic Vault demonstrates practical implementation of cryptographic security principles, blockchain-inspired data structures, and digital evidence verification techniques to create a secure and tamper-resistant evidence management platform.
