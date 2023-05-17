
const config = {
    testEnvironment: "jsdom",
    verbose: true,
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    }
};


module.exports = config;
