const { getBlockchain } = require("../utils/blockchainUtils");

exports.getChain = async (req, res) => {
  try {
    const chain = await getBlockchain();

    res.json({
      success: true,
      count: chain.length,
      data: chain
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
