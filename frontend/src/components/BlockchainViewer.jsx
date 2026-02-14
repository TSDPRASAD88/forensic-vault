import { useEffect, useState } from "react";
import api from "../services/api";

export default function BlockchainViewer() {
  const [chain, setChain] = useState([]);

  const fetchChain = async () => {
    try {
      const res = await api.get("/blockchain");
      setChain(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChain();
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
      <h2 className="text-xl font-semibold mb-6">
        Blockchain Ledger
      </h2>

      <div className="space-y-4">
        {chain.map((block) => {
          const isGenesis = block.index === 0;

          return (
            <div
              key={block.index}
              className={`p-4 rounded-lg border
              ${isGenesis
                  ? "bg-purple-700 border-purple-400"
                  : "bg-gray-700 border-gray-600"
                }`}
            >
              <p className="font-semibold text-lg">
                {isGenesis ? "GENESIS BLOCK" : `Block #${block.index}`}
              </p>

              <p className="text-sm text-gray-200 break-all">
                <strong>Hash:</strong> {block.blockHash}
              </p>

              <p className="text-sm text-gray-300 break-all">
                <strong>Previous:</strong> {block.previousHash}
              </p>

              <p className="text-sm text-gray-300">
                <strong>Timestamp:</strong>{" "}
                {new Date(block.timestamp).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
