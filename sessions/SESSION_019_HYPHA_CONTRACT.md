# 📋 SESSION #019 — $HYPHA ERC-20 SEPOLIA TESTNET
## GANI HYPHA — Deploy Real $HYPHA Token (Testnet First!)
### Status: ⏳ PENDING | Prerequisite: $500 USDC in treasury

---

## 🎯 TUJUAN

Deploy $HYPHA ERC-20 smart contract ke Sepolia testnet untuk testing.

**INGAT: Testnet dulu (FREE), mainnet nanti setelah audit!**

---

## PREREQUISITES

```
Before SESSION_019:
✅ SCA generating $500+ revenue (dari SESSION_009-012)
✅ $PREMALTA has Uniswap liquidity
✅ Community growing (50+ holders)
✅ Node.js/Hardhat installed locally
```

---

## TODO LIST

### STEP 1: Install Hardhat (Local Machine, Bukan di Server!)

```bash
# Di laptop kamu (bukan Cloudflare sandbox):
mkdir hypha-contracts
cd hypha-contracts
npm init -y
npm install --save-dev hardhat @openzeppelin/contracts @nomicfoundation/hardhat-toolbox dotenv
npx hardhat init
# Choose: TypeScript project
```

### STEP 2: Buat $HYPHA Contract

```solidity
// contracts/HYPHA.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract HYPHA is ERC20, ERC20Burnable, Ownable, ERC20Permit, ERC20Votes {
    
    // === Tokenomics ===
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 Billion
    
    // Allocation
    uint256 public constant COMMUNITY_ALLOCATION = 500_000_000 * 10**18; // 50%
    uint256 public constant TEAM_ALLOCATION = 200_000_000 * 10**18;       // 20%
    uint256 public constant ECOSYSTEM_ALLOCATION = 150_000_000 * 10**18;  // 15%
    uint256 public constant LIQUIDITY_ALLOCATION = 100_000_000 * 10**18;  // 10%
    uint256 public constant RESERVE_ALLOCATION = 50_000_000 * 10**18;     //  5%
    
    constructor(address initialOwner)
        ERC20("GANI HYPHA", "HYPHA")
        Ownable(initialOwner)
        ERC20Permit("GANI HYPHA")
    {
        // Mint to deployer for distribution
        _mint(initialOwner, TOTAL_SUPPLY);
    }
    
    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }
    
    function nonces(address owner)
        public view override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
```

### STEP 3: Buat Staking Contract

```solidity
// contracts/HYPHAStaking.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HYPHAStaking is Ownable, ReentrancyGuard {
    IERC20 public hypha;
    
    uint256 public constant APY = 1850; // 18.50% APY (basis points)
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    struct StakeInfo {
        uint256 amount;
        uint256 stakedAt;
        uint256 lastClaimedAt;
    }
    
    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardClaimed(address indexed user, uint256 reward);
    
    constructor(address _hypha, address initialOwner) Ownable(initialOwner) {
        hypha = IERC20(_hypha);
    }
    
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(hypha.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Claim pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimRewards(msg.sender);
        }
        
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].stakedAt = block.timestamp;
        stakes[msg.sender].lastClaimedAt = block.timestamp;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo memory info = stakes[user];
        if (info.amount == 0) return 0;
        
        uint256 duration = block.timestamp - info.lastClaimedAt;
        return (info.amount * APY * duration) / (10000 * SECONDS_PER_YEAR);
    }
    
    function claimRewards() external nonReentrant {
        _claimRewards(msg.sender);
    }
    
    function _claimRewards(address user) internal {
        uint256 reward = calculateRewards(user);
        if (reward > 0) {
            stakes[user].lastClaimedAt = block.timestamp;
            require(hypha.transfer(user, reward), "Reward transfer failed");
            emit RewardClaimed(user, reward);
        }
    }
    
    function unstake() external nonReentrant {
        StakeInfo memory info = stakes[msg.sender];
        require(info.amount > 0, "Nothing staked");
        
        uint256 reward = calculateRewards(msg.sender);
        uint256 total = info.amount + reward;
        
        totalStaked -= info.amount;
        delete stakes[msg.sender];
        
        require(hypha.transfer(msg.sender, total), "Transfer failed");
        emit Unstaked(msg.sender, info.amount, reward);
    }
}
```

### STEP 4: Deploy ke Sepolia

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  
  // Deploy HYPHA Token
  const HYPHA = await ethers.getContractFactory("HYPHA");
  const hypha = await HYPHA.deploy(deployer.address);
  await hypha.waitForDeployment();
  console.log("HYPHA Token deployed to:", await hypha.getAddress());
  
  // Deploy Staking Contract
  const HYPHAStaking = await ethers.getContractFactory("HYPHAStaking");
  const staking = await HYPHAStaking.deploy(
    await hypha.getAddress(), 
    deployer.address
  );
  await staking.waitForDeployment();
  console.log("Staking Contract deployed to:", await staking.getAddress());
  
  // Transfer 10% supply to staking contract for rewards
  const stakingRewards = ethers.parseEther("100000000"); // 100M HYPHA
  await hypha.transfer(await staking.getAddress(), stakingRewards);
  console.log("Transferred 100M HYPHA to staking contract");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Get Sepolia ETH free from:
# https://sepoliafaucet.com
# https://faucets.chain.link
```

### STEP 5: Verify on Etherscan Sepolia

```bash
npx hardhat verify --network sepolia [CONTRACT_ADDRESS] [CONSTRUCTOR_ARGS]
```

### STEP 6: Update GANI HYPHA App

Update hardcoded values di App.tsx/Tokenomics.tsx dengan real Sepolia addresses.

---

## 💰 COST ESTIMATE

```
Sepolia Testnet Deployment: FREE (get test ETH from faucets)
Mainnet Deployment (future): ~0.5-1 ETH in gas ($1,500-$3,000)
Audit (minimal): Community review via Code4rena/Sherlock
```

---

## 📊 SUCCESS CRITERIA

```
✅ HYPHA.sol deployed to Sepolia
✅ HYPHAStaking.sol deployed to Sepolia
✅ Contracts verified on Etherscan Sepolia
✅ App updated with testnet contract addresses
✅ Staking works in test environment
```

---

*Session #019 | GANI HYPHA | Planned — Month 2-3*
*Priority: P3 — ONLY after revenue flowing*
