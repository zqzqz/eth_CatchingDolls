# TinyGame on ethereum

## Introduction
A ethereum dapp which implements a tiny game -- Catching Dolls.

## Dependency
* npm&node
* ethereum development framework: truffle

## Get Started
* install truffle framework
```Bash
npm install -g truffle
```
* clone project
```Bash
git clone https://github.com/zqzqz/eth_CatchingDolls.git
cd eth_CatchingDolls
```
* install npm dependencies
```Bash
npm install
npm install eth-random
## eth-random is a contract producing random numbers. Only for test.
```
* test contracts
```Bash
truffle develop   ## enter truffle console
>> compile
>> migrate
>> test
```
* launch server (in another terminal)
```Bash
<<<<<<< HEAD
npm run dev
# server runs on localhost:8080 (test mode)
=======
node src/app.js
>>>>>>> c9d6552f3720d359e868523706eb6c94e0b94ef4
```
* install MetaMask plugin on your browser (chrome or firefox)
* import the Mnemonic in truffle console to Metamask

## Status
Just started.
