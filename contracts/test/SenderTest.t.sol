pragma solidity ^0.8.17;

import "../lib/forge-std/src/Test.sol";
import "../lib/solmate/src/tokens/ERC20.sol";

contract SenderTest is Test {
    // Test USDC and Dai tokens
    ERC20 internal usdc = ERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    ERC20 internal dai = ERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);

    // permit2 contract
    IPermit2 permit2 = IPermit2(0x000000000022D473030F116dDEE9F6B43aC78BA3);

    // multicaller contract
    IMulticaller multicall = IMulticaller(0x000000000088228fCF7b8af41Faf3955bD0B3A41);

    bytes32 public constant _PERMIT_BATCH_TRANSFER_FROM_TYPEHASH = keccak256(
        "PermitBatchTransferFrom(TokenPermissions[] permitted,address spender,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)"
    );

    bytes32 public constant _TOKEN_PERMISSIONS_TYPEHASH = keccak256("TokenPermissions(address token,uint256 amount)");
    


    uint256 senderKey;
    address sender;

    uint256 senderKey2;

    address[] recipients;

    function setUp() public {
        vm.chainId(5);
        uint256 forkId = vm.createFork(string.concat("https://eth-mainnet.g.alchemy.com/v2/", vm.envString("ALCHEMY_API")));
        vm.selectFork(forkId);
        

        senderKey = 1;
        senderKey2 = vm.envString("SENDER2_PRIVATE_KEY");
        sender = vm.addr(senderKey);

        // deal tokens to sender
        deal(address(usdc),sender, 1_000 * 10e6);
        deal(address(dai),sender, 1_000 * 10e18);

        vm.startPrank(sender);

        // grant token approval for permit2
        usdc.approve(address(permit2), type(uint256).max);
        dai.approve(address(permit2), type(uint256).max);

        // emit log_named_uint("usdc balance",usdc.balanceOf(sender));
        // emit log_named_uint("dai balance",dai.balanceOf(sender));

        for(uint i=0; i<=2; i++) {
            recipients.push(vm.addr(100+i));
        }
    }

    function test_transfer() public {
        IPermit2.TokenPermissions[] memory tokenPermissions = new IPermit2.TokenPermissions[](2);
        address[] memory _tokens = new address[](2);
        (_tokens[0],_tokens[1])=(address(usdc), address(dai));

        // emit log_named_address("usdc address", _tokens[0]);
        // emit log_named_address("dai address", _tokens[1]);

        for(uint i=0; i<2; ++i) {
            IPermit2.TokenPermissions memory tokenPermission = IPermit2.TokenPermissions({
                token: _tokens[i],
                amount: 100 * 10e6
            });
            tokenPermissions[i] = tokenPermission;
        }

        IPermit2.PermitBatchTransferFrom memory permit = IPermit2.PermitBatchTransferFrom({
            permitted: tokenPermissions,
            nonce: 0,
            deadline: block.timestamp + 12
        });

        IPermit2.SignatureTransferDetails[] memory sigTransferDetails = new IPermit2.SignatureTransferDetails[](2);
        
        for(uint i=0; i<sigTransferDetails.length; ++i) {
            IPermit2.SignatureTransferDetails memory sigTransferDetail = IPermit2.SignatureTransferDetails({
                to: recipients[i],
                requestedAmount: 10 * 10e6
            });
            sigTransferDetails[i] = sigTransferDetail;
        }

        bytes memory _sig = _signPermit(permit, sender, senderKey);

        permit2.permitTransferFrom(permit, sigTransferDetails, sender, _sig);

        // assert balances of both recipients
        assertEq(usdc.balanceOf(recipients[0]), 10 * 10e6);
        assertEq(dai.balanceOf(recipients[1]), 10 * 10e6);

        vm.stopPrank();
    }

    function test_sig() public {
        IPermit2.TokenPermissions[] memory tokenPermissions2 = new IPermit2.TokenPermissions[](1);
        tokenPermissions2[0] = IPermit2.TokenPermissions({
                token: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB,
                amount: 1 * 10**18
            });
        
         IPermit2.PermitBatchTransferFrom memory permit_2 = IPermit2.PermitBatchTransferFrom({
            permitted: tokenPermissions2,
            nonce: 0,
            deadline: 0
        });
        bytes memory _sig2 = _signPermit(permit_2, 0xccf69A469FA68bC7754efBCf4c5ec105dcd6333d, senderKey2);
        emit log_named_bytes("sig2", _sig2);
        // assertEq(1000000000000000000, tokenPermissions2[0].amount);
    }


    // sign EIP712 permit 
    function _signPermit(
        IPermit2.PermitBatchTransferFrom memory permit,
        address spender,
        uint256 signerKey
    )
        internal
        view
        returns(bytes memory sig)
    {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, _get712Hash(permit, spender));
        return abi.encodePacked(r, s, v);
    }

    // compute EIP712 typed hash for PermitBatchTransferFrom
    function _get712Hash(IPermit2.PermitBatchTransferFrom memory permit, address spender)
        internal
        view
        returns(bytes32 h)
    {
        uint256 numPermitted = permit.permitted.length;
        bytes32[] memory tokenPermissionHashes = new bytes32[](numPermitted);

        for(uint i=0; i<numPermitted; i++) {
            tokenPermissionHashes[i] = _hashTokenPermissions(permit.permitted[i]);
        }

        return keccak256(abi.encodePacked(
            "\x19\x01",
            permit2.DOMAIN_SEPARATOR(),
            keccak256(
                abi.encode(
                    _PERMIT_BATCH_TRANSFER_FROM_TYPEHASH,
                    keccak256(abi.encodePacked(tokenPermissionHashes)),
                    spender,
                    permit.nonce,
                    permit.deadline
                )
            )
        ));
    }

    // compute EIP712 typed hash of TokenPermissions type
    function _hashTokenPermissions(IPermit2.TokenPermissions memory permitted)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(_TOKEN_PERMISSIONS_TYPEHASH, permitted));
    }

}

// interface for Permit2
interface IPermit2 {

    struct PermitBatchTransferFrom {
        // the tokens and corresponding amounts permitted for a transfer
        TokenPermissions[] permitted;
        // a unique value for every token owner's signature to prevent signature replays
        uint256 nonce;
        // deadline on the permit signature
        uint256 deadline;
    }

    struct TokenPermissions {
        // ERC20 token address
        address token;
        // the maximum amount that can be spent
        uint256 amount;
    }

    struct SignatureTransferDetails {
        // recipient address
        address to;
        // spender requested amount
        uint256 requestedAmount;
    }

    function permitTransferFrom(
        PermitBatchTransferFrom memory permit,
        SignatureTransferDetails[] calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external;

    function DOMAIN_SEPARATOR() external view returns (bytes32);
}

// interface for Multicaller
interface IMulticaller {
    function aggregate(address[] calldata targets, bytes[] calldata data, uint256[] calldata values)
        external;
}