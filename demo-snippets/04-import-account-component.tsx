// ============ STEP 4: 导入并使用账户组件 ============
// 在 pages/index.tsx 中：

// 1. 添加 import
import AccountTab from "../components/AccountTab";

// 2. 添加共享状态（在现有状态后面添加）
const [message, setMessage] = useState("");

// 3. 替换内容区域部分
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          minHeight: "400px",
        }}
      >
        {!broker ? (
          <div>正在初始化...</div>
        ) : (
          <>
            {activeTab === "account" && (
              <AccountTab
                broker={broker}
                message={message}
                setMessage={setMessage}
              />
            )}
            
            {activeTab !== "account" && (
              <div>
                <p>当前标签: {activeTab}</p>
                <p>其他功能待添加...</p>
              </div>
            )}
          </>
        )}

        {/* 消息提示 */}
        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: message.includes("成功") ? "#d4edda" : "#f8d7da",
              color: message.includes("成功") ? "#155724" : "#721c24",
            }}
          >
            {message}
          </div>
        )}
      </div>