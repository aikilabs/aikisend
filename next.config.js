/** @type {import('next').NextConfig} */
const nextConfig = {
    // redirect to gitcoin grantpage if user in /gitcoin
    async redirects() {
        return [
            {
                source: "/gitcoin",
                destination:
                    "https://explorer.gitcoin.co/#/round/10/0x8de918f0163b2021839a8d84954dd7e8e151326d/0x8de918f0163b2021839a8d84954dd7e8e151326d-26]",
                permanent: false,
                basePath: false,
            },
        ];
    },
};

module.exports = nextConfig; 
