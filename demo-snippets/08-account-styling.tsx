// ============ STEP 8: 账户组件样式优化 ============
// 替换 return 部分，添加样式

  return (
    <div>
      <h2>账户余额</h2>
      {balance ? (
        <p>
          余额: {balance.available.toFixed(4)} A0GI (总计:{" "}
          {balance.total.toFixed(4)})
        </p>
      ) : (
        <p>暂无账本</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="充值金额"
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button
          onClick={handleDeposit}
          disabled={loading}
          style={{ padding: "5px 15px" }}
        >
          {loading ? "处理中..." : "充值"}
        </button>
      </div>
    </div>
  );