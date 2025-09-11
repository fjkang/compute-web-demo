#!/bin/bash

echo "🚀 快速测试自动化演示脚本"
echo "================================"

# 重置项目
echo "1. 重置项目..."
node demo.js reset

# 测试前几个步骤
echo "2. 测试基础框架..."
node demo.js step 1
echo "✅ 步骤1完成"

node demo.js step 2  
echo "✅ 步骤2完成"

node demo.js next
echo "✅ next命令测试完成"

# 检查状态
echo "3. 检查状态..."
node demo.js status

echo ""
echo "🎉 自动化脚本测试完成！"
echo "现在你可以使用以下命令进行演示："
echo ""
echo "  node demo.js step <数字>   # 执行指定步骤"
echo "  node demo.js next          # 执行下一步"
echo "  node demo.js status        # 查看状态"
echo "  node demo.js reset         # 重置项目"
echo ""