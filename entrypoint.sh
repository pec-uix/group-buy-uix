#!/bin/bash

# 啟動腳本：配置並運行 GitHub Actions Runner

set -e

cd /home/runner

# 檢查必要的環境變數
if [ -z "$GITHUB_URL" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 缺少必要的環境變數"
    echo "需要設定: GITHUB_URL, GITHUB_TOKEN"
    exit 1
fi

echo "🔧 配置 GitHub Actions Runner..."

# 檢查是否已配置
if [ ! -f ".runner" ]; then
    echo "⚙️  首次配置，執行 configure..."
    
    ./config.sh \
        --url "$GITHUB_URL" \
        --token "$GITHUB_TOKEN" \
        --name "self-hosted-runner" \
        --work "$HOME/_work" \
        --labels "self-hosted,linux,self-hosted-${RUNNER_LABEL}" \
        --replace
else
    echo "✅ 已配置，跳過配置步驟"
fi

echo "🚀 啟動 GitHub Actions Runner..."

# 定義清理函數 - 在容器停止時執行
cleanup() {
    echo "🛑 接收到停止信號，執行清理..."
    if [ -n "$RUNNER_PID" ]; then
        kill -TERM "$RUNNER_PID" 2>/dev/null || true
        wait "$RUNNER_PID" 2>/dev/null || true
    fi
    ./config.sh remove --token "$GITHUB_TOKEN"
    exit 0
}

# 設置 trap 捕獲 SIGTERM 和 SIGINT 信號
trap cleanup SIGTERM SIGINT

# 執行 runner（持續監聽任務）在背景執行
./run.sh &
RUNNER_PID=$!

echo "Runner 進程 ID: $RUNNER_PID"

# 等待 runner 進程
wait $RUNNER_PID
