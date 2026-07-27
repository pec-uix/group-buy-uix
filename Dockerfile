# GitHub Actions Runner 自訂 Dockerfile
FROM node:22-slim

# 建立 runner 使用者
RUN useradd -m -s /bin/bash runner

WORKDIR /home/runner

# 安裝 .NET 依賴
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY actions-runner-linux-x64-2.330.0.tar.gz /home/runner/
COPY entrypoint.sh /home/runner/entrypoint.sh

RUN cd /home/runner && \
    tar xzf ./actions-runner-linux-x64-2.330.0.tar.gz && \
    rm -f ./actions-runner-linux-x64-2.330.0.tar.gz && \
    bash ./bin/installdependencies.sh && \
    chmod +x /home/runner/entrypoint.sh && \
    mkdir -p /home/runner/group-buy/wwwroot && \
    mkdir -p /home/runner/group-buy/backup && \
    chown -R runner:runner /home/runner/group-buy

USER runner

# 設定運行階段執行的啟動腳本
ENTRYPOINT ["/home/runner/entrypoint.sh"]
