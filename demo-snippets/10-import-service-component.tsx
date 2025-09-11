// ============ STEP 10: 导入并使用服务组件 ============
// 在 pages/index.tsx 中：

// 1. 添加 import
import ServiceTab from "../components/ServiceTab";

// 2. 添加共享状态（在现有状态后面添加）
const [selectedProvider, setSelectedProvider] = useState<any>(null);

// 3. 在内容区域添加服务标签页
            {activeTab === "service" && (
              <ServiceTab
                broker={broker}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                message={message}
                setMessage={setMessage}
              />
            )}

// 4. 更新其他标签页的条件
            {activeTab !== "account" && activeTab !== "service" && (
              <div>
                <p>当前标签: {activeTab}</p>
                <p>其他功能待添加...</p>
              </div>
            )}